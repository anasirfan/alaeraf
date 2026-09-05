"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Banknote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { Textarea } from "@/components/ui/Input";
import { AddressPicker } from "@/components/checkout/AddressPicker";
import { CheckoutItemRow } from "@/components/checkout/CheckoutItemRow";
import { useCart } from "@/lib/cart/CartContext";
import { useReconciledCart } from "@/lib/cart/useReconciledCart";
import { routes } from "@/lib/site";
import { placeOrderAction } from "./actions";
import type { AddressWithDelivery } from "./types";

function formatPrice(value: number) {
  return `Rs ${Math.round(value).toLocaleString()}`;
}

/**
 * Submit button for the checkout form. Disabled both while the action is
 * pending (useFormStatus) and whenever the checkout isn't actually
 * submittable yet (no deliverable address selected, cart needs attention) —
 * SubmitButton (used elsewhere for auth/account forms) only knows about
 * the pending half of that, hence a small local variant here.
 */
function PlaceOrderButton({ canPlaceOrder }: { canPlaceOrder: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="mt-4 w-full" disabled={pending || !canPlaceOrder}>
      {pending ? "Placing your order…" : "Place Order"}
    </Button>
  );
}

export function CheckoutClient({ addresses }: { addresses: AddressWithDelivery[] }) {
  const router = useRouter();
  const { clearCart } = useCart();
  const { items, orderableItems, hasUnavailable, hasOutOfStock, orderableSubtotal, checking, isReady } =
    useReconciledCart();

  const [state, formAction] = useActionState(placeOrderAction, undefined);

  // Tracks only an explicit user choice — null means "nothing chosen yet,"
  // not "no address exists." The effective selection below derives a
  // sensible default purely from render-time data (current `addresses`
  // prop), so a newly saved address arriving via revalidatePath is picked
  // up automatically without an effect re-deriving state from props.
  const [userSelectedId, setUserSelectedId] = useState<string | null>(null);

  const selectedAddressId = useMemo(() => {
    if (userSelectedId && addresses.some((a) => a.id === userSelectedId)) {
      return userSelectedId;
    }
    const fallback =
      addresses.find((a) => a.is_default && a.deliverable === "yes") ??
      addresses.find((a) => a.deliverable === "yes");
    return fallback?.id ?? null;
  }, [userSelectedId, addresses]);

  useEffect(() => {
    if (state?.orderNumber) {
      clearCart();
      router.push(`${routes.checkoutSuccess}?order=${state.orderNumber}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.orderNumber]);

  if (!isReady) {
    return (
      <section className="bg-ivory py-24">
        <Container>
          <div className="h-40" aria-hidden="true" />
        </Container>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-ivory py-24 sm:py-32">
        <Container>
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <Eyebrow className="justify-center">Checkout</Eyebrow>
            <h1 className="display-2 mt-6 font-display text-forest">Your cart is empty.</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Add something to your cart before checking out.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href={routes.hairOil} size="md">
                Shop Hair Oil
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Button>
              <Button href={routes.water} size="md" variant="outline">
                Shop RO Water
              </Button>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;
  const cartNeedsAttention = hasUnavailable || hasOutOfStock;
  const canPlaceOrder =
    !!selectedAddress &&
    selectedAddress.deliverable === "yes" &&
    !cartNeedsAttention &&
    orderableItems.length > 0 &&
    !checking;

  const itemsJson = JSON.stringify(
    orderableItems.map((item) => ({ product_id: item.productId, quantity: item.quantity })),
  );

  return (
    <section className="bg-ivory pt-32 pb-20 sm:pt-36 sm:pb-28">
      <Container>
        <Eyebrow>Checkout</Eyebrow>
        <h1 className="display-2 mt-6 font-display text-forest">Review &amp; place your order.</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-10 lg:col-span-8">
            {/* Order review */}
            <div>
              <h2 className="font-display text-lg text-forest">Your Order</h2>
              <div className="mt-4 rounded-sm border border-line bg-white/40 px-5 sm:px-6">
                {items.map((item) => (
                  <CheckoutItemRow key={item.productId} item={item} />
                ))}
              </div>
              {checking && <p className="mt-3 text-xs text-muted">Checking latest prices and availability…</p>}
              {cartNeedsAttention && !checking && (
                <p className="mt-3 text-xs text-gold">
                  Some items in your cart changed or are no longer available.{" "}
                  <Link href={routes.cart} className="font-semibold underline underline-offset-2">
                    Update your cart
                  </Link>{" "}
                  before placing your order.
                </p>
              )}
            </div>

            {/* Delivery address */}
            <div>
              <h2 className="font-display text-lg text-forest">Delivery Address</h2>
              <div className="mt-4">
                <AddressPicker addresses={addresses} selectedId={selectedAddressId} onSelect={setUserSelectedId} />
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="font-display text-lg text-forest">Payment</h2>
              <div className="mt-4 flex items-center gap-3 rounded-sm border border-forest bg-forest/[0.04] p-5">
                <Banknote className="h-5 w-5 shrink-0 text-forest" strokeWidth={1.5} />
                <div>
                  <p className="font-display text-base text-forest">Cash on Delivery</p>
                  <p className="mt-0.5 text-xs text-muted">Pay in cash when your order arrives. No card or online payment needed.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary + submit */}
          <div className="lg:col-span-4">
            <form action={formAction} className="sticky top-28 rounded-sm border border-line bg-sand/40 p-6">
              <input type="hidden" name="addressId" value={selectedAddressId ?? ""} />
              <input type="hidden" name="items" value={itemsJson} />

              <h2 className="font-display text-lg text-forest">Order Summary</h2>
              <div className="mt-5 flex items-center justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="font-display text-base text-forest">{formatPrice(orderableSubtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-muted">
                <span>Delivery Fee</span>
                <span>Free</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                <span className="font-semibold text-forest">Total</span>
                <span className="font-display text-lg text-forest">{formatPrice(orderableSubtotal)}</span>
              </div>

              <div className="mt-5">
                <Textarea
                  label="Notes for delivery (optional)"
                  name="notes"
                  rows={2}
                  placeholder="Anything the rider should know…"
                />
              </div>

              {state?.error && (
                <div className="mt-4">
                  <FormMessage type="error">{state.error}</FormMessage>
                </div>
              )}

              {!selectedAddress && (
                <p className="mt-4 text-center text-xs text-muted">Select a deliverable address to continue.</p>
              )}
              {selectedAddress && selectedAddress.deliverable !== "yes" && (
                <p className="mt-4 text-center text-xs text-gold">
                  This address isn&apos;t deliverable yet — choose another or add one.
                </p>
              )}

              <PlaceOrderButton canPlaceOrder={canPlaceOrder} />

              <p className="mt-3 text-center text-[0.7rem] text-muted">
                You&apos;ll pay {formatPrice(orderableSubtotal)} in cash when your order is delivered.
              </p>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
