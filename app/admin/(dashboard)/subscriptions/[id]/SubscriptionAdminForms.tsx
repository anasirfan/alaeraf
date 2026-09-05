"use client";

import { useActionState } from "react";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import { SUBSCRIPTION_STATUS_LABEL } from "@/components/SubscriptionStatusBadge";
import { SUBSCRIPTION_STATUSES } from "@/lib/subscriptions/queries";
import {
  updateSubscriptionStatusAction,
  generateSubscriptionDeliveryAction,
} from "../actions";
import type { SubscriptionStatus } from "@/types/database.types";

export function SubscriptionStatusForm({ subscriptionId, status }: { subscriptionId: string; status: SubscriptionStatus }) {
  const [state, formAction] = useActionState(updateSubscriptionStatusAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={subscriptionId} />
      <Select label="Subscription Status" name="status" defaultValue={status}>
        {SUBSCRIPTION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {SUBSCRIPTION_STATUS_LABEL[s]}
          </option>
        ))}
      </Select>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      {state?.success && <FormMessage type="success">Status updated.</FormMessage>}
      <SubmitButton size="md" className="self-start" pendingLabel="Saving…">
        Update Status
      </SubmitButton>
    </form>
  );
}

/**
 * Deliberately not automatic — there's no payment gateway to charge, so
 * every monthly delivery is this explicit admin click. It calls
 * create_subscription_delivery_order() (0008_subscriptions.sql), which
 * creates one real order in the existing orders/order_items tables and
 * advances this subscription's next_delivery_date.
 */
export function GenerateDeliveryForm({ subscriptionId, disabled }: { subscriptionId: string; disabled: boolean }) {
  const [state, formAction] = useActionState(generateSubscriptionDeliveryAction, undefined);

  if (disabled) {
    return <p className="text-xs text-muted">Only active subscriptions can have a delivery order generated.</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={subscriptionId} />
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      {state?.orderNumber && (
        <FormMessage type="success">Order {state.orderNumber} created for this delivery.</FormMessage>
      )}
      <SubmitButton size="md" className="self-start" pendingLabel="Generating…">
        Generate This Month&apos;s Delivery
      </SubmitButton>
    </form>
  );
}
