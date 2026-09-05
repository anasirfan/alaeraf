import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, MapPin, Phone, Banknote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Al Aeraf order has been placed.",
};

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return `Rs ${Math.round(value).toLocaleString()}`;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/**
 * Order confirmation. Looked up by order_number (the customer-friendly
 * reference create_order() generates) rather than the order's internal
 * UUID — nothing here trusts anything from the query string except that
 * reference; every field shown is re-read from Supabase, scoped by RLS to
 * orders this customer actually owns. A wrong or someone-else's order
 * number simply finds nothing — never a raw database error.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(routes.checkoutSuccess + (orderNumber ? `?order=${orderNumber}` : ""))}`);
  }

  const order = orderNumber
    ? (
        await supabase
          .from("orders")
          .select("*")
          .eq("order_number", orderNumber)
          .maybeSingle()
      ).data
    : null;

  if (!order) {
    return (
      <section className="bg-ivory py-24 sm:py-32">
        <Container>
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <Eyebrow className="justify-center">Order</Eyebrow>
            <h1 className="display-2 mt-6 font-display text-forest">We couldn&apos;t find that order.</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Double-check the link, or view your account for your recent orders.
            </p>
            <Button href={routes.hairOil} size="md" className="mt-8">
              Continue Shopping
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  const [{ data: items }, { data: address }] = await Promise.all([
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)
      .order("id", { ascending: true }),
    supabase.from("addresses").select("*").eq("id", order.address_id).maybeSingle(),
  ]);

  return (
    <section className="bg-ivory pt-32 pb-20 sm:pt-36 sm:pb-28">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <div className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/15">
                <CheckCircle2 className="h-7 w-7 text-forest" strokeWidth={1.5} />
              </span>
              <Eyebrow className="mt-5 justify-center">Order Placed</Eyebrow>
              <h1 className="display-2 mt-4 font-display text-forest">Thank you — your order is in.</h1>
              <p className="mt-3 text-sm text-muted">
                Order <span className="font-semibold text-forest">{order.order_number}</span> ·{" "}
                {STATUS_LABEL[order.status] ?? order.status}
              </p>
            </div>
          </Reveal>

          <Reveal delay={80} className="mt-10 rounded-sm border border-line bg-white/40 p-6 sm:p-8">
            <h2 className="font-display text-lg text-forest">Order Summary</h2>
            <div className="mt-4 divide-y divide-line">
              {(items ?? []).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="text-forest">{item.product_name}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      Qty {item.quantity} × {formatPrice(item.unit_price)}
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-forest">{formatPrice(item.subtotal)}</p>
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
                <span className="font-display text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-sm border border-line bg-white/40 p-6">
              <h3 className="text-[0.7rem] font-semibold tracking-[0.08em] text-muted uppercase">Deliver To</h3>
              {address ? (
                <div className="mt-3 text-sm text-forest">
                  <p className="font-display text-base">{address.recipient_name}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                    <Phone className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                    {address.phone}
                  </p>
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={1.75} />
                    <span>
                      {address.address_line}
                      {address.area ? `, ${address.area}` : ""}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">Address on file.</p>
              )}
            </div>

            <div className="rounded-sm border border-line bg-white/40 p-6">
              <h3 className="text-[0.7rem] font-semibold tracking-[0.08em] text-muted uppercase">Payment</h3>
              <div className="mt-3 flex items-center gap-2.5 text-forest">
                <Banknote className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <p className="font-display text-base">Cash on Delivery</p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Please keep {formatPrice(order.total)} ready in cash — payment is collected when your order
                arrives.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={routes.hairOil} size="md">
              Continue Shopping
            </Button>
            <Link href={routes.account} className="text-sm font-medium text-forest hover:opacity-70">
              Go to My Account
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
