"use client";

import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { useCart } from "@/lib/cart/CartContext";
import { useReconciledCart } from "@/lib/cart/useReconciledCart";
import { routes } from "@/lib/site";

function formatPrice(value: number) {
  return `Rs ${Math.round(value).toLocaleString()}`;
}

/**
 * The cart page. Client-rendered end to end — it only ever reads from the
 * local guest cart plus a lightweight re-check against Supabase, so there's
 * no server data-fetching boundary to keep static here (unlike /hair-oil
 * and /ro-water, which stay ISR).
 */
export default function CartPage() {
  const { itemCount, clearCart } = useCart();
  const { items, hasUnavailable, hasOutOfStock, subtotal, checking, isReady } = useReconciledCart();

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
            <Eyebrow className="justify-center">Your Cart</Eyebrow>
            <h1 className="display-2 mt-6 font-display text-forest">It&apos;s empty for now.</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Browse the range and add something you&apos;ll love — it&apos;ll show up here.
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

  const blockCheckout = hasUnavailable || hasOutOfStock;

  return (
    <section className="bg-ivory pt-32 pb-20 sm:pt-36 sm:pb-28">
      <Container>
        <Eyebrow>Your Cart</Eyebrow>
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="display-2 font-display text-forest">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-[0.8rem] font-medium tracking-[0.02em] text-muted transition-colors hover:text-forest"
          >
            Clear cart
          </button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <div className="rounded-sm border border-line bg-white/40 px-5 sm:px-6">
              {items.map((item) => (
                <CartLineItem key={item.productId} item={item} />
              ))}
            </div>
            {checking && (
              <p className="mt-3 text-xs text-muted">Checking latest prices and availability…</p>
            )}
            {blockCheckout && !checking && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-gold">
                Some items are no longer available — remove them to continue.
              </p>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-sm border border-line bg-sand/40 p-6">
              <h2 className="font-display text-lg text-forest">Order Summary</h2>
              <div className="mt-5 flex items-center justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="font-display text-base text-forest">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Delivery and any applicable fees are calculated at checkout.
              </p>

              {blockCheckout ? (
                <Button size="lg" className="mt-6 w-full" disabled ariaLabel="Remove unavailable items to continue">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              ) : (
                <Button href={routes.checkout} size="lg" className="mt-6 w-full">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              )}
              {blockCheckout && (
                <p className="mt-2 text-center text-[0.7rem] text-muted">
                  Remove unavailable items above to continue.
                </p>
              )}

              <Link
                href={routes.hairOil}
                className="mt-5 flex items-center justify-center gap-2 text-[0.8rem] font-medium text-forest hover:opacity-70"
              >
                <Leaf className="h-3.5 w-3.5" strokeWidth={1.5} />
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
