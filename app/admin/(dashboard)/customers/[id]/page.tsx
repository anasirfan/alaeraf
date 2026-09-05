import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, Mail, MapPin, Star, ClipboardList, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCustomerDetailForAdmin } from "@/lib/customers/adminCustomers";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { SubscriptionStatusBadge } from "@/components/SubscriptionStatusBadge";
import type { OrderStatus, SubscriptionStatus } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Customer Detail — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return `Rs ${Math.round(value).toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Read-only customer profile: contact details, saved addresses, recent
 * orders, and subscriptions — all re-read under this admin's own
 * RLS-scoped session (profiles_select_own_or_admin / orders_owner_select /
 * subscriptions_owner_select all already grant is_admin() full read
 * access, so no new policy was needed for this screen). There is
 * deliberately no edit/delete here yet — changing a customer's own details
 * isn't something an admin does on their behalf today.
 */
export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  let customer: Awaited<ReturnType<typeof getCustomerDetailForAdmin>> = null;
  try {
    customer = await getCustomerDetailForAdmin(supabase, id);
  } catch {
    notFound();
  }

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/customers"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-forest"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Back to Customers
      </Link>

      <div className="mb-6">
        <h2 className="font-display text-2xl text-forest">{customer.full_name || "Unnamed customer"}</h2>
        <p className="mt-1.5 text-sm text-muted">Joined {formatDate(customer.created_at)}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Orders */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-muted uppercase">
              <ClipboardList className="h-3.5 w-3.5" strokeWidth={1.75} />
              Recent Orders {customer.orders.length > 0 && `(${customer.orders.length})`}
            </h3>
            {customer.orders.length === 0 ? (
              <p className="text-sm text-muted">No orders yet.</p>
            ) : (
              <div className="divide-y divide-line">
                {customer.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-forest underline-offset-2 hover:underline"
                      >
                        {order.order_number}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-ink-text">{formatPrice(order.total)}</span>
                      <OrderStatusBadge status={order.status as OrderStatus} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subscriptions */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-muted uppercase">
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />
              Subscriptions {customer.subscriptions.length > 0 && `(${customer.subscriptions.length})`}
            </h3>
            {customer.subscriptions.length === 0 ? (
              <p className="text-sm text-muted">No subscriptions.</p>
            ) : (
              <div className="divide-y divide-line">
                {customer.subscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <div>
                      <Link
                        href={`/admin/subscriptions/${sub.id}`}
                        className="font-medium text-forest underline-offset-2 hover:underline"
                      >
                        {sub.plan?.name ?? "Subscription"}
                      </Link>
                      {sub.next_delivery_date && (
                        <p className="mt-0.5 text-xs text-muted">Next delivery {formatDate(sub.next_delivery_date)}</p>
                      )}
                    </div>
                    <SubscriptionStatusBadge status={sub.status as SubscriptionStatus} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Contact */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Contact</h3>
            <div className="flex flex-col gap-1.5 text-sm text-ink-text">
              {customer.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={1.75} />
                  {customer.phone}
                </p>
              )}
              {customer.email && (
                <p className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={1.75} />
                  {customer.email}
                </p>
              )}
              {!customer.phone && !customer.email && <p className="text-muted">No contact details on file.</p>}
            </div>
          </div>

          {/* Addresses */}
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">
              Saved Addresses {customer.addresses.length > 0 && `(${customer.addresses.length})`}
            </h3>
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-muted">No saved addresses.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {customer.addresses.map((address) => (
                  <div key={address.id} className="text-sm">
                    <p className="flex items-center gap-1.5 font-medium text-ink-text">
                      {address.recipient_name}
                      {address.is_default && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-[0.6rem] font-semibold text-muted">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          Default
                        </span>
                      )}
                    </p>
                    <p className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={1.75} />
                      <span>
                        {address.address_line}
                        {address.area ? `, ${address.area}` : ""}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted">{address.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
