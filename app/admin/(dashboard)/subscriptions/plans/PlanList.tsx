"use client";

import { useActionState, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { SubscriptionPlanRow } from "@/lib/subscriptions/queries";
import { PlanForm } from "./PlanForm";
import { deletePlanAction, togglePlanActiveAction, type DeletePlanState } from "./actions";

const FREQUENCY_LABEL: Record<string, string> = {
  weekly: "Weekly",
  fortnightly: "Every 2 weeks",
  monthly: "Monthly",
};

function DeletePlanButton({ id }: { id: string }) {
  const [state, formAction] = useActionState<DeletePlanState, FormData>(deletePlanAction, undefined);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Delete this plan? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Delete plan"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
      {state?.error && <p className="mt-2 max-w-[14rem] text-right text-xs text-red-600">{state.error}</p>}
    </form>
  );
}

function ActiveToggleButton({ id, isActive }: { id: string; isActive: boolean }) {
  return (
    <form action={togglePlanActiveAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="nextActive" value={(!isActive).toString()} />
      <button
        type="submit"
        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
          isActive
            ? "border-sage/30 bg-sage/10 text-botanical hover:border-sage/50"
            : "border-line text-muted hover:border-forest hover:text-forest"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </button>
    </form>
  );
}

export function PlanList({ plans }: { plans: SubscriptionPlanRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (plans.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-line bg-white/60 p-6 text-sm text-muted">
        No subscription plans yet — create the first one below.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {plans.map((plan) => {
        if (editingId === plan.id) {
          return (
            <div key={plan.id} className="rounded-sm border border-line bg-white p-6">
              <PlanForm plan={plan} onDone={() => setEditingId(null)} />
            </div>
          );
        }

        return (
          <div
            key={plan.id}
            className="flex flex-col gap-4 rounded-sm border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-lg text-forest">{plan.name}</p>
                <span className="rounded-full bg-cream px-2 py-0.5 text-[0.65rem] font-semibold text-muted">
                  /{plan.slug}
                </span>
                <span className="rounded-full bg-sage/15 px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.06em] text-botanical uppercase">
                  {FREQUENCY_LABEL[plan.default_frequency] ?? plan.default_frequency}
                </span>
              </div>
              {plan.description && <p className="mt-1 max-w-md text-sm text-muted">{plan.description}</p>}
              <p className="mt-1.5 text-xs text-muted/70">sort {plan.sort_order}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <ActiveToggleButton id={plan.id} isActive={plan.is_active} />
              <button
                type="button"
                onClick={() => setEditingId(plan.id)}
                aria-label="Edit plan"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition-colors hover:bg-cream"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
              <DeletePlanButton id={plan.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
