import type { OrderStatus, PaymentStatus } from "@/types/database.types";

const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "border-gold/40 bg-gold/10 text-gold",
  confirmed: "border-sage/30 bg-sage/10 text-botanical",
  processing: "border-aqua-deep/30 bg-aqua-deep/10 text-aqua-deep",
  out_for_delivery: "border-forest/30 bg-forest/10 text-forest",
  delivered: "border-sage/40 bg-sage/15 text-botanical",
  cancelled: "border-line text-muted",
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_STATUS_STYLE: Record<PaymentStatus, string> = {
  unpaid: "border-gold/40 bg-gold/10 text-gold",
  paid: "border-sage/30 bg-sage/10 text-botanical",
  refunded: "border-line text-muted",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  paid: "Paid",
  refunded: "Refunded",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.04em] uppercase ${ORDER_STATUS_STYLE[status]}`}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.04em] uppercase ${PAYMENT_STATUS_STYLE[status]}`}
    >
      {PAYMENT_STATUS_LABEL[status]}
    </span>
  );
}
