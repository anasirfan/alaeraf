import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { listCategoriesForAdmin } from "@/lib/catalog/categories";
import { CategoryList } from "./CategoryList";
import { AddCategoryPanel } from "./AddCategoryPanel";

export const metadata: Metadata = {
  title: "Categories — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const categories = await listCategoriesForAdmin(supabase);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl text-forest">Categories</h2>
        <p className="mt-1.5 text-sm text-muted">
          Organize the catalog. A category can&apos;t be deleted while products still use it — the
          product count next to each one shows why a delete was blocked.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <CategoryList categories={categories} />
        <AddCategoryPanel hasCategories={categories.length > 0} />
      </div>
    </div>
  );
}
