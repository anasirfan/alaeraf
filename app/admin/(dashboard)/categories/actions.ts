"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/authorize";
import { slugify } from "@/lib/slug";

export type CategoryState = { error?: string; success?: boolean } | undefined;

function readCategoryFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const isActive = formData.get("isActive") === "on";
  const sortOrderRaw = String(formData.get("sortOrder") ?? "0").trim();

  if (!name) {
    throw new Error("Category name is required.");
  }

  // Never trust a slug from the client verbatim — normalize through the
  // same slugify() the form's live preview uses, so "My Category!" and a
  // hand-edited "my-category" both collapse to one canonical value before
  // the uniqueness check below.
  const slug = slugify(rawSlug || name);
  if (!slug) {
    throw new Error("Couldn't derive a valid slug from that name — try adding some letters or numbers.");
  }

  const sortOrder = Number(sortOrderRaw);
  if (!Number.isFinite(sortOrder)) {
    throw new Error("Sort order must be a number.");
  }

  return {
    name,
    slug,
    description: description || null,
    image_url: imageUrl || null,
    is_active: isActive,
    sort_order: Math.trunc(sortOrder),
  };
}

export async function createCategoryAction(_prevState: CategoryState, formData: FormData): Promise<CategoryState> {
  try {
    const { supabase } = await requireAdmin();
    const fields = readCategoryFields(formData);

    const { data: existing } = await supabase.from("categories").select("id").eq("slug", fields.slug).maybeSingle();
    if (existing) {
      return { error: `The slug "${fields.slug}" is already used by another category.` };
    }

    const { error } = await supabase.from("categories").insert(fields);
    if (error) {
      return { error: "Couldn't create this category. Please try again." };
    }

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updateCategoryAction(_prevState: CategoryState, formData: FormData): Promise<CategoryState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Missing category." };

    const fields = readCategoryFields(formData);

    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", fields.slug)
      .neq("id", id)
      .maybeSingle();
    if (existing) {
      return { error: `The slug "${fields.slug}" is already used by another category.` };
    }

    const { error } = await supabase.from("categories").update(fields).eq("id", id);
    if (error) {
      return { error: "Couldn't save your changes. Please try again." };
    }

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export type DeleteCategoryState = { error?: string } | undefined;

export async function deleteCategoryAction(
  _prevState: DeleteCategoryState,
  formData: FormData,
): Promise<DeleteCategoryState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Missing category." };

    // products.category_id is NOT NULL with ON DELETE RESTRICT, so the
    // database itself refuses to delete a category that still has
    // products — this check just turns that into a clear message instead
    // of a raw foreign-key-violation error reaching the UI.
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);

    if (count && count > 0) {
      return {
        error: `Can't delete this category — ${count} product${count === 1 ? "" : "s"} still use it. Reassign or delete ${count === 1 ? "it" : "them"} first.`,
      };
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      return { error: "Couldn't delete this category. Please try again." };
    }

    revalidatePath("/admin/categories");
    return undefined;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function toggleCategoryActiveAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const nextActive = formData.get("nextActive") === "true";
  if (!id) return;

  await supabase.from("categories").update({ is_active: nextActive }).eq("id", id);
  revalidatePath("/admin/categories");
}
