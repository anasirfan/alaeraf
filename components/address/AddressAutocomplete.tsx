"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { loadGoogleMaps } from "@/lib/google-maps/loadGoogleMaps";

// Karachi — used only as the default map view/search bias before anything
// has been picked. Never used as a fallback location for an actual address.
const KARACHI_CENTER = { lat: 24.8607, lng: 67.0011 };

/**
 * Pulls a friendly "Area" guess out of a Places result's address_components
 * — the most specific neighbourhood-level component available, since a
 * full formatted_address is too long/duplicative for the separate
 * "Area" field this feeds into.
 */
function guessArea(components: google.maps.GeocoderAddressComponent[] | undefined): string {
  if (!components) return "";
  const byType = (type: string) => components.find((c) => c.types.includes(type))?.long_name;
  return (
    byType("sublocality_level_1") ??
    byType("sublocality") ??
    byType("neighborhood") ??
    byType("locality") ??
    ""
  );
}

/**
 * Google Places search box + a small confirmation map, layered on top of
 * the existing manual "Latitude / Longitude / Use my current location"
 * fields in AddressForm.tsx — never a replacement for them. Renders
 * nothing at all when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY isn't configured
 * (loadGoogleMaps() resolves null), so the address form works exactly as
 * it always has until a key is added.
 *
 * Flow: type an area/street → pick a suggestion from Google's own dropdown
 * → the map recentres with a pin on that spot and Latitude/Longitude/
 * Address/Area are filled in automatically. The pin can then be dragged to
 * fine-tune the exact spot without retyping anything.
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
  const inputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");

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
    let cancelled = false;

    loadGoogleMaps().then((g) => {
      if (cancelled) return;
      if (!g || !inputRef.current || !mapContainerRef.current) {
        setStatus("unavailable");
        return;
      }

      const initialCenter =
        lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))
          ? { lat: Number(lat), lng: Number(lng) }
          : KARACHI_CENTER;

      const map = new g.maps.Map(mapContainerRef.current, {
        center: initialCenter,
        zoom: lat && lng ? 15 : 12,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
      });
      mapRef.current = map;

      function placeMarker(position: google.maps.LatLngLiteral) {
        if (markerRef.current) {
          markerRef.current.setPosition(position);
          return;
        }
        const marker = new g!.maps.Marker({
          map,
          position,
          draggable: true,
        });
        marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          if (pos) onLocationChangeRef.current(pos.lat().toFixed(6), pos.lng().toFixed(6));
        });
        markerRef.current = marker;
      }

      if (lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))) {
        placeMarker({ lat: Number(lat), lng: Number(lng) });
      }

      const autocomplete = new g.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "pk" },
        fields: ["geometry", "formatted_address", "address_components", "name"],
      });
      // Bias suggestions toward Karachi without hard-restricting to it —
      // Al Aeraf may serve other cities later.
      autocomplete.setBounds(
        new g.maps.LatLngBounds({ lat: 24.72, lng: 66.83 }, { lat: 25.05, lng: 67.25 }),
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const location = place.geometry?.location;
        if (!location) return; // Enter pressed before a suggestion was picked — nothing to do.

        const newLat = location.lat().toFixed(6);
        const newLng = location.lng().toFixed(6);
        onLocationChangeRef.current(newLat, newLng);
        onAddressGuessRef.current(
          place.formatted_address ?? place.name ?? "",
          guessArea(place.address_components),
        );

        map.panTo(location);
        map.setZoom(16);
        placeMarker({ lat: location.lat(), lng: location.lng() });
      });

      setStatus("ready");
    });

    return () => {
      cancelled = true;
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
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted/60" strokeWidth={1.75} />
        <input
          ref={inputRef}
          type="text"
          placeholder={status === "loading" ? "Loading map…" : "Start typing a street, area or landmark…"}
          disabled={status === "loading"}
          className="w-full rounded-sm border border-line bg-white py-2.5 pr-3 pl-9 text-sm text-ink-text placeholder:text-muted/60 focus:border-forest focus:ring-1 focus:ring-forest/30 focus:outline-none disabled:opacity-60"
        />
      </div>
      <div
        ref={mapContainerRef}
        className="mt-2 h-48 w-full overflow-hidden rounded-sm border border-line bg-cream"
        aria-hidden={status !== "ready"}
      />
      {status === "ready" && (
        <p className="mt-1.5 text-[0.7rem] text-muted">
          Pick a suggestion to drop the pin, or drag the pin to fine-tune the exact spot.
        </p>
      )}
    </div>
  );
}
