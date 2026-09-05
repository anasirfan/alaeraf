"use server";

import { createClient } from "@/lib/supabase/server";

export type CreateSubscriptionState = { error?: string; subscriptionId?: string } | undefined;

type SubscriptionItemInput = { product_id: string; quantity: number };

/**
 * Parses the client's {product_id, quantity} item(s) — the only thing it
 * contributes about what's being subscribed to. No price, no product name,
 * no total. Malformed input is rejected here before ever reaching the
 * database; create_subscription() (0008_subscriptions.sql) re-validates and
 * re-prices from the live, RO-water-only catalog regardless.
 */
function parseItems(raw: FormDataEntryValue | null): SubscriptionItemInput[] {
  if (typeof raw !== "string" || !raw) {
    throw new Error("Choose a water product before subscribing.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Couldn't read your selection. Please try again.");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Choose a water product before subscribing.");
  }

  return parsed.map((entry) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      typeof (entry as Record<string, unknown>).product_id !== "string" ||
      typeof (entry as Record<string, unknown>).quantity !== "number"
    ) {
      throw new Error("Couldn't read your selection. Please try again.");
    }
    const productId = (entry as Record<string, unknown>).product_id as string;
    const quantity = (entry as Record<string, unknown>).quantity as number;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a whole number greater than zero.");
    }
    return { product_id: productId, quantity };
  });
}

/**
 * Maps a create_subscription() exception to clean customer-facing text —
 * the RPC (0008_subscriptions.sql) already raises human-readable messages
 * for every validation failure, this just recognizes those and falls back
 * to a generic message for anything else, so no raw Postgres error ever
 * reaches the customer.
 */
function friendlySubscriptionError(message: string): string {
  const known = [
    "Authentication required.",
    "Subscription must contain at least one item.",
    "Selected plan is not available.",
    "Address not found for this customer.",
    "Address is missing coordinates — cannot verify delivery eligibility.",
    "Delivery is not available for this address yet.",
  ];
  if (known.includes(message)) return message;
  if (message.startsWith("Product ") && message.endsWith("is not available for subscription.")) {
    return "That water product is no longer available for subscription. Please choose another.";
  }
  if (message.startsWith("Invalid quantity for product")) {
    return "Please enter a valid quantity.";
  }
  return "We couldn't set up your subscription. Please try again in a moment.";
}

/**
 * Starts a subscription. Requires an authenticated session (from the
 * request's own cookies, never anything the client submits) — everything
 * else (address ownership, delivery eligibility, plan availability, and
 * every item's price/availability) is independently re-verified inside
 * create_subscription() itself.
 */
export async function createSubscriptionAction(
  _prevState: CreateSubscriptionState,
  formData: FormData,
): Promise<CreateSubscriptionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in again to subscribe." };
  }

  const planId = String(formData.get("planId") ?? "");
  if (!planId) {
    return { error: "Please choose a plan." };
  }

  const addressId = String(formData.get("addressId") ?? "");
  if (!addressId) {
    return { error: "Please select a delivery address." };
  }

  let items: SubscriptionItemInput[];
  try {
    items = parseItems(formData.get("items"));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Couldn't read your selection." };
  }

  const notesRaw = String(formData.get("notes") ?? "").trim();

  const { data, error } = await supabase.rpc("create_subscription", {
    p_plan_id: planId,
    p_address_id: addressId,
    p_items: items,
    p_notes: notesRaw || null,
  });

  if (error) {
    return { error: friendlySubscriptionError(error.message) };
  }

  const result = Array.isArray(data) ? data[0] : data;
  if (!result?.subscription_id) {
    return { error: "We couldn't set up your subscription. Please try again in a moment." };
  }

  return { subscriptionId: result.subscription_id };
}
