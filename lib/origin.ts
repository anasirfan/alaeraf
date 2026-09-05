import "server-only";
import { headers } from "next/headers";
import { site } from "@/lib/site";

/**
 * Resolves the current request's origin (e.g. https://www.al-aeraf.com, or
 * http://localhost:3000 in dev) for building Supabase email redirect URLs
 * (signup confirmation, password reset). Falls back to the canonical site
 * URL if the request headers are ever unavailable.
 */
export async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : site.url;
}
