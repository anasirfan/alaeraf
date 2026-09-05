"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CategoryForm } from "./CategoryForm";

export function AddCategoryPanel({ hasCategories }: { hasCategories: boolean }) {
  const [open, setOpen] = useState(!hasCategories);
  const [formKey, setFormKey] = useState(0);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Add Category
      </button>
    );
  }

  return (
    <div className="rounded-sm border border-line bg-cream/40 p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl text-forest">New category</h2>
        {hasCategories && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-muted transition-colors hover:text-forest"
          >
            Cancel
          </button>
        )}
      </div>
      <CategoryForm key={formKey} onDone={() => setFormKey((k) => k + 1)} />
    </div>
  );
}
