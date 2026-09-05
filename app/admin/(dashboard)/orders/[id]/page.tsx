import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Banknote, MapPin, Phone, Mail, Droplets } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOrderForAdmin } from "@/lib/orders/adminOrders";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/OrderStatusBadge";
import { OrderStatusForm, PaymentStatusForm } from "./OrderStatusForms";

export const metadata: Metadata = {
  title: "Order Detail — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return `Rs ${Math.round(value).toLocaleString()}`;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Order detail. Every field is re-read from Supabase under this admin's own
 * RLS-scoped session (never the service-role client) — an invalid or
 * someone-else's-but-nonexistent id path both resolve the same way, via
 * getOrderForAdmin() returning null, which renders Next's standard
 * not-found page rather than leaking a raw database error.
 */
export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();

  // A malformed id (not a valid UUID) makes Postgres itself reject the
  // query — caught here and folded into the same not-found page a
  // well-formed-but-nonexistent id gets, rather than surfacing that raw
  // database error or crashing to a generic error boundary.
  let order: Awaited<ReturnType<typeof getOrderForAdmin>> = null;
  try {
    order = await getOrderForAdmin(supabase, id);
  } catch {
    notFound();
  }

  if (!order) {
    notFound();
  }

  // Informational only — reflects *current* delivery-radius eligibility for
  // this address, computed the same way checkout does (is_delivery_available,
  // 0003_functions.sql). It can differ from what was true when the order was
  // actually placed (RO plants/radii may have changed since), so it's shown
  // as a live signal, not treated as authoritative order history.
  let currentlyDeliverable: boolean | null = null;
  if (order.address?.latitude != null && order.address?.longitude != null) {
    const { data, error } = await supabase.rpc("is_delivery_available", {
      lat: order.address.latitude,
      lng: order.address.longitude,
    });
    if (!error) currentlyDeliverable = data ?? false;
  }

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-forest"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Back to Orders
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-forest">{order.order_number}</h2>
          <p className="mt-1.5 text-sm text-muted">Placed {formatDateTime(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment_status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Items */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Items</h3>
            <div className="divide-y divide-line">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="text-ink-text">{item.product_name}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      Qty {item.quantity} × {formatPrice(item.unit_price)}
                    </p>
                  </div>
                  <p className="shrink-0 font-medium text-ink-text">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              <div className="flex items-center justify-between text-muted">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Delivery Fee</span>
                <span>{order.delivery_fee > 0 ? formatPrice(order.delivery_fee) : "Free"}</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 text-base font-semibold text-forest">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Delivery</h3>
            {order.address ? (
              <div className="text-sm text-ink-text">
                <p className="font-medium">{order.address.recipient_name}</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                  <Phone className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                  {order.address.phone}
                </p>
                <p className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                  <MapPin className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={1.75} />
                  <span>
                    {order.address.address_line}
                    {order.address.area ? `, ${order.address.area}` : ""}
                  </span>
                </p>
                {order.address.delivery_notes && (
                  <p className="mt-2 rounded-sm bg-cream/60 px-3 py-2 text-xs text-muted">
                    Note: {order.address.delivery_notes}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="h-4 w-4 shrink-0 text-aqua-deep" strokeWidth={1.5} />
                    <span className="text-muted">RO Plant:</span>
                    <span className="font-medium text-ink-text">{order.ro_plant?.name ?? "Not assigned"}</span>
                  </div>
                  {currentlyDeliverable !== null && (
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.04em] uppercase ${
                        currentlyDeliverable
                          ? "border-sage/30 bg-sage/10 text-botanical"
                          : "border-gold/40 bg-gold/10 text-gold"
                      }`}
                    >
                      {currentlyDeliverable ? "Currently in delivery range" : "Currently outside delivery range"}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[0.7rem] text-muted">
                  RO plant assignment is fixed at the time an order is placed by the secure order-creation
                  process and can&apos;t be changed here.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted">Address on file could not be loaded.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Customer */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Customer</h3>
            <p className="text-sm font-medium text-ink-text">{order.customer?.full_name || "—"}</p>
            <div className="mt-2 flex flex-col gap-1.5 text-xs text-muted">
              {(order.customer?.phone || order.address?.phone) && (
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                  {order.customer?.phone || order.address?.phone}
                </p>
              )}
              {order.customer?.email && (
                <p className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                  {order.customer.email}
                </p>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Payment</h3>
            <div className="flex items-center gap-2.5 text-sm text-ink-text">
              <Banknote className="h-4 w-4 shrink-0 text-forest" strokeWidth={1.5} />
              Cash on Delivery
            </div>
            <div className="mt-4">
              <PaymentStatusForm orderId={order.id} paymentStatus={order.payment_status} />
            </div>
          </div>

          {/* Status */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Order Status</h3>
            <OrderStatusForm orderId={order.id} status={order.status} />
          </div>

          {order.notes && (
            <div className="rounded-sm border border-line bg-white p-6">
              <h3 className="mb-3 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Notes</h3>
              <p className="text-sm text-muted">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
