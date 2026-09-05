"use client";

import { useActionState, useEffect, useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import { Toggle } from "@/components/ui/Toggle";
import { slugify } from "@/lib/slug";
import type { CategoryRow } from "@/lib/catalog/categories";
import { createCategoryAction, updateCategoryAction, type CategoryState } from "./actions";

/**
 * One form, two modes — create when `category` is omitted, edit when it's
 * passed. Keeps every field and validation rule in one place rather than
 * duplicating a near-identical form for each screen.
 */
export function CategoryForm({ category, onDone }: { category?: CategoryRow; onDone?: () => void }) {
  const isEdit = !!category;
  const action = isEdit ? updateCategoryAction : createCategoryAction;
  const [state, formAction] = useActionState<CategoryState, FormData>(action, undefined);

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (isEdit && state?.success && onDone) {
      onDone();
    }
  }, [isEdit, state?.success, onDone]);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {isEdit && <input type="hidden" name="id" value={category.id} />}

      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      {!isEdit && state?.success && (
        <FormMessage type="success">
          Category created.{" "}
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
          hint="Used in the URL — lowercase letters, numbers, and hyphens only."
          required
        />
      </div>

      <Textarea
        label="Description (optional)"
        name="description"
        rows={3}
        defaultValue={category?.description ?? ""}
        placeholder="A short line shown wherever this category appears."
      />

      <Input
        label="Image URL (optional)"
        name="imageUrl"
        type="text"
        defaultValue={category?.image_url ?? ""}
        placeholder="https://…"
        hint="Product photo uploads live on individual products — this is only for a category-level banner/thumbnail if you use one."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Sort Order"
          name="sortOrder"
          type="number"
          step={1}
          defaultValue={category?.sort_order ?? 0}
          hint="Lower numbers appear first."
        />
        <div className="flex items-end pb-3">
          <Toggle name="isActive" label="Active" defaultChecked={category?.is_active ?? true} hint="Visible to customers when active." />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton pendingLabel="Saving…" variant="solid" size="md">
          {isEdit ? "Save Changes" : "Create Category"}
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
