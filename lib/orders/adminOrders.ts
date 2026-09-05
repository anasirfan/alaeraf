import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, OrderStatus, PaymentMethod, PaymentStatus } from "@/types/database.types";

// Accepts the cookie-aware server client used by every admin screen — RLS
// (orders_owner_select / order_items_owner_select, 0004_rls_policies.sql)
// already grants admins full read access via is_admin(), so these queries
// never need — and never use — the service-role client.
type SupabaseServerClient = SupabaseClient<Database>;

export type OrderStatusFilter = OrderStatus | "all";
export type PaymentStatusFilter = PaymentStatus | "all";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export const PAYMENT_STATUSES: PaymentStatus[] = ["unpaid", "paid", "refunded"];

export type AdminOrderCustomer = { id: string; full_name: string | null; phone: string | null; email: string | null };
export type AdminOrderAddress = {
  id: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  delivery_notes: string | null;
};
export type AdminOrderRoPlant = { id: string; name: string; address: string | null };

export type AdminOrderListItem = {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  customer: AdminOrderCustomer | null;
  address: AdminOrderAddress | null;
  ro_plant: AdminOrderRoPlant | null;
};

export type AdminOrderItem = {
  id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export type AdminOrderDetail = AdminOrderListItem & {
  notes: string | null;
  updated_at: string;
  items: AdminOrderItem[];
};

export type AdminOrderFilters = {
  search?: string;
  status?: OrderStatusFilter;
  paymentStatus?: PaymentStatusFilter;
  roPlantId?: string;
  dateFrom?: string; // "YYYY-MM-DD"
  dateTo?: string; // "YYYY-MM-DD"
  page?: number;
  pageSize?: number;
};

export type AdminOrderListResult = {
  rows: AdminOrderListItem[];
  count: number;
  page: number;
  pageSize: number;
};

const ORDER_SELECT = `
  id, order_number, status, payment_method, payment_status, subtotal, delivery_fee, total, notes,
  created_at, updated_at,
  customer:profiles!orders_customer_id_fkey(id, full_name, phone, email),
  address:addresses!orders_address_id_fkey(id, recipient_name, phone, address_line, area, latitude, longitude, delivery_notes),
  ro_plant:ro_plants!orders_assigned_ro_plant_id_fkey(id, name, address)
`;

/**
 * Wraps a free-text search term as a PostgREST-safe quoted ILIKE pattern
 * for use inside a `.or(...)` filter string — quoting (rather than
 * stripping) commas/parens/quotes in the term keeps the whole search
 * server-side and avoids breaking the or-expression's own syntax on
 * arbitrary admin input.
 */
function quotedIlike(term: string): string {
  const escaped = term.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"%${escaped}%"`;
}

/**
 * Server-side, paginated order search for /admin/orders. Never fetches the
 * whole table into the browser: filtering, search, and paging all happen
 * in the query itself (`.range()` + `count: "exact"`).
 *
 * Search-by-customer-name/phone requires a small first-pass lookup against
 * profiles (there's no single-query OR across a base table column and a
 * joined table's columns in PostgREST) — still server-side, just two round
 * trips instead of one, and only when a search term is actually given.
 */
export async function listOrdersForAdmin(
  supabase: SupabaseServerClient,
  filters: AdminOrderFilters = {},
): Promise<AdminOrderListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 100);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const term = filters.search?.trim();
  let matchingCustomerIds: string[] = [];
  if (term) {
    const pattern = quotedIlike(term);
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .or(`full_name.ilike.${pattern},phone.ilike.${pattern}`)
      .limit(200);
    matchingCustomerIds = (data ?? []).map((row) => row.id);
  }

  let query = supabase
    .from("orders")
    .select(ORDER_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (term) {
    const pattern = quotedIlike(term);
    const orParts = [`order_number.ilike.${pattern}`];
    if (matchingCustomerIds.length > 0) {
      orParts.push(`customer_id.in.(${matchingCustomerIds.join(",")})`);
    }
    query = query.or(orParts.join(","));
  }
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.paymentStatus && filters.paymentStatus !== "all") {
    query = query.eq("payment_status", filters.paymentStatus);
  }
  if (filters.roPlantId) {
    query = query.eq("assigned_ro_plant_id", filters.roPlantId);
  }
  if (filters.dateFrom) {
    query = query.gte("created_at", `${filters.dateFrom}T00:00:00.000Z`);
  }
  if (filters.dateTo) {
    const next = new Date(`${filters.dateTo}T00:00:00.000Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    query = query.lt("created_at", next.toISOString());
  }

  const { data, error, count } = await query;
  if (error) throw new Error("Couldn't load orders.");

  return {
    rows: (data ?? []) as unknown as AdminOrderListItem[],
    count: count ?? 0,
    page,
    pageSize,
  };
}

/**
 * Full detail for one order — the customer, delivery address, assigned RO
 * plant, and line items in a single round trip. Returns null for a
 * missing/invalid id rather than throwing, so the page can render a clean
 * "not found" state instead of a raw error.
 */
export async function getOrderForAdmin(supabase: SupabaseServerClient, id: string): Promise<AdminOrderDetail | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(`${ORDER_SELECT}, items:order_items(id, product_id, product_name, unit_price, quantity, subtotal)`)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error("Couldn't load this order.");
  if (!data) return null;

  return data as unknown as AdminOrderDetail;
}

export type RoPlantOption = { id: string; name: string };

/**
 * Lightweight RO plant list for the filter dropdown. Includes inactive
 * plants too — an old order can still be historically assigned to one, and
 * filtering by it should still work. (Full RO plant management is a
 * separate, not-yet-built admin screen — this is read-only.)
 */
export async function listRoPlantOptions(supabase: SupabaseServerClient): Promise<RoPlantOption[]> {
  const { data, error } = await supabase.from("ro_plants").select("id, name").order("name", { ascending: true });
  if (error) throw new Error("Couldn't load RO plants.");
  return data ?? [];
}
