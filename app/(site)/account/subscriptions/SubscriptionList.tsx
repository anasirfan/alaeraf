"use client";

import { useState, useTransition } from "react";
import { Calendar, Droplets, MapPin, Pause, Play, X } from "lucide-react";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubscriptionStatusBadge } from "@/components/SubscriptionStatusBadge";
import type { SubscriptionDetail } from "@/lib/subscriptions/queries";
import { updateMySubscriptionStatusAction } from "./actions";

function formatPrice(value: number) {
  return `Rs ${Math.round(value).toLocaleString()}`;
}

function formatDate(value: string | null) {
  if (!value) return "Not scheduled yet";
  return new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

function SubscriptionCard({ subscription }: { subscription: SubscriptionDetail }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"pause" | "resume" | "cancel" | null>(null);

  const monthlyPrice = subscription.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  function runAction(status: "active" | "paused" | "cancelled", action: "pause" | "resume" | "cancel") {
    setError(null);
    setPendingAction(action);
    startTransition(async () => {
      const result = await updateMySubscriptionStatusAction(subscription.id, status);
      if (result?.error) {
        setError(result.error);
      }
      setPendingAction(null);
    });
  }

  return (
    <div className="rounded-sm border border-line bg-cream/30 p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg text-forest">{subscription.plan?.name ?? "Subscription"}</p>
          <p className="mt-1 text-xs text-muted">Started {formatDate(subscription.created_at)}</p>
        </div>
        <SubscriptionStatusBadge status={subscription.status} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-aqua-deep">
            <Droplets className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[0.7rem] tracking-[0.06em] text-muted uppercase">Water</p>
            {subscription.items.length === 0 && <p className="text-sm text-ink-text">—</p>}
            {subscription.items.map((item) => (
              <p key={item.id} className="text-sm text-ink-text">
                {item.product?.name ?? "Product"} × {item.quantity}
              </p>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand text-forest">
            <span className="font-display text-sm">Rs</span>
          </div>
          <div>
            <p className="text-[0.7rem] tracking-[0.06em] text-muted uppercase">Monthly Price</p>
            <p className="text-sm text-ink-text">{formatPrice(monthlyPrice)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-ivory text-forest">
            <MapPin className="h-4 w-4" strokeWidth={1.6} />
          </div>
          <div>
            <p className="text-[0.7rem] tracking-[0.06em] text-muted uppercase">Delivery Address</p>
            {subscription.address ? (
              <>
                <p className="text-sm text-ink-text">{subscription.address.recipient_name}</p>
                <p className="text-xs text-muted">{subscription.address.address_line}</p>
              </>
            ) : (
              <p className="text-sm text-muted">Address removed</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-ivory text-forest">
            <Calendar className="h-4 w-4" strokeWidth={1.6} />
          </div>
          <div>
            <p className="text-[0.7rem] tracking-[0.06em] text-muted uppercase">Next Delivery</p>
            <p className="text-sm text-ink-text">
              {subscription.status === "cancelled" ? "—" : formatDate(subscription.next_delivery_date)}
            </p>
          </div>
        </div>
      </div>

      {subscription.notes && (
        <p className="mt-4 rounded-sm bg-ivory px-4 py-2.5 text-xs text-muted">Note: {subscription.notes}</p>
      )}

      {error && (
        <div className="mt-4">
          <FormMessage type="error">{error}</FormMessage>
        </div>
      )}

      {subscription.status !== "cancelled" && (
        <div className="mt-5 flex flex-wrap gap-2.5 border-t border-line pt-5">
          {subscription.status === "active" && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => runAction("paused", "pause")}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold tracking-[0.02em] text-forest transition-colors hover:border-forest disabled:opacity-60"
            >
              <Pause className="h-3.5 w-3.5" strokeWidth={2} />
              {pendingAction === "pause" && isPending ? "Pausing…" : "Pause"}
            </button>
          )}
          {subscription.status === "paused" && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => runAction("active", "resume")}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold tracking-[0.02em] text-forest transition-colors hover:border-forest disabled:opacity-60"
            >
              <Play className="h-3.5 w-3.5" strokeWidth={2} />
              {pendingAction === "resume" && isPending ? "Resuming…" : "Resume"}
            </button>
          )}
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction("cancelled", "cancel")}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold tracking-[0.02em] text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-60"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
            {pendingAction === "cancel" && isPending ? "Cancelling…" : "Cancel"}
          </button>
        </div>
      )}
    </div>
  );
}

export function SubscriptionList({ subscriptions }: { subscriptions: SubscriptionDetail[] }) {
  if (subscriptions.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-line bg-cream/20 p-10 text-center">
        <p className="text-sm text-muted">You don&apos;t have any subscriptions yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {subscriptions.map((subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
}
