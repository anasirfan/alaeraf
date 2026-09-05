"use client";

import { useActionState } from "react";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import { updateOrderStatusAction, updatePaymentStatusAction } from "../actions";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from "@/lib/orders/adminOrders";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/components/admin/OrderStatusBadge";
import type { OrderStatus, PaymentStatus } from "@/types/database.types";

/**
 * Two small, independent forms (order status / payment status) rather than
 * one combined form — each maps to its own server action and its own
 * `updated_at` write, and a payment-status change shouldn't accidentally
 * fire an order-status update (or vice versa) just because both selects
 * shared a submit button.
 */
export function OrderStatusForm({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [state, formAction] = useActionState(updateOrderStatusAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={orderId} />
      <Select label="Order Status" name="status" defaultValue={status}>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABEL[s]}
          </option>
        ))}
      </Select>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      {state?.success && <FormMessage type="success">Order status updated.</FormMessage>}
      <SubmitButton size="md" className="self-start" pendingLabel="Saving…">
        Update Status
      </SubmitButton>
    </form>
  );
}

export function PaymentStatusForm({ orderId, paymentStatus }: { orderId: string; paymentStatus: PaymentStatus }) {
  const [state, formAction] = useActionState(updatePaymentStatusAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={orderId} />
      <Select label="Payment Status" name="paymentStatus" defaultValue={paymentStatus}>
        {PAYMENT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {PAYMENT_STATUS_LABEL[s]}
          </option>
        ))}
      </Select>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      {state?.success && <FormMessage type="success">Payment status updated.</FormMessage>}
      <SubmitButton size="md" className="self-start" pendingLabel="Saving…">
        Update Payment
      </SubmitButton>
    </form>
  );
}
