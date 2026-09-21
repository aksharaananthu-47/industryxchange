import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { List, Map as MapIcon, Search, SlidersHorizontal } from "lucide-react";
import { MaterialCard } from "@/components/site/MaterialCard";
import { MapPanel } from "@/components/site/MapPanel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CATEGORIES, type Category } from "@/lib/mock-data";
import { DISTANCE_OPTIONS, distanceKm, formatMoney } from "@/lib/geo";
import { useApp } from "@/lib/store";

type BuySearch = { category?: Category | undefined };

export const Route = createFileRoute("/buy")({
  validateSearch: (search: Record<string, unknown>): BuySearch => ({
    category: CATEGORIES.includes(search["category"] as Category)
      ? (search["category"] as Category)
      : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Buy Materials | Industrial Waste Exchange" },
      {
        name: "description",
        content:
          "Search verified industrial material listings by category, distance, quantity and price. Switch between list and map view.",
      },
      { property: "og:title", content: "Buy Materials | Industrial Waste Exchange" },
      {
        property: "og:description",
        content: "Search verified industrial material listings by category, distance and price.",
      },
    ],
  }),
  component: BuyMaterials,
});

function BuyMaterials() {
  const { category: initialCategory } = Route.useSearch();
  const { materials, getIndustry, currentIndustry } = useApp();

  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [minQuantity, setMinQuantity] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [reusableOnly, setReusableOnly] = useState(false);
  const [recyclableOnly, setRecyclableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [view, setView] = useState<"list" | "map">("list");

  const origin = currentIndustry ?? undefined;

  const results = useMemo(() => {
    return materials
      .filter((m) => m.status === "Active")
      .map((m) => ({
        material: m,
        distance: origin ? distanceKm(origin, m) : undefined,
      }))
      .filter(({ material, distance }) => {
        const seller = getIndustry(material.sellerId);
        if (query) {
          const q = query.toLowerCase();
          const hit =
            material.name.toLowerCase().includes(q) ||
            material.category.toLowerCase().includes(q) ||
            material.city.toLowerCase().includes(q) ||
            (seller?.name.toLowerCase().includes(q) ?? false);
          if (!hit) return false;
        }
        if (categories.length > 0 && !categories.includes(material.category)) return false;
        if (maxDistance !== null && distance !== undefined && distance > maxDistance) return false;
        if (minQuantity && material.quantity < Number(minQuantity)) return false;
        if (material.pricePerUnit > maxPrice) return false;
        if (reusableOnly && !material.reusable) return false;
        if (recyclableOnly && !material.recyclable) return false;
        if (verifiedOnly && seller?.verification !== "verified") return false;
        return true;
      })
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [
    materials,
    origin,
    query,
    categories,
    maxDistance,
    minQuantity,
    maxPrice,
    reusableOnly,
    recyclableOnly,
    verifiedOnly,
    getIndustry,
  ]);

  const toggleCategory = (category: Category) =>
    setCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );

  const reset = () => {
    setQuery("");
    setCategories([]);
    setMaxDistance(null);
    setMinQuantity("");
    setMaxPrice(20000);
    setReusableOnly(false);
    setRecyclableOnly(false);
    setVerifiedOnly(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="label-caps text-primary">Marketplace</span>
          <h1 className="mt-1 text-3xl font-bold text-foreground">Buy Materials</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {results.length} listing{results.length === 1 ? "" : "s"} from verified industries
            {origin ? ` near ${origin.city}` : ""}.
          </p>
        </div>

        <div className="inline-flex rounded-md border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-semibold ${
              view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <List className="h-4 w-4" /> List view
          </button>
          <button
            type="button"
            onClick={() => setView("map")}
            className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-semibold ${
              view === "map" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <MapIcon className="h-4 w-4" /> Map view
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className="h-fit space-y-6 rounded-xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 font-display text-sm font-bold text-foreground">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </span>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Reset
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search material or company"
              className="pl-9"
            />
          </div>

          <div>
            <p className="label-caps mb-2 text-muted-foreground">Category</p>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <label key={category} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="label-caps mb-2 text-muted-foreground">Distance from my plant</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMaxDistance(null)}
                className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                  maxDistance === null
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input text-muted-foreground"
                }`}
              >
                Any
              </button>
              {DISTANCE_OPTIONS.map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => setMaxDistance(km)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                    maxDistance === km
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input text-muted-foreground"
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minQty" className="label-caps text-muted-foreground">
              Minimum quantity available
            </Label>
            <Input
              id="minQty"
              type="number"
              min={0}
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              placeholder="e.g. 1000"
            />
          </div>

          <div className="space-y-3">
            <p className="label-caps text-muted-foreground">
              Max price per unit &middot; {formatMoney(maxPrice)}
            </p>
            <Slider
              value={[maxPrice]}
              min={50}
              max={20000}
              step={50}
              onValueChange={(v) => setMaxPrice(v[0] ?? 20000)}
            />
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={reusableOnly}
                onCheckedChange={(v) => setReusableOnly(Boolean(v))}
              />
              Reusable only
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={recyclableOnly}
                onCheckedChange={(v) => setRecyclableOnly(Boolean(v))}
              />
              Recyclable only
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={verifiedOnly}
                onCheckedChange={(v) => setVerifiedOnly(Boolean(v))}
              />
              Verified industries only
            </label>
          </div>
        </aside>

        {/* Results */}
        <div>
          {view === "map" ? (
            <MapPanel points={results} />
          ) : results.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <p className="font-semibold text-foreground">No materials match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try widening the distance or clearing a category.
              </p>
              <Button onClick={reset} className="mt-4">
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map(({ material, distance }) => (
                <MaterialCard key={material.id} material={material} distanceKm={distance} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
