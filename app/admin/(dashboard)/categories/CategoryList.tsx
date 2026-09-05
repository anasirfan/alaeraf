"use client";

import { useActionState, useState } from "react";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import type { CategoryWithProductCount } from "@/lib/catalog/categories";
import { CategoryForm } from "./CategoryForm";
import { deleteCategoryAction, toggleCategoryActiveAction, type DeleteCategoryState } from "./actions";

function DeleteCategoryButton({ id }: { id: string }) {
  const [state, formAction] = useActionState<DeleteCategoryState, FormData>(deleteCategoryAction, undefined);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Delete this category? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Delete category"
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
    <form action={toggleCategoryActiveAction}>
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

export function CategoryList({ categories }: { categories: CategoryWithProductCount[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (categories.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-line bg-white/60 p-6 text-sm text-muted">
        No categories yet — create the first one below.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {categories.map((cat) => {
        const productCount = cat.products?.[0]?.count ?? 0;

        if (editingId === cat.id) {
          return (
            <div key={cat.id} className="rounded-sm border border-line bg-white p-6">
              <CategoryForm category={cat} onDone={() => setEditingId(null)} />
            </div>
          );
        }

        return (
          <div
            key={cat.id}
            className="flex flex-col gap-4 rounded-sm border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <GripVertical className="mt-1 hidden h-4 w-4 shrink-0 text-muted/40 sm:block" strokeWidth={1.75} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-lg text-forest">{cat.name}</p>
                  <span className="rounded-full bg-cream px-2 py-0.5 text-[0.65rem] font-semibold text-muted">
                    /{cat.slug}
                  </span>
                </div>
                {cat.description && <p className="mt-1 max-w-md text-sm text-muted">{cat.description}</p>}
                <p className="mt-1.5 text-xs text-muted/70">
                  {productCount} product{productCount === 1 ? "" : "s"} · sort {cat.sort_order}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <ActiveToggleButton id={cat.id} isActive={cat.is_active} />
              <button
                type="button"
                onClick={() => setEditingId(cat.id)}
                aria-label="Edit category"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition-colors hover:bg-cream"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
              <DeleteCategoryButton id={cat.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
