import type { Database } from "@/types/database.types";

export type Address = Database["public"]["Tables"]["addresses"]["Row"];

/**
 * "no-coordinates": address has no lat/lng on file yet — delivery can't be
 * checked at all until the customer adds one (via the existing
 * AddressForm's "use my current location" or manual fields).
 * "unknown": the RPC call itself failed (transient) — treated as
 * not-selectable, same as "no", rather than silently letting it through.
 */
export type DeliverabilityStatus = "yes" | "no" | "no-coordinates" | "unknown";

export type AddressWithDelivery = Address & { deliverable: DeliverabilityStatus };
