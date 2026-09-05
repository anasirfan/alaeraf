"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import { Toggle } from "@/components/ui/Toggle";
import type { RoPlantRow } from "@/lib/ro-plants/adminRoPlants";
import { createRoPlantAction, updateRoPlantAction, type RoPlantState } from "./actions";

/**
 * One form, two modes — same pattern as CategoryForm/ProductForm. Latitude
 * and longitude are the two fields that matter most here: they're what
 * nearest_eligible_ro_plant() actually uses to decide whether an address
 * can be delivered to (see the callout in the parent screen).
 */
export function RoPlantForm({ plant, onDone }: { plant?: RoPlantRow; onDone?: () => void }) {
  const isEdit = !!plant;
  const action = isEdit ? updateRoPlantAction : createRoPlantAction;
  const [state, formAction] = useActionState<RoPlantState, FormData>(action, undefined);

  useEffect(() => {
    if (isEdit && state?.success && onDone) {
      onDone();
    }
  }, [isEdit, state?.success, onDone]);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {isEdit && <input type="hidden" name="id" value={plant.id} />}

      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      {!isEdit && state?.success && (
        <FormMessage type="success">
          RO plant created.{" "}
          {onDone && (
            <button type="button" onClick={onDone} className="font-semibold underline underline-offset-2">
              Add another
            </button>
          )}
        </FormMessage>
      )}

      <Input
        label="Plant name"
        name="name"
        type="text"
        defaultValue={plant?.name ?? ""}
        placeholder="Al Aeraf RO Plant — Nazimabad"
        required
      />

      <Input
        label="Address (optional, for your own reference)"
        name="address"
        type="text"
        defaultValue={plant?.address ?? ""}
        placeholder="Street / area / landmark"
        hint="Shown only in the admin dashboard — customers never see this directly."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Latitude"
          name="latitude"
          type="number"
          step="any"
          min={-90}
          max={90}
          defaultValue={plant?.latitude ?? ""}
          placeholder="24.914440"
          hint="Between -90 and 90. From Google Maps: right-click the exact spot → click the coordinates to copy them."
          required
        />
        <Input
          label="Longitude"
          name="longitude"
          type="number"
          step="any"
          min={-180}
          max={180}
          defaultValue={plant?.longitude ?? ""}
          placeholder="67.029831"
          hint="Between -180 and 180."
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Delivery radius (km)"
          name="deliveryRadiusKm"
          type="number"
          step="0.1"
          min="0.1"
          defaultValue={plant?.delivery_radius_km ?? 5}
          hint="How far from this exact point deliveries are considered eligible. Defaults to 5km."
          required
        />
        <div className="flex items-end pb-3">
          <Toggle
            name="isActive"
            label="Active"
            defaultChecked={plant?.is_active ?? true}
            hint="Inactive plants are never used for delivery-eligibility checks."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton pendingLabel="Saving…" variant="solid" size="md">
          {isEdit ? "Save Changes" : "Create RO Plant"}
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
