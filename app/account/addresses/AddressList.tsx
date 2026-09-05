"use client";

import { useState } from "react";
import { Star, Pencil, Trash2, Phone, MapPin } from "lucide-react";
import type { Database } from "@/types/database.types";
import { AddressForm } from "./AddressForm";
import { deleteAddressAction, setDefaultAddressAction } from "./actions";

type Address = Database["public"]["Tables"]["addresses"]["Row"];

export function AddressList({ addresses }: { addresses: Address[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (addresses.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-line bg-ivory p-6 text-sm text-muted">
        You haven&apos;t saved any addresses yet — add one below.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((addr) =>
        editingId === addr.id ? (
          <div key={addr.id} className="rounded-sm border border-line bg-ivory p-6">
            <AddressForm address={addr} onDone={() => setEditingId(null)} />
          </div>
        ) : (
          <div
            key={addr.id}
            className="flex flex-col gap-4 rounded-sm border border-line bg-ivory p-6 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <p className="font-display text-lg text-forest">{addr.recipient_name}</p>
                {addr.is_default && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.06em] text-botanical uppercase">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    Default
                  </span>
                )}
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                {addr.phone}
              </p>
              <p className="mt-1 flex items-start gap-1.5 text-sm text-muted">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                <span>
                  {addr.address_line}
                  {addr.area ? `, ${addr.area}` : ""}
                </span>
              </p>
              {addr.delivery_notes && (
                <p className="mt-1.5 pl-5 text-xs text-muted italic">{addr.delivery_notes}</p>
              )}
              {addr.latitude != null && addr.longitude != null && (
                <p className="mt-1.5 pl-5 text-xs text-muted/70">
                  {addr.latitude.toFixed(5)}, {addr.longitude.toFixed(5)}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {!addr.is_default && (
                <form action={setDefaultAddressAction}>
                  <input type="hidden" name="id" value={addr.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-muted transition-colors hover:border-forest hover:text-forest"
                  >
                    Set Default
                  </button>
                </form>
              )}
              <button
                type="button"
                onClick={() => setEditingId(addr.id)}
                aria-label="Edit address"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition-colors hover:bg-cream"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
              <form
                action={deleteAddressAction}
                onSubmit={(e) => {
                  if (!confirm("Delete this address? This can't be undone.")) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="id" value={addr.id} />
                <button
                  type="submit"
                  aria-label="Delete address"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </form>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
