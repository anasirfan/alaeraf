"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/authorize";
import { SUBSCRIPTION_STATUSES } from "@/lib/subscriptions/queries";
import type { SubscriptionStatus } from "@/types/database.types";

export type SubscriptionActionState = { error?: string; success?: boolean } | undefined;

/**
 * Admin status change. Goes through the same update_subscription_status()
 * RPC (0008_subscriptions.sql) a customer's pause/resume/cancel uses — the
 * function already special-cases is_admin() to allow any status transition,
 * so there's one authoritative place this rule lives instead of two
 * (a direct table update here would also be allowed by the
 * subscriptions_admin_write RLS policy, but funnelling both roles through
 * the same RPC means there's only one status-transition rule to audit).
 */
export async function updateSubscriptionStatusAction(
  _prevState: SubscriptionActionState,
  formData: FormData,
): Promise<SubscriptionActionState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "") as SubscriptionStatus;

    if (!id) return { error: "Missing subscription." };
    if (!SUBSCRIPTION_STATUSES.includes(status)) return { error: "Choose a valid status." };

    const { error } = await supabase.rpc("update_subscription_status", {
      p_subscription_id: id,
      p_status: status,
    });
    if (error) return { error: "Couldn't update the subscription status. Please try again." };

    revalidatePath("/admin/subscriptions");
    revalidatePath(`/admin/subscriptions/${id}`);
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export type GenerateDeliveryState = { error?: string; orderNumber?: string } | undefined;

/**
 * Manually generates this cycle's real order for one active subscription.
 * There is no cron/background automation creating these — every monthly
 * delivery is this explicit admin action, calling
 * create_subscription_delivery_order() (0008_subscriptions.sql), which
 * itself re-verifies the subscription is active, re-checks delivery
 * eligibility, and re-fetches current product pricing before inserting into
 * the existing orders/order_items tables and advancing next_delivery_date.
 */
export async function generateSubscriptionDeliveryAction(
  _prevState: GenerateDeliveryState,
  formData: FormData,
): Promise<GenerateDeliveryState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Missing subscription." };

    const { data, error } = await supabase.rpc("create_subscription_delivery_order", {
      p_subscription_id: id,
    });

    if (error) {
      const known: Record<string, string> = {
        "Subscription not found.": "This subscription no longer exists.",
        "Subscription is not active.": "Only active subscriptions can have a delivery order generated.",
        "Address is missing coordinates — cannot verify delivery eligibility.":
          "This subscription's address is missing coordinates — can't verify delivery eligibility.",
        "Delivery is not available for this address yet.":
          "Delivery isn't currently available for this subscription's address.",
        "Subscription has no items.": "This subscription has no items to deliver.",
      };
      return { error: known[error.message] ?? "Couldn't generate a delivery order. Please try again." };
    }

    const result = Array.isArray(data) ? data[0] : data;

    revalidatePath("/admin/subscriptions");
    revalidatePath(`/admin/subscriptions/${id}`);
    revalidatePath("/admin/orders");
    return { orderNumber: result?.order_number };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
