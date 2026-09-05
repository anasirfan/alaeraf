import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listProductsForAdmin, type ProductStatusFilter } from "@/lib/catalog/products";
import { listCategoriesForAdmin } from "@/lib/catalog/categories";
import { DeleteProductButton } from "./DeleteProductButton";
import { toggleProductActiveAction, toggleProductFeaturedAction } from "./actions";

export const metadata: Metadata = {
  title: "Products — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function buildQuery(params: Record<string, string | undefined>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) usp.set(key, value);
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.q?.trim() || undefined;
  const categoryId = params.category || undefined;
  const status = (params.status as ProductStatusFilter) || "all";
  const page = Math.max(1, Number(params.page) || 1);

  const supabase = await createClient();
  const [categories, { rows, count }] = await Promise.all([
    listCategoriesForAdmin(supabase),
    listProductsForAdmin(supabase, { search, categoryId, status, page, pageSize: PAGE_SIZE }),
  ]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const baseParams = { q: search, category: categoryId, status: status === "all" ? undefined : status };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-forest">Products</h2>
          <p className="mt-1.5 text-sm text-muted">
            {count} product{count === 1 ? "" : "s"} total.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ink"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Product
        </Link>
      </div>

      <form
        method="get"
        className="mb-6 flex flex-wrap items-end gap-3 rounded-sm border border-line bg-white p-4"
      >
        <div className="flex flex-1 min-w-[180px] flex-col gap-1.5">
          <label htmlFor="q" className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={search ?? ""}
            placeholder="Search by name…"
            className="rounded-sm border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-sage/35"
          />
        </div>
        <div className="flex min-w-[160px] flex-col gap-1.5">
          <label htmlFor="category" className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={categoryId ?? ""}
            className="rounded-sm border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-sage/35"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-[140px] flex-col gap-1.5">
          <label htmlFor="status" className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="rounded-sm border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-sage/35"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
        >
          Filter
        </button>
        {(search || categoryId || status !== "all") && (
          <Link href="/admin/products" className="text-sm font-medium text-muted transition-colors hover:text-forest">
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <p className="rounded-sm border border-dashed border-line bg-white/60 p-6 text-sm text-muted">
          {count === 0 && !search && !categoryId && status === "all"
            ? "No products yet — add the first one above."
            : "No products match these filters."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Sort</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-line/60 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-text">{p.name}</p>
                    <p className="text-xs text-muted">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.categories?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-text">Rs {Number(p.price).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <form action={toggleProductActiveAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="nextActive" value={(!p.is_active).toString()} />
                      <button
                        type="submit"
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                          p.is_active
                            ? "border-sage/30 bg-sage/10 text-botanical hover:border-sage/50"
                            : "border-line text-muted hover:border-forest hover:text-forest"
                        }`}
                      >
                        {p.is_active ? "Active" : "Inactive"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleProductFeaturedAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="nextFeatured" value={(!p.is_featured).toString()} />
                      <button
                        type="submit"
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                          p.is_featured
                            ? "border-gold/40 bg-gold/10 text-gold hover:border-gold/60"
                            : "border-line text-muted hover:border-forest hover:text-forest"
                        }`}
                      >
                        {p.is_featured ? "Featured" : "—"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        aria-label="Edit product"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-forest transition-colors hover:bg-cream"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </Link>
                      <DeleteProductButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link
            href={`/admin/products${buildQuery({ ...baseParams, page: String(page - 1) })}`}
            aria-disabled={page <= 1}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition-colors hover:bg-cream ${
              page <= 1 ? "pointer-events-none opacity-30" : ""
            }`}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <span className="text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/admin/products${buildQuery({ ...baseParams, page: String(page + 1) })}`}
            aria-disabled={page >= totalPages}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition-colors hover:bg-cream ${
              page >= totalPages ? "pointer-events-none opacity-30" : ""
            }`}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
      )}
    </div>
  );
}
