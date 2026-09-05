"use server";

import { createClient } from "@/lib/supabase/server";

export type PlaceOrderState =
  | { error?: string; orderNumber?: string }
  | undefined;

type OrderItemInput = { product_id: string; quantity: number };

/**
 * Parses the JSON blob of {product_id, quantity} pairs the client posts.
 * This is the ONLY thing the client contributes about what's in the
 * order — no name, no price, no subtotal. Malformed input is rejected here
 * before it ever reaches the database; the actual pricing/availability
 * check still happens inside create_order() itself, which re-fetches every
 * product from the live catalog and ignores anything else about the shape
 * below except product_id and quantity.
 */
function parseItems(raw: FormDataEntryValue | null): OrderItemInput[] {
  if (typeof raw !== "string" || !raw) {
    throw new Error("Your cart looks empty — add something before checking out.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Couldn't read your cart. Please refresh and try again.");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Your cart looks empty — add something before checking out.");
  }

  return parsed.map((entry) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      typeof (entry as Record<string, unknown>).product_id !== "string" ||
      typeof (entry as Record<string, unknown>).quantity !== "number"
    ) {
      throw new Error("Couldn't read your cart. Please refresh and try again.");
    }
    const productId = (entry as Record<string, unknown>).product_id as string;
    const quantity = (entry as Record<string, unknown>).quantity as number;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("One of your cart items has an invalid quantity.");
    }
    return { product_id: productId, quantity };
  });
}

/**
 * Maps a create_order() exception to clean customer-facing text. The RPC
 * (supabase/migrations/0003_functions.sql) already raises human-readable
 * messages for every validation failure it performs — this just recognizes
 * those known messages and falls back to a generic message for anything
 * else (a connection error, an unexpected constraint), so a raw Postgres
 * error never reaches the customer.
 */
function friendlyOrderError(message: string): string {
  const known = [
    "Authentication required.",
    "Order must contain at least one item.",
    "Address not found for this customer.",
    "Address is missing coordinates — cannot verify delivery eligibility.",
    "Delivery is not available for this address yet.",
  ];
  if (known.includes(message)) return message;
  if (message.startsWith("Product ") && message.endsWith("is not available.")) {
    return "One or more items in your cart are no longer available. Please refresh your cart and try again.";
  }
  if (message.startsWith("Invalid quantity for product")) {
    return "One of your cart items has an invalid quantity. Please refresh your cart and try again.";
  }
  return "We couldn't place your order. Please try again in a moment.";
}

/**
 * Places a COD order. Requires an authenticated session — obtained from the
 * request's own cookies, never from anything the client submits — and does
 * no address-ownership or pricing work itself: create_order() (security
 * definer, 0003_functions.sql) is the single place that verifies the
 * address belongs to this customer, re-fetches and re-prices every item
 * from the current catalog, and checks delivery eligibility against the
 * address's stored coordinates. This action's job is only to parse the
 * client's input into the shape that RPC expects and translate its result.
 */
export async function placeOrderAction(
  _prevState: PlaceOrderState,
  formData: FormData,
): Promise<PlaceOrderState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in again to place your order." };
  }

  const addressId = String(formData.get("addressId") ?? "");
  if (!addressId) {
    return { error: "Please select a delivery address." };
  }

  let items: OrderItemInput[];
  try {
    items = parseItems(formData.get("items"));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Couldn't read your cart." };
  }

  const notesRaw = String(formData.get("notes") ?? "").trim();

  const { data, error } = await supabase.rpc("create_order", {
    p_address_id: addressId,
    p_items: items,
    p_notes: notesRaw || null,
  });

  if (error) {
    return { error: friendlyOrderError(error.message) };
  }

  const result = Array.isArray(data) ? data[0] : data;
  if (!result?.order_number) {
    return { error: "We couldn't place your order. Please try again in a moment." };
  }

  return { orderNumber: result.order_number };
}
