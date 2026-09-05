"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Check, Droplets } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { Textarea } from "@/components/ui/Input";
import { AddressPicker } from "@/components/checkout/AddressPicker";
import { routes } from "@/lib/site";
import { createSubscriptionAction } from "./actions";
import type { SubscriptionPlanRow } from "@/lib/subscriptions/queries";
import type { ProductWithPrimaryImage } from "@/lib/catalog/products";
import type { AddressWithDelivery } from "@/app/(site)/checkout/types";

function formatPrice(value: number) {
  return `Rs ${Math.round(value).toLocaleString()}`;
}

const FREQUENCY_LABEL: Record<string, string> = {
  weekly: "Weekly",
  fortnightly: "Every 2 weeks",
  monthly: "Monthly",
};

function SubscribeButton({ canSubmit }: { canSubmit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="mt-4 w-full" disabled={pending || !canSubmit}>
      {pending ? "Setting up…" : "Start Subscription"}
    </Button>
  );
}

export function SubscribeClient({
  plans,
  waterProducts,
  addresses,
}: {
  plans: SubscriptionPlanRow[];
  waterProducts: ProductWithPrimaryImage[];
  addresses: AddressWithDelivery[];
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(createSubscriptionAction, undefined);

  const [planId, setPlanId] = useState<string | null>(plans[0]?.id ?? null);
  const [productId, setProductId] = useState<string | null>(waterProducts[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);

  // Same render-time-derived-default pattern as CheckoutClient — tracks
  // only an explicit user choice, so a newly added address (via the
  // AddressForm embedded in AddressPicker) is picked up automatically
  // without an effect re-deriving state from props.
  const [userSelectedAddressId, setUserSelectedAddressId] = useState<string | null>(null);
  const selectedAddressId = useMemo(() => {
    if (userSelectedAddressId && addresses.some((a) => a.id === userSelectedAddressId)) {
      return userSelectedAddressId;
    }
    const fallback =
      addresses.find((a) => a.is_default && a.deliverable === "yes") ??
      addresses.find((a) => a.deliverable === "yes");
    return fallback?.id ?? null;
  }, [userSelectedAddressId, addresses]);

  useEffect(() => {
    if (state?.subscriptionId) {
      router.push(`${routes.accountSubscriptions}?created=${state.subscriptionId}`);
    }
  }, [state?.subscriptionId, router]);

  const selectedPlan = plans.find((p) => p.id === planId) ?? null;
  const selectedProduct = waterProducts.find((p) => p.id === productId) ?? null;
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;
  const monthlyPrice = selectedProduct ? selectedProduct.price * quantity : 0;

  const canSubmit =
    !!selectedPlan && !!selectedProduct && quantity > 0 && !!selectedAddress && selectedAddress.deliverable === "yes";

  const itemsJson = JSON.stringify(selectedProduct ? [{ product_id: selectedProduct.id, quantity }] : []);

  if (plans.length === 0) {
    return (
      <section className="bg-ivory py-24 sm:py-32">
        <Container>
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <Eyebrow className="justify-center">Subscribe</Eyebrow>
            <h1 className="display-2 mt-6 font-display text-forest">Subscriptions aren&apos;t open yet.</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We&apos;re setting up recurring water delivery — check back soon.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  if (waterProducts.length === 0) {
    return (
      <section className="bg-ivory py-24 sm:py-32">
        <Container>
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <Eyebrow className="justify-center">Subscribe</Eyebrow>
            <h1 className="display-2 mt-6 font-display text-forest">No water products available yet.</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Please check back once RO water products are listed.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-ivory pt-32 pb-20 sm:pt-36 sm:pb-28">
      <Container>
        <Eyebrow>Subscribe</Eyebrow>
        <h1 className="display-2 mt-6 font-display text-forest">Set up monthly water delivery.</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Recurring RO water delivery, billed nothing online — you pay cash on delivery each time,
          just like a regular order.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-10 lg:col-span-8">
            {/* Plan */}
            <div>
              <h2 className="font-display text-lg text-forest">Choose a Plan</h2>
              <div className="mt-4 flex flex-col gap-3">
                {plans.map((plan) => {
                  const isSelected = planId === plan.id;
                  return (
                    <label
                      key={plan.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-sm border p-5 transition-colors ${
                        isSelected ? "border-forest bg-forest/[0.04]" : "border-line bg-ivory hover:border-forest/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        checked={isSelected}
                        onChange={() => setPlanId(plan.id)}
                        className="mt-1 h-4 w-4 shrink-0 border-line text-forest focus:ring-sage/40"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-display text-base text-forest">{plan.name}</p>
                          <span className="rounded-full bg-sage/15 px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.06em] text-botanical uppercase">
                            {FREQUENCY_LABEL[plan.default_frequency] ?? plan.default_frequency}
                          </span>
                        </div>
                        {plan.description && <p className="mt-1.5 text-xs text-muted">{plan.description}</p>}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Water product */}
            <div>
              <h2 className="font-display text-lg text-forest">Choose Your Water</h2>
              <div className="mt-4 flex flex-col gap-3">
                {waterProducts.map((product) => {
                  const isSelected = productId === product.id;
                  return (
                    <label
                      key={product.id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-sm border p-5 transition-colors ${
                        isSelected ? "border-forest bg-forest/[0.04]" : "border-line bg-ivory hover:border-forest/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="waterProduct"
                          checked={isSelected}
                          onChange={() => setProductId(product.id)}
                          className="h-4 w-4 shrink-0 border-line text-forest focus:ring-sage/40"
                        />
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mist text-aqua-deep">
                          <Droplets className="h-4 w-4" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="font-display text-base text-forest">{product.name}</p>
                          {product.size_label && (
                            <p className="text-xs text-muted">{product.size_label}</p>
                          )}
                        </div>
                      </div>
                      <p className="shrink-0 font-display text-sm text-forest">{formatPrice(product.price)}</p>
                    </label>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <label htmlFor="quantity" className="text-[0.7rem] font-semibold tracking-[0.08em] text-muted uppercase">
                  Quantity
                </label>
                <div className="flex items-center rounded-full border border-line">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center text-forest transition-colors hover:bg-cream"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm text-ink-text">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="flex h-9 w-9 items-center justify-center text-forest transition-colors hover:bg-cream"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div>
              <h2 className="font-display text-lg text-forest">Delivery Address</h2>
              <div className="mt-4">
                <AddressPicker addresses={addresses} selectedId={selectedAddressId} onSelect={setUserSelectedAddressId} />
              </div>
            </div>
          </div>

          {/* Summary + submit */}
          <div className="lg:col-span-4">
            <form action={formAction} className="sticky top-28 rounded-sm border border-line bg-sand/40 p-6">
              <input type="hidden" name="planId" value={planId ?? ""} />
              <input type="hidden" name="addressId" value={selectedAddressId ?? ""} />
              <input type="hidden" name="items" value={itemsJson} />

              <h2 className="font-display text-lg text-forest">Subscription Summary</h2>
              <div className="mt-5 flex items-center justify-between text-sm text-muted">
                <span>Plan</span>
                <span className="text-forest">{selectedPlan?.name ?? "—"}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-muted">
                <span>Water</span>
                <span className="text-forest">
                  {selectedProduct ? `${selectedProduct.name} × ${quantity}` : "—"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                <span className="font-semibold text-forest">Monthly Price</span>
                <span className="font-display text-lg text-forest">{formatPrice(monthlyPrice)}</span>
              </div>
              <p className="mt-1 text-[0.7rem] text-muted">Paid in cash on each delivery — no card required now.</p>

              <div className="mt-5">
                <Textarea
                  label="Notes (optional)"
                  name="notes"
                  rows={2}
                  placeholder="Anything the delivery rider should know…"
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

              <SubscribeButton canSubmit={canSubmit} />

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.7rem] text-muted">
                <Check className="h-3 w-3 shrink-0" strokeWidth={2} />
                You can pause or cancel anytime from My Account.
              </p>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
