"use client";

/**
 * Loads the Google Maps JavaScript API (with the Places library) exactly
 * once per page, no matter how many components ask for it — every caller
 * shares the same in-flight/resolved promise instead of injecting the
 * script tag more than once.
 *
 * Resolves to `null` immediately, with no network request and no error,
 * when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY isn't set. This is intentional:
 * address-search/map features built on top of this (see
 * components/address/AddressAutocomplete.tsx) are an enhancement over the
 * existing manual "Latitude/Longitude + Use my current location" fields,
 * never a replacement — until a key is configured (Google Cloud Console →
 * enable "Places API" and "Maps JavaScript API" → create + restrict an API
 * key → set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local and in Vercel),
 * every address form simply falls back to the fields that already work
 * today, exactly as they did before this file existed.
 */
export function loadGoogleMaps(): Promise<typeof google | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return Promise.resolve(null);

  if (typeof window === "undefined") return Promise.resolve(null);

  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (!loadGoogleMapsPromise) {
    loadGoogleMapsPromise = new Promise((resolve, reject) => {
      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener("load", () => resolve(window.google));
        existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps")));
        return;
      }

      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => reject(new Error("Failed to load Google Maps"));
      document.head.appendChild(script);
    });
  }

  return loadGoogleMapsPromise.catch(() => null);
}

const SCRIPT_ID = "google-maps-script";
let loadGoogleMapsPromise: Promise<typeof google> | null = null;
