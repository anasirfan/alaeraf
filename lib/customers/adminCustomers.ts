import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type SupabaseServerClient = SupabaseClient<Database>;

export type AdminCustomerListItem = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  orders: { count: number }[];
  subscriptions: { count: number }[];
  addresses: { count: number }[];
};

export type AdminCustomerFilters = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export type AdminCustomerListResult = {
  rows: AdminCustomerListItem[];
  count: number;
  page: number;
  pageSize: number;
};

/** Same quoting approach as lib/orders/adminOrders.ts's quotedIlike(). */
function quotedIlike(term: string): string {
  const escaped = term.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"%${escaped}%"`;
}

const CUSTOMER_SELECT = `
  id, full_name, phone, email, created_at,
  orders:orders!orders_customer_id_fkey(count),
  subscriptions:subscriptions!subscriptions_customer_id_fkey(count),
  addresses:addresses!addresses_customer_id_fkey(count)
`;

/**
 * Paginated customer directory — deliberately scoped to role = 'customer'
 * so the one admin account (or any other admins) never shows up in what's
 * meant to be a customer list. Search matches name, phone, or email.
 */
export async function listCustomersForAdmin(
  supabase: SupabaseServerClient,
  filters: AdminCustomerFilters = {},
): Promise<AdminCustomerListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 100);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("profiles")
    .select(CUSTOMER_SELECT, { count: "exact" })
    .eq("role", "customer")
    .order("created_at", { ascending: false })
    .range(from, to);

  const term = filters.search?.trim();
  if (term) {
    const pattern = quotedIlike(term);
    query = query.or(`full_name.ilike.${pattern},phone.ilike.${pattern},email.ilike.${pattern}`);
  }

  const { data, error, count } = await query;
  if (error) throw new Error("Couldn't load customers.");

  return {
    rows: (data ?? []) as unknown as AdminCustomerListItem[],
    count: count ?? 0,
    page,
    pageSize,
  };
}

export type AdminCustomerAddress = {
  id: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  area: string | null;
  is_default: boolean;
};

export type AdminCustomerOrderSummary = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
};

export type AdminCustomerSubscriptionSummary = {
  id: string;
  status: string;
  next_delivery_date: string | null;
  plan: { name: string } | null;
};

export type AdminCustomerDetail = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  addresses: AdminCustomerAddress[];
  orders: AdminCustomerOrderSummary[];
  subscriptions: AdminCustomerSubscriptionSummary[];
};

/**
 * Full profile for one customer's admin detail page — their saved
 * addresses, their most recent orders (capped at 20; the full history
 * stays available via Admin → Orders filtered by searching their name),
 * and every subscription they have.
 */
export async function getCustomerDetailForAdmin(
  supabase: SupabaseServerClient,
  id: string,
): Promise<AdminCustomerDetail | null> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, phone, email, created_at, role")
    .eq("id", id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== "customer") return null;

  const [{ data: addresses }, { data: orders }, { data: subscriptions }] = await Promise.all([
    supabase
      .from("addresses")
      .select("id, recipient_name, phone, address_line, area, is_default")
      .eq("customer_id", id)
      .order("is_default", { ascending: false }),
    supabase
      .from("orders")
      .select("id, order_number, status, total, created_at")
      .eq("customer_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("subscriptions")
      .select("id, status, next_delivery_date, plan:subscription_plans(name)")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return {
    id: profile.id,
    full_name: profile.full_name,
    phone: profile.phone,
    email: profile.email,
    created_at: profile.created_at,
    addresses: (addresses ?? []) as AdminCustomerAddress[],
    orders: (orders ?? []) as AdminCustomerOrderSummary[],
    subscriptions: (subscriptions ?? []) as unknown as AdminCustomerSubscriptionSummary[],
  };
}
