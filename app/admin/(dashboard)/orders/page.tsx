import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  listOrdersForAdmin,
  listRoPlantOptions,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  type OrderStatusFilter,
  type PaymentStatusFilter,
} from "@/lib/orders/adminOrders";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
} from "@/components/admin/OrderStatusBadge";

export const metadata: Metadata = {
  title: "Orders — Admin",
  robots: { index: false, follow: false },
};

// Reads the authenticated admin session plus per-request filters/search —
// this list can't be static.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function formatPrice(value: number) {
  return `Rs ${Math.round(value).toLocaleString()}`;
}

function formatDate(value: string) {
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

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    payment?: string;
    plant?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.q?.trim() || undefined;
  const status = (params.status as OrderStatusFilter) || "all";
  const paymentStatus = (params.payment as PaymentStatusFilter) || "all";
  const roPlantId = params.plant || undefined;
  const dateFrom = params.from || undefined;
  const dateTo = params.to || undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const supabase = await createClient();
  const [roPlants, { rows, count }] = await Promise.all([
    listRoPlantOptions(supabase),
    listOrdersForAdmin(supabase, {
      search,
      status,
      paymentStatus,
      roPlantId,
      dateFrom,
      dateTo,
      page,
      pageSize: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const hasFilters = !!(search || status !== "all" || paymentStatus !== "all" || roPlantId || dateFrom || dateTo);
  const baseParams = {
    q: search,
    status: status === "all" ? undefined : status,
    payment: paymentStatus === "all" ? undefined : paymentStatus,
    plant: roPlantId,
    from: dateFrom,
    to: dateTo,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl text-forest">Orders</h2>
        <p className="mt-1.5 text-sm text-muted">
          {count} order{count === 1 ? "" : "s"} total.
        </p>
      </div>

      <form method="get" className="mb-6 flex flex-wrap items-end gap-3 rounded-sm border border-line bg-white p-4">
        <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
          <label htmlFor="q" className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={search ?? ""}
            placeholder="Order #, customer name, or phone…"
            className="rounded-sm border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-sage/35"
          />
        </div>
        <div className="flex min-w-[150px] flex-col gap-1.5">
          <label htmlFor="status" className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
            Order Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="rounded-sm border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-sage/35"
          >
            <option value="all">All</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-[140px] flex-col gap-1.5">
          <label htmlFor="payment" className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
            Payment
          </label>
          <select
            id="payment"
            name="payment"
            defaultValue={paymentStatus}
            className="rounded-sm border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-sage/35"
          >
            <option value="all">All</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PAYMENT_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        {roPlants.length > 0 && (
          <div className="flex min-w-[160px] flex-col gap-1.5">
            <label htmlFor="plant" className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
              RO Plant
            </label>
            <select
              id="plant"
              name="plant"
              defaultValue={roPlantId ?? ""}
              className="rounded-sm border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-sage/35"
            >
              <option value="">All plants</option>
              {roPlants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex min-w-[130px] flex-col gap-1.5">
          <label htmlFor="from" className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
            From
          </label>
          <input
            id="from"
            name="from"
            type="date"
            defaultValue={dateFrom ?? ""}
            className="rounded-sm border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-sage/35"
          />
        </div>
        <div className="flex min-w-[130px] flex-col gap-1.5">
          <label htmlFor="to" className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
            To
          </label>
          <input
            id="to"
            name="to"
            type="date"
            defaultValue={dateTo ?? ""}
            className="rounded-sm border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-sage/35"
          />
        </div>
        <button
          type="submit"
          className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
        >
          Filter
        </button>
        {hasFilters && (
          <Link href="/admin/orders" className="text-sm font-medium text-muted transition-colors hover:text-forest">
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center rounded-sm border border-dashed border-line bg-white/60 px-6 py-16 text-center">
          <ClipboardList className="h-8 w-8 text-muted/40" strokeWidth={1.25} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {count === 0 && !hasFilters
              ? "No orders yet — placed orders will show up here as soon as customers check out."
              : "No orders match these filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-line bg-white">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Delivery Area</th>
                <th className="px-4 py-3">RO Plant</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id} className="border-b border-line/60 last:border-0 hover:bg-cream/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-forest underline-offset-2 hover:underline"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink-text">{order.customer?.full_name || "—"}</p>
                    <p className="text-xs text-muted">{order.customer?.phone || order.address?.phone || "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {order.address ? (order.address.area ? order.address.area : order.address.address_line) : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{order.ro_plant?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-text">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted">Cash on Delivery</span>
                      <PaymentStatusBadge status={order.payment_status} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link
            href={`/admin/orders${buildQuery({ ...baseParams, page: String(page - 1) })}`}
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
            href={`/admin/orders${buildQuery({ ...baseParams, page: String(page + 1) })}`}
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
