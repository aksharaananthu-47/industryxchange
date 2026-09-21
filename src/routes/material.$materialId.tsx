import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  FileCheck2,
  FileText,
  MapPin,
  Package,
  Recycle,
  RefreshCw,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pill, VerifiedBadge } from "@/components/site/badges";
import { distanceKm, formatMoney } from "@/lib/geo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/material/$materialId")({
  head: () => ({
    meta: [
      { title: "Material Details | Industrial Waste Exchange" },
      {
        name: "description",
        content:
          "Full material specification, certifications, seller verification and location, with material request and negotiation.",
      },
      { property: "og:title", content: "Material Details | Industrial Waste Exchange" },
      {
        property: "og:description",
        content: "Material specification, certifications and verified seller details.",
      },
    ],
  }),
  component: MaterialDetail,
});

function MaterialDetail() {
  const { materialId } = Route.useParams();
  const navigate = useNavigate();
  const { getMaterial, getIndustry, currentIndustry, createRequest, transactions, session } =
    useApp();

  const material = getMaterial(materialId);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [requirements, setRequirements] = useState("");

  if (!material) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Material not found</h1>
        <Link to="/buy" className="mt-4 inline-block font-semibold text-primary hover:underline">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const seller = getIndustry(material.sellerId);
  const distance = currentIndustry ? distanceKm(currentIndustry, material) : undefined;
  const isOwnListing = currentIndustry?.id === material.sellerId;
  const canRequest =
    session.kind === "industry" && currentIndustry?.verification === "verified" && !isOwnListing;

  const sellerReviews = transactions.filter(
    (t) => t.sellerId === material.sellerId && t.review,
  );

  const submit = () => {
    const qty = Number(quantity);
    if (!qty || qty < material.minOrder) {
      toast.error(`Minimum order is ${material.minOrder} ${material.unit}`);
      return;
    }
    const id = createRequest({
      materialId: material.id,
      quantity: qty,
      price: Number(price) || material.pricePerUnit,
      ...(requirements ? { requirements } : {}),
    });
    setOpen(false);
    toast.success(`Request ${id} sent to ${seller?.name}`);
    navigate({ to: "/transactions" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        to="/buy"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Buy Materials
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <img
              src={material.image}
              alt={material.name}
              width={944}
              height={704}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="primary">{material.category}</Pill>
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
              <Pill>{material.priceType} price</Pill>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-foreground">{material.name}</h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {material.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="label-caps mb-3 text-muted-foreground">Specifications</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Condition</dt>
                  <dd className="font-medium text-foreground">{material.condition}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Quantity available</dt>
                  <dd className="font-medium text-foreground">
                    {material.quantity.toLocaleString("en-IN")} {material.unit}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Minimum order</dt>
                  <dd className="font-medium text-foreground">
                    {material.minOrder} {material.unit}
                  </dd>
                </div>
                {material.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{spec.label}</dt>
                    <dd className="font-medium text-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <p className="label-caps mb-3 text-muted-foreground">
                Certifications & documents
              </p>
              <ul className="space-y-2">
                {material.documents.map((doc) => (
                  <li
                    key={doc.name}
                    className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2"
                  >
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      {doc.status === "Verified" ? (
                        <FileCheck2 className="h-4 w-4 text-success" />
                      ) : (
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      )}
                      {doc.name}
                    </span>
                    <Pill tone={doc.status === "Verified" ? "success" : "muted"}>
                      {doc.status}
                    </Pill>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Documents marked Uploaded have been submitted by the seller but not yet
                confirmed by the platform.
              </p>
            </div>
          </div>

          {sellerReviews.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="label-caps mb-3 text-muted-foreground">Reviews for this seller</p>
              <ul className="space-y-3">
                {sellerReviews.map((t) => (
                  <li key={t.id} className="rounded-lg bg-secondary p-3">
                    <div className="flex items-center gap-1 text-warning">
                      {Array.from({ length: t.rating ?? 0 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-foreground">{t.review}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <p className="label-caps text-muted-foreground">Price</p>
            <p className="mt-1 font-display text-3xl font-bold text-primary">
              {formatMoney(material.pricePerUnit)}
              <span className="text-base font-medium text-muted-foreground">
                {" "}
                / {material.unit}
              </span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {material.priceType === "Negotiable"
                ? "Seller accepts price negotiation"
                : "Fixed price listing"}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
              <Package className="h-4 w-4 text-primary" />
              {material.quantity.toLocaleString("en-IN")} {material.unit} in stock &middot; min{" "}
              {material.minOrder} {material.unit}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full font-display tracking-wide" disabled={!canRequest}>
                  REQUEST MATERIAL
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request material</DialogTitle>
                  <DialogDescription>
                    {material.name} from {seller?.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="qty">Quantity needed ({material.unit})</Label>
                    <Input
                      id="qty"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder={`Minimum ${material.minOrder}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="offer">Price proposed (per {material.unit})</Label>
                    <Input
                      id="offer"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={String(material.pricePerUnit)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="req">Custom requirements</Label>
                    <Textarea
                      id="req"
                      rows={3}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Packing, test reports, dispatch schedule..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submit}>Send request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {!canRequest && (
              <p className="mt-2 text-xs text-muted-foreground">
                {isOwnListing
                  ? "This is your own listing."
                  : session.kind !== "industry"
                    ? "Sign in as a verified industry to send a request."
                    : "Your industry is pending verification. Requests unlock after admin approval."}
              </p>
            )}
          </div>

          {seller && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <p className="label-caps text-muted-foreground">Seller</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{seller.name}</p>
              <div className="mt-1.5">
                <VerifiedBadge status={seller.verification} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{seller.category}</p>
              {seller.rating > 0 && (
                <p className="mt-1 flex items-center gap-1 text-sm font-medium text-foreground">
                  <Star className="h-4 w-4 fill-warning text-warning" /> {seller.rating} (
                  {seller.reviewCount} reviews)
                </p>
              )}
              <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
                <p className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    {material.address}
                    <br />
                    {material.city}, {material.state} {material.pin}
                    <br />
                    <span className="text-xs">
                      Lat {material.lat.toFixed(4)}, Long {material.lng.toFixed(4)}
                      {distance !== undefined && ` \u00B7 ${distance} km from you`}
                    </span>
                  </span>
                </p>
              </div>
              <Link
                to="/company/$industryId"
                params={{ industryId: seller.id }}
                className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
              >
                View company profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
