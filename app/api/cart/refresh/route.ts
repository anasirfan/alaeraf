import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export const runtime = "nodejs";

/**
 * Re-checks a guest cart's line items against the live catalog before the
 * /cart page renders quantities/prices. Uses the same cookie-free public
 * client as /hair-oil and /ro-water — same anon key, same RLS, so a product
 * that's been deactivated since it was added simply won't come back here
 * (the `products_public_read_active` policy only returns active rows) and
 * the cart page treats a missing id as "no longer available".
 *
 * This does NOT re-implement checkout pricing — it only refreshes what the
 * cart *displays*. Order creation, when built, must independently re-fetch
 * and re-validate every product server-side rather than trusting this
 * response or anything the client sends.
 */
export async function POST(request: Request) {
  let ids: unknown;
  try {
    const body = await request.json();
    ids = body?.ids;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!Array.isArray(ids) || ids.length === 0 || !ids.every((id) => typeof id === "string")) {
    return NextResponse.json({ error: "Expected a non-empty array of product ids." }, { status: 400 });
  }

  // Cheap guard against an unbounded IN() list — a guest cart has no
  // business holding more than a handful of distinct products.
  const safeIds = ids.slice(0, 100);

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, slug, price, compare_at_price, size_label, product_type, stock_status, is_active, product_images(storage_path, alt_text, sort_order)",
      )
      .in("id", safeIds)
      .order("sort_order", { referencedTable: "product_images", ascending: true })
      .limit(1, { referencedTable: "product_images" });

    if (error) throw error;

    return NextResponse.json({ products: data ?? [] });
  } catch {
    // Fail soft: the /cart page keeps showing the last-known snapshot
    // rather than surfacing a raw error to the customer.
    return NextResponse.json({ error: "Couldn't refresh cart." }, { status: 502 });
  }
}
