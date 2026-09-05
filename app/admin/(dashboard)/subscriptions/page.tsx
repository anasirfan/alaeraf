import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, RefreshCw, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  listSubscriptionsForAdmin,
  SUBSCRIPTION_STATUSES,
  type SubscriptionStatusFilter,
} from "@/lib/subscriptions/queries";
import { SubscriptionStatusBadge, SUBSCRIPTION_STATUS_LABEL } from "@/components/SubscriptionStatusBadge";

export const metadata: Metadata = {
  title: "Subscriptions — Admin",
  robots: { index: false, follow: false },
};

// Reads the authenticated admin session plus per-request filters/search —
// this list can't be static.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function formatPrice(value: number) {
  return `Rs ${Math.round(value).toLocaleString()}`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function buildQuery(params: Record<string, string | undefined>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) usp.set(key, value);
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.q?.trim() || undefined;
  const status = (params.status as SubscriptionStatusFilter) || "all";
  const page = Math.max(1, Number(params.page) || 1);

  const supabase = await createClient();
  const { rows, count } = await listSubscriptionsForAdmin(supabase, {
    search,
    status,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const hasFilters = !!(search || status !== "all");
  const baseParams = { q: search, status: status === "all" ? undefined : status };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-forest">Subscriptions</h2>
          <p className="mt-1.5 text-sm text-muted">
            {count} subscription{count === 1 ? "" : "s"} total.
          </p>
        </div>
        <Link
          href="/admin/subscriptions/plans"
          className="inline-flex items-center gap-2 rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
        >
          <Settings className="h-4 w-4" strokeWidth={1.75} />
          Manage Plans
        </Link>
      </div>

      <form method="get" className="mb-6 flex flex-wrap items-end gap-3 rounded-sm border border-line bg-white p-4">
        <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <label htmlFor="q" className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={search ?? ""}
            placeholder="Customer name or phone…"
            className="rounded-sm border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-sage/35"
          />
        </div>
        <div className="flex min-w-[160px] flex-col gap-1.5">
          <label htmlFor="status" className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="rounded-sm border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-sage/35"
          >
            <option value="all">All</option>
            {SUBSCRIPTION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {SUBSCRIPTION_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
        >
          Filter
        </button>
        {hasFilters && (
          <Link href="/admin/subscriptions" className="text-sm font-medium text-muted transition-colors hover:text-forest">
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center rounded-sm border border-dashed border-line bg-white/60 px-6 py-16 text-center">
          <RefreshCw className="h-8 w-8 text-muted/40" strokeWidth={1.25} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {count === 0 && !hasFilters
              ? "No subscriptions yet — customer subscriptions will show up here once they're created."
              : "No subscriptions match these filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-line bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Water</th>
                <th className="px-4 py-3">Monthly Price</th>
                <th className="px-4 py-3">Next Delivery</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((sub) => {
                const monthlyPrice = sub.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
                return (
                  <tr key={sub.id} className="border-b border-line/60 last:border-0 hover:bg-cream/30">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/subscriptions/${sub.id}`}
                        className="font-medium text-forest underline-offset-2 hover:underline"
                      >
                        {sub.customer?.full_name || "—"}
                      </Link>
                      <p className="text-xs text-muted">{sub.customer?.phone || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-text">{sub.plan?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">
                      {sub.items.length === 0
                        ? "—"
                        : sub.items.map((i) => `${i.product?.name ?? "Product"} × ${i.quantity}`).join(", ")}
                    </td>
                    <td className="px-4 py-3 text-ink-text">{formatPrice(monthlyPrice)}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(sub.next_delivery_date)}</td>
                    <td className="px-4 py-3">
                      <SubscriptionStatusBadge status={sub.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link
            href={`/admin/subscriptions${buildQuery({ ...baseParams, page: String(page - 1) })}`}
            aria-disabled={page <= 1}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition-colors hover:bg-cream ${
              page <= 1 ? "pointer-events-none opacity-30" : ""
            }`}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <span className="text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/admin/subscriptions${buildQuery({ ...baseParams, page: String(page + 1) })}`}
            aria-disabled={page >= totalPages}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition-colors hover:bg-cream ${
              page >= totalPages ? "pointer-events-none opacity-30" : ""
            }`}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
      )}
    </div>
  );
}
