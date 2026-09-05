"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "leaflet/dist/leaflet.css";
import type { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

// Karachi — used only as the default map view/search bias before anything
// has been picked. Never used as a fallback location for an actual address.
const KARACHI_CENTER: [number, number] = [24.8607, 67.0011];

/** The bit of a Geoapify autocomplete "select" result this component uses. */
type GeoapifyFeature = {
  properties?: {
    lat?: number;
    lon?: number;
    formatted?: string;
    address_line1?: string;
    suburb?: string;
    district?: string;
    city?: string;
  };
};

// A simple pin drawn as inline SVG rather than Leaflet's default marker
// image — the default relies on relative asset paths that don't survive
// bundling under Next.js without extra config, so a self-contained divIcon
// sidesteps that entirely.
const PIN_SVG = `
  <svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 22 14 22s14-11.5 14-22c0-7.7-6.3-14-14-14z" fill="#14361f"/>
    <circle cx="14" cy="14" r="5.5" fill="#fbfaf6"/>
  </svg>
`;

/**
 * Geoapify address search box + a small confirmation map, layered on top of
 * the existing manual "Latitude / Longitude / Use my current location"
 * fields in AddressForm.tsx — never a replacement for them. Renders
 * nothing at all when NEXT_PUBLIC_GEOAPIFY_API_KEY isn't configured, so the
 * address form works exactly as it always has until a key is added.
 *
 * Flow: type an area/street → pick a suggestion from Geoapify's own
 * dropdown → the map recentres with a pin on that spot and Latitude/
 * Longitude/Address/Area are filled in automatically. The pin can then be
 * dragged to fine-tune the exact spot without retyping anything.
 *
 * Both libraries are loaded via dynamic import() inside the effect, purely
 * client-side — Leaflet touches `window` at module-load time and breaks
 * Next.js's server render pass for a client component if imported at the
 * top of the file the normal way.
 */
export function AddressAutocomplete({
  lat,
  lng,
  onLocationChange,
  onAddressGuess,
}: {
  lat: string;
  lng: string;
  onLocationChange: (lat: string, lng: string) => void;
  onAddressGuess: (addressLine: string, area: string) => void;
}) {
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const autocompleteRef = useRef<GeocoderAutocomplete | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  // True only while a suggestions request is actually in flight (Geoapify's
  // own request_start/request_end events, debounced internally) — distinct
  // from `status`, which just tracks whether the widget itself has loaded.
  const [searching, setSearching] = useState(false);

  // onLocationChange/onAddressGuess are recreated every render by the
  // parent form (they close over its state setters) — refs keep this
  // effect's dependency array to only what should actually re-run setup.
  const onLocationChangeRef = useRef(onLocationChange);
  const onAddressGuessRef = useRef(onAddressGuess);
  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
    onAddressGuessRef.current = onAddressGuess;
  });

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    if (!apiKey || !inputContainerRef.current || !mapContainerRef.current) {
      setStatus("unavailable");
      return;
    }

    let cancelled = false;

    Promise.all([import("@geoapify/geocoder-autocomplete"), import("leaflet")])
      .then(([{ GeocoderAutocomplete }, L]) => {
        if (cancelled || !inputContainerRef.current || !mapContainerRef.current) return;

        const hasInitialLocation = Boolean(lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng)));
        const initialCenter: [number, number] = hasInitialLocation
          ? [Number(lat), Number(lng)]
          : KARACHI_CENTER;

        const map = L.map(mapContainerRef.current).setView(initialCenter, hasInitialLocation ? 15 : 11);
        L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`, {
          attribution:
            'Powered by <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Geoapify</a> | © OpenStreetMap contributors',
          maxZoom: 20,
        }).addTo(map);
        mapRef.current = map;

        const pinIcon = L.divIcon({
          html: PIN_SVG,
          className: "", // suppress Leaflet's default marker box/shadow styling
          iconSize: [28, 36],
          iconAnchor: [14, 36],
        });

        function placeMarker(position: [number, number]) {
          if (markerRef.current) {
            markerRef.current.setLatLng(position);
            return;
          }
          const marker = L.marker(position, { icon: pinIcon, draggable: true }).addTo(map);
          marker.on("dragend", () => {
            const pos = marker.getLatLng();
            onLocationChangeRef.current(pos.lat.toFixed(6), pos.lng.toFixed(6));
          });
          markerRef.current = marker;
        }

        if (hasInitialLocation) placeMarker(initialCenter);

        const autocomplete = new GeocoderAutocomplete(inputContainerRef.current, apiKey, {
          countryCodes: ["pk"],
          position: { lat: KARACHI_CENTER[0], lon: KARACHI_CENTER[1] },
          placeholder: "Start typing a street, area or landmark…",
        });
        autocompleteRef.current = autocomplete;

        autocomplete.on("request_start", () => setSearching(true));
        autocomplete.on("request_end", () => setSearching(false));

        autocomplete.on("select", (feature: GeoapifyFeature | null) => {
          const props = feature?.properties;
          if (props?.lat == null || props?.lon == null) return; // Closed with nothing picked.

          const newLat = props.lat.toFixed(6);
          const newLng = props.lon.toFixed(6);
          onLocationChangeRef.current(newLat, newLng);
          onAddressGuessRef.current(
            props.address_line1 ?? props.formatted ?? "",
            props.suburb ?? props.district ?? props.city ?? "",
          );

          const position: [number, number] = [props.lat, props.lon];
          map.setView(position, 16);
          placeMarker(position);
        });

        setStatus("ready");
      })
      .catch(() => setStatus("unavailable"));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
      autocompleteRef.current = null;
    };
    // Intentionally run once — re-running on every lat/lng change would
    // rebuild the map and drop the user's in-progress search.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "unavailable") return null;

  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-[0.7rem] font-semibold tracking-[0.08em] text-muted uppercase">
        Search your address
      </label>
      <div className="relative z-10 min-h-[42px]">
        <div ref={inputContainerRef} className={status === "loading" ? "invisible" : ""} />
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center gap-2 rounded-sm border border-line bg-white px-3 text-sm text-muted/60">
            <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            Loading address search…
          </div>
        )}
        {status === "ready" && searching && (
          <Loader2
            className="pointer-events-none absolute top-1/2 right-9 h-4 w-4 -translate-y-1/2 animate-spin text-muted/70"
            strokeWidth={2}
            aria-label="Searching…"
          />
        )}
      </div>
      {/*
        z-10/z-0 (not just DOM order) is what actually keeps the dropdown
        above the map: Leaflet's own panes use z-index up to 700 internally,
        which — without the map container establishing its own stacking
        context here — would otherwise render on top of Geoapify's
        suggestion list (z-index: 99) regardless of which element comes
        first in the markup.
      */}
      <div
        ref={mapContainerRef}
        className="relative z-0 mt-2 h-48 w-full overflow-hidden rounded-sm border border-line bg-cream"
      />
      {status === "ready" && (
        <p className="mt-1.5 text-[0.7rem] text-muted">
          Pick a suggestion to drop the pin, or drag the pin to fine-tune the exact spot.
        </p>
      )}
    </div>
  );
}
