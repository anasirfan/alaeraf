import type { SubscriptionStatus } from "@/types/database.types";

const SUBSCRIPTION_STATUS_STYLE: Record<SubscriptionStatus, string> = {
  active: "border-sage/30 bg-sage/10 text-botanical",
  paused: "border-gold/40 bg-gold/10 text-gold",
  cancelled: "border-line text-muted",
};

export const SUBSCRIPTION_STATUS_LABEL: Record<SubscriptionStatus, string> = {
  active: "Active",
  paused: "Paused",
  cancelled: "Cancelled",
};

export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.04em] uppercase ${SUBSCRIPTION_STATUS_STYLE[status]}`}
    >
      {SUBSCRIPTION_STATUS_LABEL[status]}
    </span>
  );
}
