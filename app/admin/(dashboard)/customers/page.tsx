import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listCustomersForAdmin } from "@/lib/customers/adminCustomers";

export const metadata: Metadata = {
  title: "Customers — Admin",
  robots: { index: false, follow: false },
};

// Reads the authenticated admin session plus per-request search/paging —
// this list can't be static.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function buildQuery(params: Record<string, string | undefined>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) usp.set(key, value);
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.q?.trim() || undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const supabase = await createClient();
  const { rows, count } = await listCustomersForAdmin(supabase, { search, page, pageSize: PAGE_SIZE });

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const baseParams = { q: search };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl text-forest">Customers</h2>
        <p className="mt-1.5 text-sm text-muted">
          {count} registered customer{count === 1 ? "" : "s"}. This lists real signed-up accounts only —
          your own admin account never appears here.
        </p>
      </div>

      <form method="get" className="mb-6 flex flex-wrap items-end gap-3 rounded-sm border border-line bg-white p-4">
        <div className="flex min-w-[240px] flex-1 flex-col gap-1.5">
          <label htmlFor="q" className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={search ?? ""}
            placeholder="Name, phone, or email…"
            className="rounded-sm border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-sage/35"
          />
        </div>
        <button
          type="submit"
          className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
        >
          Search
        </button>
        {search && (
          <Link href="/admin/customers" className="text-sm font-medium text-muted transition-colors hover:text-forest">
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center rounded-sm border border-dashed border-line bg-white/60 px-6 py-16 text-center">
          <Users className="h-8 w-8 text-muted/40" strokeWidth={1.25} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {count === 0 && !search
              ? "No customers have signed up yet — new accounts will show up here as soon as someone registers."
              : "No customers match this search."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-line bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Subscriptions</th>
                <th className="px-4 py-3">Addresses</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((customer) => (
                <tr key={customer.id} className="border-b border-line/60 last:border-0 hover:bg-cream/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="font-medium text-forest underline-offset-2 hover:underline"
                    >
                      {customer.full_name || "Unnamed customer"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink-text">{customer.phone || "—"}</p>
                    <p className="text-xs text-muted">{customer.email || "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-text">{customer.orders?.[0]?.count ?? 0}</td>
                  <td className="px-4 py-3 text-ink-text">{customer.subscriptions?.[0]?.count ?? 0}</td>
                  <td className="px-4 py-3 text-ink-text">{customer.addresses?.[0]?.count ?? 0}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(customer.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link
            href={`/admin/customers${buildQuery({ ...baseParams, page: String(page - 1) })}`}
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
            href={`/admin/customers${buildQuery({ ...baseParams, page: String(page + 1) })}`}
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
