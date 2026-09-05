import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Droplets, MapPin, Phone, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionForAdmin } from "@/lib/subscriptions/queries";
import { SubscriptionStatusBadge } from "@/components/SubscriptionStatusBadge";
import { SubscriptionStatusForm, GenerateDeliveryForm } from "./SubscriptionAdminForms";

export const metadata: Metadata = {
  title: "Subscription Detail — Admin",
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

function formatDate(value: string | null) {
  if (!value) return "Not scheduled yet";
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Subscription detail. Every field is re-read from Supabase under this
 * admin's own RLS-scoped session (never the service-role client) — an
 * invalid or nonexistent id both resolve the same way, via
 * getSubscriptionForAdmin() returning null, which renders Next's standard
 * not-found page rather than leaking a raw database error.
 */
export default async function AdminSubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();

  let subscription: Awaited<ReturnType<typeof getSubscriptionForAdmin>> = null;
  try {
    subscription = await getSubscriptionForAdmin(supabase, id);
  } catch {
    notFound();
  }

  if (!subscription) {
    notFound();
  }

  // Informational only — reflects *current* delivery-radius eligibility,
  // computed live the same way checkout/subscribe do. RO plant assignment
  // for a subscription is never persisted (unlike an order) since coverage
  // can change between deliveries — each generated delivery order gets its
  // own authoritative plant assignment at the time it's created.
  let currentlyDeliverable: boolean | null = null;
  if (subscription.address?.latitude != null && subscription.address?.longitude != null) {
    const { data, error } = await supabase.rpc("is_delivery_available", {
      lat: subscription.address.latitude,
      lng: subscription.address.longitude,
    });
    if (!error) currentlyDeliverable = data ?? false;
  }

  const monthlyPrice = subscription.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  return (
    <div>
      <Link
        href="/admin/subscriptions"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-forest"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Back to Subscriptions
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-forest">{subscription.plan?.name ?? "Subscription"}</h2>
          <p className="mt-1.5 text-sm text-muted">Started {formatDateTime(subscription.created_at)}</p>
        </div>
        <SubscriptionStatusBadge status={subscription.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Items */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Water</h3>
            <div className="divide-y divide-line">
              {subscription.items.length === 0 && <p className="py-3 text-sm text-muted">No items on this subscription.</p>}
              {subscription.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="text-ink-text">{item.product?.name ?? "Product"}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      Qty {item.quantity} × {formatPrice(item.unit_price)}
                    </p>
                  </div>
                  <p className="shrink-0 font-medium text-ink-text">{formatPrice(item.unit_price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-base font-semibold text-forest">
              <span>Monthly Price</span>
              <span>{formatPrice(monthlyPrice)}</span>
            </div>
            <p className="mt-1.5 text-[0.7rem] text-muted">
              Paid cash on delivery each cycle — no online payment is collected.
            </p>
          </div>

          {/* Delivery */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Delivery</h3>
            {subscription.address ? (
              <div className="text-sm text-ink-text">
                <p className="font-medium">{subscription.address.recipient_name}</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                  <Phone className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                  {subscription.address.phone}
                </p>
                <p className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                  <MapPin className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={1.75} />
                  <span>
                    {subscription.address.address_line}
                    {subscription.address.area ? `, ${subscription.address.area}` : ""}
                  </span>
                </p>
                {subscription.address.delivery_notes && (
                  <p className="mt-2 rounded-sm bg-cream/60 px-3 py-2 text-xs text-muted">
                    Note: {subscription.address.delivery_notes}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="h-4 w-4 shrink-0 text-aqua-deep" strokeWidth={1.5} />
                    <span className="text-muted">Next delivery:</span>
                    <span className="font-medium text-ink-text">{formatDate(subscription.next_delivery_date)}</span>
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
              </div>
            ) : (
              <p className="text-sm text-muted">Address on file could not be loaded.</p>
            )}
          </div>

          {/* Generate delivery */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-2 text-xs font-semibold tracking-[0.1em] text-muted uppercase">This Cycle&apos;s Delivery</h3>
            <p className="mb-4 text-sm text-muted">
              There is no automatic billing or order creation — generate this cycle&apos;s real order when
              you&apos;re ready to dispatch it. This re-checks delivery eligibility and current pricing, and
              moves the next delivery date forward.
            </p>
            <GenerateDeliveryForm subscriptionId={subscription.id} disabled={subscription.status !== "active"} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Customer */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Customer</h3>
            <p className="text-sm font-medium text-ink-text">{subscription.customer?.full_name || "—"}</p>
            <div className="mt-2 flex flex-col gap-1.5 text-xs text-muted">
              {subscription.customer?.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                  {subscription.customer.phone}
                </p>
              )}
              {subscription.customer?.email && (
                <p className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                  {subscription.customer.email}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Subscription Status</h3>
            <SubscriptionStatusForm subscriptionId={subscription.id} status={subscription.status} />
          </div>

          {subscription.notes && (
            <div className="rounded-sm border border-line bg-white p-6">
              <h3 className="mb-3 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Notes</h3>
              <p className="text-sm text-muted">{subscription.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
