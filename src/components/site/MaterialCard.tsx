import { Link } from "@tanstack/react-router";
import { MapPin, Recycle, RefreshCw } from "lucide-react";
import type { Material } from "@/lib/mock-data";
import { formatMoney } from "@/lib/geo";
import { useApp } from "@/lib/store";
import { Pill, VerifiedBadge } from "./badges";

export function MaterialCard({
  material,
  distanceKm,
}: {
  material: Material;
  distanceKm?: number;
}) {
  const { getIndustry } = useApp();
  const seller = getIndustry(material.sellerId);

  return (
    <Link
      to="/material/$materialId"
      params={{ materialId: material.id }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={material.image}
          alt={material.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-ink/85 px-2 py-0.5 text-xs font-semibold text-ink-foreground backdrop-blur">
            {material.category}
          </span>
          {material.priceType === "Negotiable" && (
            <span className="rounded-md bg-card/90 px-2 py-0.5 text-xs font-semibold text-primary backdrop-blur">
              Negotiable
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base leading-snug font-semibold text-foreground">
            {material.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {material.quantity.toLocaleString("en-IN")} {material.unit} available
          </p>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="font-display text-xl font-bold text-primary">
            {formatMoney(material.pricePerUnit)}
          </span>
          <span className="text-sm text-muted-foreground">/ {material.unit}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {material.reusable && (
            <Pill tone="primary">
              <RefreshCw className="mr-1 h-3 w-3" /> Reusable
            </Pill>
          )}
          {material.recyclable && (
            <Pill tone="success">
              <Recycle className="mr-1 h-3 w-3" /> Recyclable
            </Pill>
          )}
        </div>

        <div className="mt-auto space-y-2 border-t border-border pt-3">
          <p className="text-sm font-medium text-foreground">{seller?.name}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {material.city}, {material.state}
              {distanceKm !== undefined && ` \u00B7 ${distanceKm} km`}
            </span>
            {seller && <VerifiedBadge status={seller.verification} />}
          </div>
        </div>
      </div>
    </Link>
  );
}
