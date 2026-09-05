import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckoutClient } from "./CheckoutClient";
import type { AddressWithDelivery } from "./types";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your order and check out with Cash on Delivery.",
};

// Reads the authenticated session and per-request address/delivery data —
// this page can't be static, unlike the marketing pages.
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Checkout requires a real, authenticated customer — no anonymous orders.
  // This is the actual security boundary; the create_order() RPC re-checks
  // auth.uid() itself regardless, so this redirect is a UX nicety, not the
  // only thing standing between a guest and order creation.
  if (!user) {
    redirect("/login?next=/checkout");
  }

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  const list = addresses ?? [];

  // Delivery eligibility is determined here, server-side, from each
  // address's own stored coordinates — never from anything the browser
  // supplies at checkout time. is_delivery_available() (0003_functions.sql)
  // is the same PostGIS radius check create_order() itself will re-run, so
  // what the customer sees here matches what actually gets enforced.
  const withDelivery: AddressWithDelivery[] = await Promise.all(
    list.map(async (address) => {
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

  return <CheckoutClient addresses={withDelivery} />;
}
