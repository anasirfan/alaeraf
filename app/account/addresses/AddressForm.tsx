"use client";

import { useActionState, useEffect, useState } from "react";
import { LocateFixed } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import type { Database } from "@/types/database.types";
import { createAddressAction, updateAddressAction, type AddressState } from "./actions";

type Address = Database["public"]["Tables"]["addresses"]["Row"];

export function AddressForm({
  address,
  onDone,
}: {
  address?: Address;
  onDone?: () => void;
}) {
  const isEdit = !!address;
  const action = isEdit ? updateAddressAction : createAddressAction;
  const [state, formAction] = useActionState<AddressState, FormData>(action, undefined);

  const [lat, setLat] = useState(address?.latitude != null ? String(address.latitude) : "");
  const [lng, setLng] = useState(address?.longitude != null ? String(address.longitude) : "");
  const [locateStatus, setLocateStatus] = useState<"idle" | "locating" | "done" | "error">("idle");

  // Edit mode closes the inline editor as soon as a save succeeds. Create
  // mode leaves the success message on screen — see the "Add another"
  // button below, which is what actually resets the form.
  useEffect(() => {
    if (isEdit && state?.success && onDone) {
      onDone();
    }
  }, [isEdit, state?.success, onDone]);

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setLocateStatus("error");
      return;
    }
    setLocateStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocateStatus("done");
      },
      () => setLocateStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {isEdit && <input type="hidden" name="id" value={address.id} />}

      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      {!isEdit && state?.success && (
        <FormMessage type="success">
          Address saved.{" "}
          {onDone && (
            <button type="button" onClick={onDone} className="font-semibold underline underline-offset-2">
              Add another
            </button>
          )}
        </FormMessage>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Recipient Name"
          name="recipientName"
          type="text"
          defaultValue={address?.recipient_name ?? ""}
          required
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          placeholder="03xx-xxxxxxx"
          defaultValue={address?.phone ?? ""}
          required
        />
      </div>

      <Input
        label="Address"
        name="addressLine"
        type="text"
        placeholder="House / street / building"
        defaultValue={address?.address_line ?? ""}
        required
      />

      <Input
        label="Area"
        name="area"
        type="text"
        placeholder="e.g. Nazimabad, Karachi"
        defaultValue={address?.area ?? ""}
      />

      <Textarea
        label="Delivery Notes (optional)"
        name="deliveryNotes"
        rows={2}
        placeholder="Gate colour, landmark, best time to deliver…"
        defaultValue={address?.delivery_notes ?? ""}
      />

      <div className="rounded-sm border border-line/70 bg-ivory p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.7rem] font-semibold tracking-[0.08em] text-muted uppercase">
            Location (optional, for delivery)
          </p>
          <button
            type="button"
            onClick={useCurrentLocation}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-botanical transition-colors hover:text-forest"
          >
            <LocateFixed className="h-3.5 w-3.5" strokeWidth={2} />
            {locateStatus === "locating" ? "Locating…" : "Use my current location"}
          </button>
        </div>

        {locateStatus === "done" && (
          <p className="mt-2 text-xs text-forest">Location captured ✓ ({lat}, {lng})</p>
        )}
        {locateStatus === "error" && (
          <p className="mt-2 text-xs text-red-600">
            Couldn&apos;t get your location — allow location access, or enter coordinates manually below.
          </p>
        )}

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Input
            label="Latitude"
            name="latitude"
            type="number"
            step="any"
            min={-90}
            max={90}
            placeholder="e.g. 24.8607"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <Input
            label="Longitude"
            name="longitude"
            type="number"
            step="any"
            min={-180}
            max={180}
            placeholder="e.g. 67.0011"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={address?.is_default ?? false}
          className="h-4 w-4 rounded border-line text-forest focus:ring-sage/40"
        />
        Set as my default address
      </label>

      <div className="flex items-center gap-3">
        <SubmitButton pendingLabel="Saving…" variant="solid" size="md">
          {isEdit ? "Save Changes" : "Add Address"}
        </SubmitButton>
        {isEdit && onDone && (
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
