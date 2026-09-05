"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/authorize";
import { slugify } from "@/lib/slug";
import {
  ALLOWED_PRODUCT_IMAGE_TYPES,
  MAX_PRODUCT_IMAGE_BYTES,
  PRODUCT_IMAGES_BUCKET,
  isAllowedProductImageType,
} from "@/lib/catalog/images";
import type { ProductType, StockStatus } from "@/types/database.types";

export type ProductState = { error?: string; success?: boolean; productId?: string } | undefined;
export type DeleteState = { error?: string } | undefined;

const PRODUCT_TYPES: ProductType[] = ["hair_oil", "ro_water"];
const STOCK_STATUSES: StockStatus[] = ["in_stock", "out_of_stock", "preorder"];

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const compareAtRaw = String(formData.get("compareAtPrice") ?? "").trim();
  const productType = String(formData.get("productType") ?? "") as ProductType;
  const sizeLabel = String(formData.get("sizeLabel") ?? "").trim();
  const stockStatus = String(formData.get("stockStatus") ?? "in_stock") as StockStatus;
  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const sortOrderRaw = String(formData.get("sortOrder") ?? "0").trim();

  if (!name) throw new Error("Product name is required.");
  if (!categoryId) throw new Error("Choose a category.");
  if (!PRODUCT_TYPES.includes(productType)) throw new Error("Choose a valid product type.");
  if (!STOCK_STATUSES.includes(stockStatus)) throw new Error("Choose a valid stock status.");

  const slug = slugify(rawSlug || name);
  if (!slug) throw new Error("Couldn't derive a valid slug from that name — try adding some letters or numbers.");

  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a number of 0 or more.");
  }

  let compareAtPrice: number | null = null;
  if (compareAtRaw) {
    compareAtPrice = Number(compareAtRaw);
    if (!Number.isFinite(compareAtPrice) || compareAtPrice < 0) {
      throw new Error("Compare-at price must be a number of 0 or more.");
    }
  }

  const sortOrder = Number(sortOrderRaw);
  if (!Number.isFinite(sortOrder)) throw new Error("Sort order must be a number.");

  return {
    name,
    slug,
    category_id: categoryId,
    short_description: shortDescription || null,
    description: description || null,
    price,
    compare_at_price: compareAtPrice,
    product_type: productType,
    size_label: sizeLabel || null,
    stock_status: stockStatus,
    is_active: isActive,
    is_featured: isFeatured,
    sort_order: Math.trunc(sortOrder),
  };
}

export async function createProductAction(_prevState: ProductState, formData: FormData): Promise<ProductState> {
  try {
    const { supabase } = await requireAdmin();
    const fields = readProductFields(formData);

    const { data: existing } = await supabase.from("products").select("id").eq("slug", fields.slug).maybeSingle();
    if (existing) {
      return { error: `The slug "${fields.slug}" is already used by another product.` };
    }

    const { data: category } = await supabase.from("categories").select("id").eq("id", fields.category_id).maybeSingle();
    if (!category) {
      return { error: "That category no longer exists — refresh and pick another." };
    }

    const { data: inserted, error } = await supabase.from("products").insert(fields).select("id").single();
    if (error || !inserted) {
      return { error: "Couldn't create this product. Please try again." };
    }

    revalidatePath("/admin/products");
    return { success: true, productId: inserted.id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updateProductAction(_prevState: ProductState, formData: FormData): Promise<ProductState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Missing product." };

    const fields = readProductFields(formData);

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", fields.slug)
      .neq("id", id)
      .maybeSingle();
    if (existing) {
      return { error: `The slug "${fields.slug}" is already used by another product.` };
    }

    const { error } = await supabase.from("products").update(fields).eq("id", id);
    if (error) {
      return { error: "Couldn't save your changes. Please try again." };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    return { success: true, productId: id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteProductAction(_prevState: DeleteState, formData: FormData): Promise<DeleteState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Missing product." };

    // Grab image paths first — product_images rows cascade-delete with the
    // product (ON DELETE CASCADE), but the underlying Storage objects don't,
    // so they're removed explicitly below to avoid orphaned files.
    const { data: images } = await supabase.from("product_images").select("storage_path").eq("product_id", id);

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      // order_items/subscription_items reference products with ON DELETE
      // SET NULL/RESTRICT respectively — a product that's part of a past
      // subscription can't be hard-deleted. Deactivating is the safe path.
      return {
        error:
          "Couldn't delete this product — it may be referenced by an existing subscription. Try deactivating it instead.",
      };
    }

    if (images && images.length > 0) {
      await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove(images.map((i) => i.storage_path));
    }

    revalidatePath("/admin/products");
    return undefined;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function toggleProductActiveAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const nextActive = formData.get("nextActive") === "true";
  if (!id) return;

  await supabase.from("products").update({ is_active: nextActive }).eq("id", id);
  revalidatePath("/admin/products");
}

export async function toggleProductFeaturedAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const nextFeatured = formData.get("nextFeatured") === "true";
  if (!id) return;

  await supabase.from("products").update({ is_featured: nextFeatured }).eq("id", id);
  revalidatePath("/admin/products");
}

// ---------------------------------------------------------------------------
// Product images
// ---------------------------------------------------------------------------

export type ImageState = { error?: string } | undefined;

export async function uploadProductImageAction(_prevState: ImageState, formData: FormData): Promise<ImageState> {
  try {
    const { supabase } = await requireAdmin();
    const productId = String(formData.get("productId") ?? "");
    const file = formData.get("file");

    if (!productId) return { error: "Missing product." };
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Choose an image file to upload." };
    }
    if (!isAllowedProductImageType(file.type)) {
      return { error: `Unsupported file type. Use ${ALLOWED_PRODUCT_IMAGE_TYPES.join(", ")}.` };
    }
    if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
      return { error: `Image is too large — max ${Math.round(MAX_PRODUCT_IMAGE_BYTES / (1024 * 1024))}MB.` };
    }

    const { data: product } = await supabase.from("products").select("id").eq("id", productId).maybeSingle();
    if (!product) return { error: "That product no longer exists." };

    const { count: existingCount } = await supabase
      .from("product_images")
      .select("*", { count: "exact", head: true })
      .eq("product_id", productId);

    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const storagePath = `${productId}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      return { error: "Couldn't upload this image. Please try again." };
    }

    const { error: insertError } = await supabase.from("product_images").insert({
      product_id: productId,
      storage_path: storagePath,
      sort_order: existingCount ?? 0,
    });

    if (insertError) {
      // Roll back the just-uploaded file so a failed DB write doesn't leave
      // an orphaned object in Storage.
      await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([storagePath]);
      return { error: "Couldn't save this image. Please try again." };
    }

    revalidatePath(`/admin/products/${productId}/edit`);
    return undefined;
  } catch {
    return { error: "Something went wrong uploading this image." };
  }
}

export async function deleteProductImageAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const productId = String(formData.get("productId") ?? "");
  if (!id || !productId) return;

  const { data: image } = await supabase.from("product_images").select("storage_path").eq("id", id).maybeSingle();

  await supabase.from("product_images").delete().eq("id", id);

  if (image) {
    await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([image.storage_path]);
  }

  revalidatePath(`/admin/products/${productId}/edit`);
}

/**
 * Reorders every image for a product in one call — the client sends the
 * full new id order (after a "move up"/"move down" click), and each gets
 * its sort_order set to its index. The first image (sort_order 0) is the
 * product's primary/cover image throughout the app.
 */
export async function reorderProductImagesAction(productId: string, orderedIds: string[]): Promise<void> {
  const { supabase } = await requireAdmin();
  if (!productId || orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("product_images").update({ sort_order: index }).eq("id", id).eq("product_id", productId),
    ),
  );

  revalidatePath(`/admin/products/${productId}/edit`);
}
