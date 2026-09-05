import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SubscriptionFrequency, SubscriptionStatus } from "@/types/database.types";

// Accepts the cookie-aware server client used by every customer/admin
// screen — RLS (subscriptions_owner_select / subscription_items_owner_select,
// 0004_rls_policies.sql, tightened by 0008_subscriptions.sql) already scopes
// reads correctly for both a customer and an admin, so nothing here ever
// needs — or uses — the service-role client.
type SupabaseServerClient = SupabaseClient<Database>;

export type SubscriptionPlanRow = Database["public"]["Tables"]["subscription_plans"]["Row"];

export const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ["active", "paused", "cancelled"];

/**
 * Active plans a customer can subscribe to. Never fabricated — an empty
 * result means no admin has created a plan yet, and the /subscribe page
 * handles that as a real empty state rather than showing placeholder plans.
 */
export async function listActiveSubscriptionPlans(supabase: SupabaseServerClient): Promise<SubscriptionPlanRow[]> {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error("Couldn't load subscription plans.");
  return data ?? [];
}

export type SubscriptionAddress = {
  id: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  delivery_notes: string | null;
};

export type SubscriptionPlanSummary = { id: string; name: string; slug: string; default_frequency: SubscriptionFrequency };

export type SubscriptionItemDetail = {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product: { id: string; name: string; size_label: string | null; product_type: string } | null;
};

export type SubscriptionDetail = {
  id: string;
  status: SubscriptionStatus;
  frequency: SubscriptionFrequency;
  quantity: number;
  next_delivery_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer_id: string;
  plan: SubscriptionPlanSummary | null;
  address: SubscriptionAddress | null;
  items: SubscriptionItemDetail[];
};

const SUBSCRIPTION_SELECT = `
  id, status, frequency, quantity, next_delivery_date, notes, created_at, updated_at, customer_id,
  plan:subscription_plans!subscriptions_plan_id_fkey(id, name, slug, default_frequency),
  address:addresses!subscriptions_address_id_fkey(id, recipient_name, phone, address_line, area, latitude, longitude, delivery_notes),
  items:subscription_items(id, product_id, quantity, unit_price, product:products(id, name, size_label, product_type))
`;

/**
 * The signed-in customer's own subscriptions, most recent first. RLS scopes
 * this to their own rows regardless, but the explicit .eq() below is
 * defense-in-depth (same convention as the addresses/orders code) — not the
 * only thing standing between a customer and someone else's subscription.
 */
export async function listMySubscriptions(supabase: SupabaseServerClient, customerId: string): Promise<SubscriptionDetail[]> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(SUBSCRIPTION_SELECT)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Couldn't load your subscriptions.");
  return (data ?? []) as unknown as SubscriptionDetail[];
}

export async function getMySubscription(
  supabase: SupabaseServerClient,
  customerId: string,
  id: string,
): Promise<SubscriptionDetail | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(SUBSCRIPTION_SELECT)
    .eq("id", id)
    .eq("customer_id", customerId)
    .maybeSingle();

  if (error) throw new Error("Couldn't load this subscription.");
  return (data as unknown as SubscriptionDetail) ?? null;
}

// --------------------------------------------------------------------------
// Admin queries
// --------------------------------------------------------------------------

export type AdminSubscriptionCustomer = { id: string; full_name: string | null; phone: string | null; email: string | null };

export type AdminSubscriptionListItem = {
  id: string;
  status: SubscriptionStatus;
  frequency: SubscriptionFrequency;
  next_delivery_date: string | null;
  notes: string | null;
  created_at: string;
  customer: AdminSubscriptionCustomer | null;
  plan: SubscriptionPlanSummary | null;
  address: SubscriptionAddress | null;
  items: SubscriptionItemDetail[];
};

export type SubscriptionStatusFilter = SubscriptionStatus | "all";

export type AdminSubscriptionFilters = {
  search?: string;
  status?: SubscriptionStatusFilter;
  page?: number;
  pageSize?: number;
};

export type AdminSubscriptionListResult = {
  rows: AdminSubscriptionListItem[];
  count: number;
  page: number;
  pageSize: number;
};

const ADMIN_SUBSCRIPTION_SELECT = `
  id, status, frequency, next_delivery_date, notes, created_at,
  customer:profiles!subscriptions_customer_id_fkey(id, full_name, phone, email),
  plan:subscription_plans!subscriptions_plan_id_fkey(id, name, slug, default_frequency),
  address:addresses!subscriptions_address_id_fkey(id, recipient_name, phone, address_line, area, latitude, longitude, delivery_notes),
  items:subscription_items(id, product_id, quantity, unit_price, product:products(id, name, size_label, product_type))
`;

function quotedIlike(term: string): string {
  const escaped = term.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"%${escaped}%"`;
}

/**
 * Server-side, paginated subscription search for /admin/subscriptions — same
 * shape as lib/orders/adminOrders.ts's listOrdersForAdmin: never fetches
 * the whole table, and search-by-customer-name/phone is a small first-pass
 * lookup against profiles (PostgREST has no single-query OR across a base
 * column and a joined table's columns).
 */
export async function listSubscriptionsForAdmin(
  supabase: SupabaseServerClient,
  filters: AdminSubscriptionFilters = {},
): Promise<AdminSubscriptionListResult> {
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
    .from("subscriptions")
    .select(ADMIN_SUBSCRIPTION_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (term) {
    if (matchingCustomerIds.length > 0) {
      query = query.in("customer_id", matchingCustomerIds);
    } else {
      // No matching customer — force an empty result rather than silently
      // ignoring the search term and returning every subscription.
      query = query.eq("customer_id", "00000000-0000-0000-0000-000000000000");
    }
  }
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data, error, count } = await query;
  if (error) throw new Error("Couldn't load subscriptions.");

  return {
    rows: (data ?? []) as unknown as AdminSubscriptionListItem[],
    count: count ?? 0,
    page,
    pageSize,
  };
}

export async function getSubscriptionForAdmin(
  supabase: SupabaseServerClient,
  id: string,
): Promise<AdminSubscriptionListItem | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(ADMIN_SUBSCRIPTION_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error("Couldn't load this subscription.");
  return (data as unknown as AdminSubscriptionListItem) ?? null;
}

/**
 * All plans for the admin plans screen (active and inactive — unlike
 * listActiveSubscriptionPlans, which is customer-facing).
 */
export async function listPlansForAdmin(supabase: SupabaseServerClient): Promise<SubscriptionPlanRow[]> {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error("Couldn't load subscription plans.");
  return data ?? [];
}
