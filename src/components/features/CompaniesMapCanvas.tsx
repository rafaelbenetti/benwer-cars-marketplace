"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useLocale, useTranslations } from "next-intl";
import { CompanyMapPinCard } from "./CompanyMapPinCard";
import {
  MALAGA_PROVINCE_BOUNDS,
  MALAGA_PROVINCE_CENTER,
  getCityCoordinates,
} from "@/data/malagaCityCoordinates";
import { getCityDisplayName } from "@/data/malagaCities";
import type { CompanyMapPin } from "@/lib/companyMap";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

const CAR_PIN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>';

const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

interface CompaniesMapCanvasProps {
  pins: CompanyMapPin[];
  selectedSlug: string | null;
  highlightedSlug: string | null;
  locationSlug: string | null;
  onSelect: (slug: string) => void;
  onClose: () => void;
}

function createPinIcon(selected: boolean, highlighted: boolean): L.DivIcon {
  return L.divIcon({
    className: cn(
      "marketplace-map-pin",
      selected && "is-selected",
      highlighted && !selected && "is-highlighted",
    ),
    html: `<span class="marketplace-map-pin-dot">${CAR_PIN_SVG}</span>`,
    iconSize: [36, 44],
    iconAnchor: [18, 42],
    popupAnchor: [0, -36],
  });
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function FitPins({
  pins,
  locationSlug,
}: {
  pins: CompanyMapPin[];
  locationSlug: string | null;
}) {
  const map = useMap();
  const pinKey = pins.map((pin) => pin.slug).join("|");
  const city = locationSlug ? getCityCoordinates(locationSlug) : null;

  useEffect(() => {
    const animate = !prefersReducedMotion();

    if (pins.length > 0) {
      const bounds = L.latLngBounds(pins.map((pin) => [pin.lat, pin.lng]));
      map.fitBounds(bounds, { padding: [56, 56], maxZoom: 12, animate });
      return;
    }

    if (city) {
      map.setView([city.lat, city.lng], 11, { animate });
      return;
    }

    map.setView([MALAGA_PROVINCE_CENTER.lat, MALAGA_PROVINCE_CENTER.lng], 8, {
      animate,
    });
  }, [city, map, pinKey, pins]);

  return null;
}

function FocusSelectedPin({ pin }: { pin: CompanyMapPin | null }) {
  const map = useMap();

  useEffect(() => {
    if (!pin) {
      return;
    }

    map.panTo([pin.lat, pin.lng], { animate: !prefersReducedMotion() });
  }, [map, pin]);

  return null;
}

function MapClickDeselect({ onClose }: { onClose: () => void }) {
  useMapEvents({
    click: () => onClose(),
  });
  return null;
}

function InvalidateSize() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(container);
    const timeoutId = window.setTimeout(() => map.invalidateSize(), 80);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [map]);

  return null;
}

function CompanyMarker({
  pin,
  selected,
  highlighted,
  locale,
  onSelect,
  onClose,
}: {
  pin: CompanyMapPin;
  selected: boolean;
  highlighted: boolean;
  locale: string;
  onSelect: (slug: string) => void;
  onClose: () => void;
}) {
  const t = useTranslations("map");
  const markerRef = useRef<L.Marker | null>(null);
  const cityName = getCityDisplayName(pin.city, locale);
  const icon = useMemo(
    () => createPinIcon(selected, highlighted),
    [highlighted, selected],
  );

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) {
      return;
    }

    if (selected) {
      marker.openPopup();
    } else {
      marker.closePopup();
    }
  }, [selected]);

  return (
    <Marker
      ref={markerRef}
      position={[pin.lat, pin.lng]}
      icon={icon}
      title={t("pinAria", { name: pin.name, city: cityName })}
      alt={t("pinAria", { name: pin.name, city: cityName })}
      eventHandlers={{
        click: () => onSelect(pin.slug),
      }}
    >
      <Popup
        autoPan
        closeButton={false}
        className="marketplace-map-popup"
        eventHandlers={{
          remove: () => {
            if (selected) {
              onClose();
            }
          },
        }}
      >
        <CompanyMapPinCard pin={pin} locale={locale} onClose={onClose} />
      </Popup>
    </Marker>
  );
}

export function CompaniesMapCanvas({
  pins,
  selectedSlug,
  highlightedSlug,
  locationSlug,
  onSelect,
  onClose,
}: CompaniesMapCanvasProps) {
  const t = useTranslations("map");
  const locale = useLocale();
  const selectedPin = pins.find((pin) => pin.slug === selectedSlug) ?? null;
  const tileUrl =
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? DARK_TILES
      : LIGHT_TILES;

  return (
    <MapContainer
      center={[MALAGA_PROVINCE_CENTER.lat, MALAGA_PROVINCE_CENTER.lng]}
      zoom={8}
      minZoom={7}
      maxZoom={14}
      maxBounds={MALAGA_PROVINCE_BOUNDS}
      maxBoundsViscosity={0.85}
      scrollWheelZoom
      className="marketplace-map h-full w-full"
      aria-label={t("regionAria")}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={tileUrl}
      />
      <InvalidateSize />
      <FitPins pins={pins} locationSlug={locationSlug} />
      <FocusSelectedPin pin={selectedPin} />
      <MapClickDeselect onClose={onClose} />
      {pins.map((pin) => (
        <CompanyMarker
          key={pin.slug}
          pin={pin}
          selected={pin.slug === selectedSlug}
          highlighted={pin.slug === highlightedSlug}
          locale={locale}
          onSelect={onSelect}
          onClose={onClose}
        />
      ))}
    </MapContainer>
  );
}

export default CompaniesMapCanvas;
