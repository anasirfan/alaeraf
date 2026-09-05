import type { Metadata } from "next";
import { Package, PackageCheck, Tags, ClipboardList, Clock, RefreshCw, Users, Droplets } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Every count below goes through the normal RLS-scoped server client (never
 * the service-role client) — the existing admin RLS policies already grant
 * full read access to these tables for role='admin', so no policy needed
 * to change for this. count: "exact", head: true asks Postgres for a row
 * count without transferring any rows, which is all a dashboard tile needs.
 * No demo/fake data is inserted anywhere — an empty table simply reads 0.
 */
async function getDashboardCounts() {
  const supabase = await createClient();

  const [
    productsTotal,
    productsActive,
    categoriesTotal,
    ordersTotal,
    ordersPending,
    subscriptionsActive,
    customersTotal,
    roPlantsActive,
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    supabase.from("ro_plants").select("*", { count: "exact", head: true }).eq("is_active", true),
  ]);

  return {
    productsTotal: productsTotal.count ?? 0,
    productsActive: productsActive.count ?? 0,
    categoriesTotal: categoriesTotal.count ?? 0,
    ordersTotal: ordersTotal.count ?? 0,
    ordersPending: ordersPending.count ?? 0,
    subscriptionsActive: subscriptionsActive.count ?? 0,
    customersTotal: customersTotal.count ?? 0,
    roPlantsActive: roPlantsActive.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const counts = await getDashboardCounts();

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl text-forest">Overview</h2>
        <p className="mt-1.5 text-sm text-muted">A snapshot of the store, updated live from the database.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Products" value={counts.productsTotal} icon={Package} />
        <StatCard label="Active Products" value={counts.productsActive} icon={PackageCheck} />
        <StatCard label="Total Categories" value={counts.categoriesTotal} icon={Tags} />
        <StatCard label="Total Orders" value={counts.ordersTotal} icon={ClipboardList} />
        <StatCard
          label="Pending Orders"
          value={counts.ordersPending}
          icon={Clock}
          tone={counts.ordersPending > 0 ? "warning" : "default"}
        />
        <StatCard label="Active Subscriptions" value={counts.subscriptionsActive} icon={RefreshCw} />
        <StatCard label="Registered Customers" value={counts.customersTotal} icon={Users} />
        <StatCard
          label="Active RO Plants"
          value={counts.roPlantsActive}
          icon={Droplets}
          tone={counts.roPlantsActive === 0 ? "warning" : "default"}
        />
      </div>

      {counts.roPlantsActive === 0 && (
        <div className="mt-8 rounded-sm border border-dashed border-gold/40 bg-gold/5 p-6 text-sm text-muted">
          No active RO plant exists yet — until one is added under RO Plants, no address anywhere can pass
          the delivery-eligibility check, so checkout and subscriptions will show every address as
          undeliverable.
        </div>
      )}

      {counts.productsTotal === 0 && (
        <div className="mt-4 rounded-sm border border-dashed border-line bg-white/60 p-6 text-sm text-muted">
          No products yet — add your first one under Products. These numbers update automatically as
          real data is added; nothing here is sample or placeholder data.
        </div>
      )}
    </div>
  );
}
