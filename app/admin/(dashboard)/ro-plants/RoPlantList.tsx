"use client";

import { useActionState, useState } from "react";
import { Pencil, Trash2, Droplets } from "lucide-react";
import type { RoPlantRow } from "@/lib/ro-plants/adminRoPlants";
import { RoPlantForm } from "./RoPlantForm";
import { deleteRoPlantAction, toggleRoPlantActiveAction, type DeleteRoPlantState } from "./actions";

function DeleteRoPlantButton({ id }: { id: string }) {
  const [state, formAction] = useActionState<DeleteRoPlantState, FormData>(deleteRoPlantAction, undefined);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (
          !confirm(
            "Delete this RO plant? Any address that was only covered by this plant will stop being deliverable. Past orders assigned to it keep their history but lose the plant reference. This can't be undone.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Delete RO plant"
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
    <form action={toggleRoPlantActiveAction}>
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

export function RoPlantList({ plants }: { plants: RoPlantRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-sm border border-dashed border-line bg-white/60 px-6 py-16 text-center">
        <Droplets className="h-8 w-8 text-muted/40" strokeWidth={1.25} />
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
          No RO plants yet. Until at least one active plant exists, no address anywhere can pass the
          delivery-eligibility check — checkout and subscriptions will show &quot;delivery isn&apos;t
          available here yet&quot; for every address.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {plants.map((plant) => {
        if (editingId === plant.id) {
          return (
            <div key={plant.id} className="rounded-sm border border-line bg-white p-6">
              <RoPlantForm plant={plant} onDone={() => setEditingId(null)} />
            </div>
          );
        }

        return (
          <div
            key={plant.id}
            className="flex flex-col gap-4 rounded-sm border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-lg text-forest">{plant.name}</p>
              </div>
              {plant.address && <p className="mt-1 max-w-md text-sm text-muted">{plant.address}</p>}
              <p className="mt-1.5 text-xs text-muted/70">
                {plant.latitude.toFixed(6)}, {plant.longitude.toFixed(6)} · {Number(plant.delivery_radius_km)}km radius
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <ActiveToggleButton id={plant.id} isActive={plant.is_active} />
              <button
                type="button"
                onClick={() => setEditingId(plant.id)}
                aria-label="Edit RO plant"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition-colors hover:bg-cream"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
              <DeleteRoPlantButton id={plant.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
