import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listActiveProductsForStorefront } from "@/lib/catalog/products";
import { listActiveSubscriptionPlans } from "@/lib/subscriptions/queries";
import { SubscribeClient } from "./SubscribeClient";
import type { AddressWithDelivery } from "@/app/(site)/checkout/types";

export const metadata: Metadata = {
  title: "Subscribe",
  description: "Set up recurring monthly RO water delivery with Cash on Delivery.",
};

// Reads the authenticated session and per-request address/delivery data —
// can't be static, same as /checkout.
export const dynamic = "force-dynamic";

export default async function SubscribePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Subscribing requires a real, authenticated customer — no anonymous
  // subscriptions. The actual security boundary is create_subscription()
  // itself re-checking auth.uid(); this redirect is a UX nicety.
  if (!user) {
    redirect("/login?next=/subscribe");
  }

  const [plans, waterProducts, { data: addresses }] = await Promise.all([
    listActiveSubscriptionPlans(supabase),
    listActiveProductsForStorefront(supabase, { productType: "ro_water" }),
    supabase
      .from("addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  const addressList = addresses ?? [];

  // Delivery eligibility is determined here, server-side, from each
  // address's own stored coordinates — exactly like /checkout — never from
  // anything the browser reports at subscribe time.
  const withDelivery: AddressWithDelivery[] = await Promise.all(
    addressList.map(async (address) => {
      if (address.latitude == null || address.longitude == null) {
        return { ...address, deliverable: "no-coordinates" as const };
      }
      const { data: available, error } = await supabase.rpc("is_delivery_available", {
        lat: address.latitude,
        lng: address.longitude,
      });
      if (error) {
        return { ...address, deliverable: "unknown" as const };
      }
      return { ...address, deliverable: available ? ("yes" as const) : ("no" as const) };
    }),
  );

  return <SubscribeClient plans={plans} waterProducts={waterProducts} addresses={withDelivery} />;
}
