"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import { Toggle } from "@/components/ui/Toggle";
import { slugify } from "@/lib/slug";
import type { CategoryRow } from "@/lib/catalog/categories";
import type { ProductRow } from "@/lib/catalog/products";
import { createProductAction, updateProductAction, type ProductState } from "./actions";

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  hair_oil: "Hair Oil",
  ro_water: "RO Water",
};

const STOCK_STATUS_LABELS: Record<string, string> = {
  in_stock: "In Stock",
  out_of_stock: "Out of Stock",
  preorder: "Pre-order",
};

/**
 * One reusable form for both /admin/products/new and
 * /admin/products/[id]/edit — every field and validation rule lives here
 * once. Creating a product redirects to its edit page (where image upload
 * becomes available) as soon as the row exists.
 */
export function ProductForm({ product, categories }: { product?: ProductRow; categories: CategoryRow[] }) {
  const isEdit = !!product;
  const router = useRouter();
  const action = isEdit ? updateProductAction : createProductAction;
  const [state, formAction] = useActionState<ProductState, FormData>(action, undefined);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!isEdit && state?.success && state.productId) {
      router.push(`/admin/products/${state.productId}/edit`);
    }
  }, [isEdit, state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {isEdit && <input type="hidden" name="id" value={product.id} />}

      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      {isEdit && state?.success && <FormMessage type="success">Changes saved.</FormMessage>}

      <div className="rounded-sm border border-line bg-white p-6">
        <h3 className="mb-5 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Basics</h3>
        <div className="flex flex-col gap-5">
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
              hint="Used in the product URL."
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Select label="Category" name="categoryId" defaultValue={product?.category_id ?? ""} required>
              <option value="" disabled>
                Choose a category…
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select label="Product Type" name="productType" defaultValue={product?.product_type ?? "hair_oil"} required>
              {Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <Textarea
            label="Short Description"
            name="shortDescription"
            rows={2}
            defaultValue={product?.short_description ?? ""}
            placeholder="One line shown on product cards and listings."
          />

          <Textarea
            label="Full Description"
            name="description"
            rows={5}
            defaultValue={product?.description ?? ""}
            placeholder="The full product description shown on its page."
          />
        </div>
      </div>

      <div className="rounded-sm border border-line bg-white p-6">
        <h3 className="mb-5 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Pricing &amp; Size</h3>
        <div className="grid gap-5 sm:grid-cols-3">
          <Input
            label="Price (PKR)"
            name="price"
            type="number"
            step="0.01"
            min={0}
            defaultValue={product?.price ?? ""}
            required
          />
          <Input
            label="Compare-at Price (optional)"
            name="compareAtPrice"
            type="number"
            step="0.01"
            min={0}
            defaultValue={product?.compare_at_price ?? ""}
            hint="Shown crossed out, for a discounted item."
          />
          <Input
            label="Size / Volume"
            name="sizeLabel"
            type="text"
            defaultValue={product?.size_label ?? ""}
            placeholder="e.g. 200ml, 19L"
          />
        </div>
      </div>

      <div className="rounded-sm border border-line bg-white p-6">
        <h3 className="mb-5 text-xs font-semibold tracking-[0.1em] text-muted uppercase">Status</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Stock Status" name="stockStatus" defaultValue={product?.stock_status ?? "in_stock"} required>
            {Object.entries(STOCK_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Input
            label="Sort Order"
            name="sortOrder"
            type="number"
            step={1}
            defaultValue={product?.sort_order ?? 0}
            hint="Lower numbers appear first."
          />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Toggle name="isActive" label="Active" defaultChecked={product?.is_active ?? true} hint="Visible to customers when active." />
          <Toggle
            name="isFeatured"
            label="Featured"
            defaultChecked={product?.is_featured ?? false}
            hint="Highlighted in featured placements."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton pendingLabel="Saving…" variant="solid" size="md">
          {isEdit ? "Save Changes" : "Create Product"}
        </SubmitButton>
      </div>
    </form>
  );
}
