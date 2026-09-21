import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff, Flag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pill, VerifiedBadge } from "@/components/site/badges";
import { formatMoney } from "@/lib/geo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/admin/listings")({
  component: AdminListings,
});

function AdminListings() {
  const { materials, getIndustry, setMaterialStatus } = useApp();

  return (
    <div className="p-6 lg:p-8">
      <span className="label-caps text-primary">Moderation</span>
      <h1 className="mt-1 text-3xl font-bold text-foreground">Material Listings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Flag or hide listings that break platform rules. Hidden listings disappear from the
        marketplace.
      </p>

      <div className="mt-6 space-y-3">
        {materials.map((material) => {
          const seller = getIndustry(material.sellerId);
          return (
            <div
              key={material.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <img
                src={material.image}
                alt={material.name}
                loading="lazy"
                className="h-16 w-20 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">{material.name}</p>
                  <Pill tone="primary">{material.category}</Pill>
                  <Pill
                    tone={
                      material.status === "Active"
                        ? "success"
                        : material.status === "Flagged"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {material.status}
                  </Pill>
                </div>
                <p className="text-sm text-muted-foreground">
                  {seller?.name} &middot; {material.city} &middot;{" "}
                  {material.quantity.toLocaleString("en-IN")} {material.unit} &middot;{" "}
                  {formatMoney(material.pricePerUnit)}/{material.unit}
                </p>
                {seller && (
                  <div className="mt-1">
                    <VerifiedBadge status={seller.verification} />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/material/$materialId" params={{ materialId: material.id }}>
                    <Eye className="mr-1.5 h-4 w-4" /> View
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMaterialStatus(material.id, "Flagged");
                    toast("Listing flagged for review");
                  }}
                >
                  <Flag className="mr-1.5 h-4 w-4" /> Flag
                </Button>
                {material.status === "Hidden" ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      setMaterialStatus(material.id, "Active");
                      toast.success("Listing restored");
                    }}
                  >
                    Restore
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setMaterialStatus(material.id, "Hidden");
                      toast("Listing hidden from marketplace");
                    }}
                  >
                    <EyeOff className="mr-1.5 h-4 w-4" /> Hide
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
