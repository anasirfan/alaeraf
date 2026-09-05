"use client";

import { useActionState, useEffect, useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import { Toggle } from "@/components/ui/Toggle";
import { slugify } from "@/lib/slug";
import type { SubscriptionPlanRow } from "@/lib/subscriptions/queries";
import { createPlanAction, updatePlanAction, type PlanState } from "./actions";

const FREQUENCY_OPTIONS: { value: string; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Every 2 weeks" },
  { value: "monthly", label: "Monthly" },
];

/**
 * One form, two modes — create when `plan` is omitted, edit when it's
 * passed. Mirrors CategoryForm exactly.
 */
export function PlanForm({ plan, onDone }: { plan?: SubscriptionPlanRow; onDone?: () => void }) {
  const isEdit = !!plan;
  const action = isEdit ? updatePlanAction : createPlanAction;
  const [state, formAction] = useActionState<PlanState, FormData>(action, undefined);

  const [name, setName] = useState(plan?.name ?? "");
  const [slug, setSlug] = useState(plan?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (isEdit && state?.success && onDone) {
      onDone();
    }
  }, [isEdit, state?.success, onDone]);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {isEdit && <input type="hidden" name="id" value={plan.id} />}

      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      {!isEdit && state?.success && (
        <FormMessage type="success">
          Plan created.{" "}
          {onDone && (
            <button type="button" onClick={onDone} className="font-semibold underline underline-offset-2">
              Add another
            </button>
          )}
        </FormMessage>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => {
            const v = e.target.value;
            setName(v);
            if (!slugTouched) setSlug(slugify(v));
          }}
          required
        />
        <Input
          label="Slug"
          name="slug"
          type="text"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          hint="Used internally to identify this plan — lowercase letters, numbers, and hyphens only."
          required
        />
      </div>

      <Textarea
        label="Description (optional)"
        name="description"
        rows={3}
        defaultValue={plan?.description ?? ""}
        placeholder="A short line shown to customers when they choose this plan."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Select label="Delivery Frequency" name="defaultFrequency" defaultValue={plan?.default_frequency ?? "monthly"}>
          {FREQUENCY_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>
        <Input
          label="Sort Order"
          name="sortOrder"
          type="number"
          step={1}
          defaultValue={plan?.sort_order ?? 0}
          hint="Lower numbers appear first."
        />
      </div>

      <Toggle
        name="isActive"
        label="Active"
        defaultChecked={plan?.is_active ?? true}
        hint="Only active plans are shown to customers on the subscribe page."
      />

      <div className="flex items-center gap-3">
        <SubmitButton pendingLabel="Saving…" variant="solid" size="md">
          {isEdit ? "Save Changes" : "Create Plan"}
        </SubmitButton>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-sm font-medium text-muted transition-colors hover:text-forest"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
