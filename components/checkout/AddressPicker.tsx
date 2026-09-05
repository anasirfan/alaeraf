"use client";

import { useState } from "react";
import { CheckCircle2, MapPin, Phone, Plus, TriangleAlert } from "lucide-react";
import { AddressForm } from "@/app/(site)/account/addresses/AddressForm";
import type { AddressWithDelivery } from "@/app/(site)/checkout/types";

const DELIVERY_LABEL: Record<AddressWithDelivery["deliverable"], { text: string; tone: string } | null> = {
  yes: { text: "Delivery available", tone: "text-forest" },
  no: { text: "Outside our delivery area right now", tone: "text-gold" },
  "no-coordinates": { text: "Add a location to check delivery", tone: "text-gold" },
  unknown: { text: "Couldn't check delivery for this address", tone: "text-gold" },
};

/**
 * Radio list of the customer's saved addresses, each showing whether it's
 * actually deliverable (computed server-side in app/checkout/page.tsx from
 * the address's own stored coordinates — never recomputed from anything
 * the browser reports here). An address that isn't deliverable can still be
 * seen, but can't be selected.
 *
 * "Add a new address" reuses the existing AddressForm/createAddressAction
 * as-is rather than a second implementation; createAddressAction now also
 * revalidates "/checkout" (see app/account/addresses/actions.ts), so a
 * newly saved address appears in this list automatically once the action
 * completes.
 */
export function AddressPicker({
  addresses,
  selectedId,
  onSelect,
}: {
  addresses: AddressWithDelivery[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [addingNew, setAddingNew] = useState(addresses.length === 0);

  return (
    <div className="flex flex-col gap-4">
      {addresses.length === 0 && !addingNew ? (
        <p className="rounded-sm border border-dashed border-line bg-ivory p-6 text-sm text-muted">
          You don&apos;t have any saved addresses yet — add one below.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => {
            const selectable = addr.deliverable === "yes";
            const isSelected = selectedId === addr.id;
            const badge = DELIVERY_LABEL[addr.deliverable];

            return (
              <label
                key={addr.id}
                className={`flex cursor-pointer flex-col gap-3 rounded-sm border p-5 transition-colors sm:flex-row sm:items-start sm:justify-between ${
                  isSelected
                    ? "border-forest bg-forest/[0.04]"
                    : selectable
                      ? "border-line bg-ivory hover:border-forest/40"
                      : "border-line/70 bg-ivory/60 opacity-80"
                } ${!selectable ? "cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="addressId"
                    value={addr.id}
                    checked={isSelected}
                    disabled={!selectable}
                    onChange={() => onSelect(addr.id)}
                    className="mt-1 h-4 w-4 shrink-0 border-line text-forest focus:ring-sage/40 disabled:opacity-40"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-base text-forest">{addr.recipient_name}</p>
                      {addr.is_default && (
                        <span className="rounded-full bg-sage/15 px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.06em] text-botanical uppercase">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                      <Phone className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                      {addr.phone}
                    </p>
                    <p className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={1.75} />
                      <span>
                        {addr.address_line}
                        {addr.area ? `, ${addr.area}` : ""}
                      </span>
                    </p>
                  </div>
                </div>

                {badge && (
                  <span className={`flex shrink-0 items-center gap-1.5 text-xs font-medium ${badge.tone}`}>
                    {addr.deliverable === "yes" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    ) : (
                      <TriangleAlert className="h-3.5 w-3.5" strokeWidth={1.75} />
                    )}
                    {badge.text}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {addingNew ? (
        <div className="rounded-sm border border-line bg-cream/40 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg text-forest">Add a new address</h3>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setAddingNew(false)}
                className="text-sm font-medium text-muted transition-colors hover:text-forest"
              >
                Cancel
              </button>
            )}
          </div>
          <AddressForm />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAddingNew(true)}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add New Address
        </button>
      )}
    </div>
  );
}
