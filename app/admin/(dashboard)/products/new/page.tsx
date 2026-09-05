import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listActiveCategories } from "@/lib/catalog/categories";
import { ProductForm } from "../ProductForm";

export const metadata: Metadata = {
  title: "New Product — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const supabase = await createClient();
  // Only active categories are offered when creating a new product — an
  // admin who deactivated a category almost certainly doesn't want new
  // products assigned to it. Editing an existing product still shows its
  // current category even if it was deactivated since (see [id]/edit).
  const categories = await listActiveCategories(supabase);

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.04em] text-muted uppercase transition-colors hover:text-forest"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Products
      </Link>

      <h2 className="mb-1 font-display text-2xl text-forest">New Product</h2>
      <p className="mb-6 text-sm text-muted">
        Enter the product&apos;s real details below. You&apos;ll be able to add photos right after
        it&apos;s created.
      </p>

      {categories.length === 0 ? (
        <p className="rounded-sm border border-dashed border-line bg-white/60 p-6 text-sm text-muted">
          Create an active category first — a product needs one to belong to.{" "}
          <Link href="/admin/categories" className="font-semibold text-forest underline underline-offset-2">
            Go to Categories
          </Link>
          .
        </p>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
