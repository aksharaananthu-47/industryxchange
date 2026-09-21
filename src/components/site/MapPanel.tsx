import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Navigation } from "lucide-react";
import type { Material } from "@/lib/mock-data";
import { formatMoney } from "@/lib/geo";
import { useApp } from "@/lib/store";
import { VerifiedBadge } from "./badges";

type Point = { material: Material; distance?: number };

/**
 * Lightweight interactive location map. Markers are plotted from real
 * latitude / longitude values onto a normalised coordinate plane.
 */
export function MapPanel({ points }: { points: Point[] }) {
  const { getIndustry } = useApp();
  const [activeId, setActiveId] = useState<string | null>(points[0]?.material.id ?? null);

  if (points.length === 0) {
    return (
      <div className="flex h-[520px] items-center justify-center rounded-xl border border-border bg-card text-sm text-muted-foreground">
        No material locations match your filters.
      </div>
    );
  }

  const lats = points.map((p) => p.material.lat);
  const lngs = points.map((p) => p.material.lng);
  const minLat = Math.min(...lats) - 0.6;
  const maxLat = Math.max(...lats) + 0.6;
  const minLng = Math.min(...lngs) - 0.6;
  const maxLng = Math.max(...lngs) + 0.6;

  const pos = (m: Material) => ({
    left: `${((m.lng - minLng) / (maxLng - minLng)) * 100}%`,
    top: `${(1 - (m.lat - minLat) / (maxLat - minLat)) * 100}%`,
  });

  const active = points.find((p) => p.material.id === activeId);
  const activeSeller = active ? getIndustry(active.material.sellerId) : undefined;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary px-4 py-2.5">
        <span className="label-caps text-muted-foreground">Material Location Map</span>
        <span className="text-xs text-muted-foreground">
          {points.length} location{points.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="relative h-[420px] w-full bg-[oklch(0.94_0.012_235)]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.88 0.02 235) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.88 0.02 235) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-x-0 top-1/3 h-24 -rotate-6 bg-[oklch(0.9_0.03_150)]/60 blur-xl" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[oklch(0.86_0.04_235)]/70 blur-lg" />

        {points.map(({ material, distance }) => {
          const isActive = material.id === activeId;
          return (
            <button
              key={material.id}
              type="button"
              onClick={() => setActiveId(material.id)}
              style={pos(material)}
              className="absolute -translate-x-1/2 -translate-y-full focus:outline-none"
              aria-label={material.name}
            >
              <span
                className={
                  isActive
                    ? "flex flex-col items-center text-primary"
                    : "flex flex-col items-center text-ink/70 hover:text-primary"
                }
              >
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-semibold shadow-card ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground"
                  }`}
                >
                  {formatMoney(material.pricePerUnit)}
                  {distance !== undefined && ` \u00B7 ${distance}km`}
                </span>
                <MapPin
                  className={isActive ? "h-7 w-7 fill-primary/25" : "h-6 w-6 fill-card"}
                />
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center">
          <img
            src={active.material.image}
            alt={active.material.name}
            loading="lazy"
            className="h-20 w-28 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-foreground">{activeSeller?.name}</p>
              {activeSeller && <VerifiedBadge status={activeSeller.verification} />}
            </div>
            <p className="text-sm text-foreground">{active.material.name}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Navigation className="h-3.5 w-3.5" />
              {active.material.city}, {active.material.state} {active.material.pin}
              {active.distance !== undefined && ` \u00B7 ${active.distance} km away`}
            </p>
            <p className="mt-1 text-sm font-semibold text-primary">
              {formatMoney(active.material.pricePerUnit)} / {active.material.unit}
            </p>
          </div>
          <Link
            to="/material/$materialId"
            params={{ materialId: active.material.id }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
          >
            View Material
          </Link>
        </div>
      )}
    </div>
  );
}
