import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listCategoriesForAdmin } from "@/lib/catalog/categories";
import { getProductForAdmin, getProductImages } from "@/lib/catalog/products";
import { ProductForm } from "../../ProductForm";
import { ProductImageManager } from "../../ProductImageManager";

export const metadata: Metadata = {
  title: "Edit Product — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [product, images, categoriesWithCounts] = await Promise.all([
    getProductForAdmin(supabase, id),
    getProductImages(supabase, id),
    listCategoriesForAdmin(supabase),
  ]);

  if (!product) notFound();

  // Edit mode intentionally offers every category, active or not — a
  // product already assigned to a category that's since been deactivated
  // should still show that category selected, not silently swap it.
  const categories = categoriesWithCounts.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image_url: c.image_url,
    is_active: c.is_active,
    sort_order: c.sort_order,
    created_at: c.created_at,
    updated_at: c.updated_at,
  }));

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.04em] text-muted uppercase transition-colors hover:text-forest"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Products
      </Link>

      <h2 className="mb-1 font-display text-2xl text-forest">Edit Product</h2>
      <p className="mb-6 text-sm text-muted">{product.name}</p>

      <div className="flex flex-col gap-6">
        <ProductForm product={product} categories={categories} />
        <ProductImageManager productId={product.id} images={images} />
      </div>
    </div>
  );
}
