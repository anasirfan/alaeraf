"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SubscriptionStatus } from "@/types/database.types";

export type SubscriptionActionState = { error?: string; success?: boolean } | undefined;

/**
 * Customer-facing pause/resume/cancel. The only enforcement that matters is
 * inside update_subscription_status() (0008_subscriptions.sql) — it re-checks
 * auth.uid() against the subscription's own customer_id and only allows
 * active<->paused and (active|paused)->cancelled for a non-admin caller,
 * raising "Subscription not found." for anything else (including someone
 * else's subscription id, which looks identical to a wrong id — never
 * confirms existence of another customer's row).
 */
export async function updateMySubscriptionStatusAction(
  subscriptionId: string,
  status: SubscriptionStatus,
): Promise<SubscriptionActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in again." };
  }

  const { error } = await supabase.rpc("update_subscription_status", {
    p_subscription_id: subscriptionId,
    p_status: status,
  });

  if (error) {
    if (error.message === "Subscription not found.") {
      return { error: "We couldn't find that subscription." };
    }
    if (error.message === "That status change is not allowed.") {
      return { error: "That change isn't allowed from this status." };
    }
    return { error: "Couldn't update your subscription. Please try again." };
  }

  revalidatePath("/account/subscriptions");
  return { success: true };
}
