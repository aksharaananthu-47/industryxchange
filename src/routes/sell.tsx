import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ImagePlus, MapPin, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pill, VerifiedBadge } from "@/components/site/badges";
import { CATEGORIES, CONDITIONS, UNITS, type Category, type Unit } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import aluminiumScrap from "@/assets/aluminium-scrap.jpg";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Sell Material | Industrial Waste Exchange" },
      {
        name: "description",
        content:
          "List industrial waste, surplus or recyclable material in five simple steps: details, quantity, documents, pricing and location.",
      },
      { property: "og:title", content: "Sell Material | Industrial Waste Exchange" },
      {
        property: "og:description",
        content: "List your industrial surplus material for verified buyers in five steps.",
      },
    ],
  }),
  component: SellMaterial,
});

const STEPS = ["Material", "Quantity & Quality", "Documents", "Pricing", "Location"];
const DOC_OPTIONS = ["Quality Certificate", "Material Test Report", "Lab Test Report", "Authorisation Copy"];

function SellMaterial() {
  const navigate = useNavigate();
  const { currentIndustry, addMaterial, session } = useApp();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Metal");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<Unit>("kg");
  const [condition, setCondition] = useState<string>(CONDITIONS[0]);
  const [reusable, setReusable] = useState(true);
  const [recyclable, setRecyclable] = useState(true);
  const [specs, setSpecs] = useState("");
  const [docs, setDocs] = useState<string[]>([]);
  const [priceType, setPriceType] = useState<"Fixed" | "Negotiable">("Negotiable");
  const [price, setPrice] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [useCompanyLocation, setUseCompanyLocation] = useState(true);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  if (session.kind !== "industry" || !currentIndustry) {
    return (
      <Gate
        title="Sign in to list material"
        text="Only registered industries can publish a material listing."
      />
    );
  }

  if (currentIndustry.verification !== "verified") {
    return (
      <Gate
        title="Verification pending"
        text="Your industry documents are with the platform admin. Listing unlocks as soon as your industry is approved. Use the Demo switcher to approve yourself instantly."
        industryStatus
      />
    );
  }

  const canNext = () => {
    if (step === 0) return name.trim().length > 2 && description.trim().length > 5;
    if (step === 1) return Number(quantity) > 0;
    if (step === 3) return Number(price) > 0 && Number(minOrder) > 0;
    if (step === 4)
      return useCompanyLocation || (address.trim() && city.trim() && state.trim() && pin.trim());
    return true;
  };

  const publish = () => {
    const loc = useCompanyLocation
      ? {
          address: currentIndustry.address,
          city: currentIndustry.city,
          state: currentIndustry.state,
          pin: currentIndustry.pin,
          lat: currentIndustry.lat,
          lng: currentIndustry.lng,
        }
      : {
          address,
          city,
          state,
          pin,
          lat: currentIndustry.lat + 0.08,
          lng: currentIndustry.lng + 0.08,
        };

    const id = addMaterial({
      name,
      category,
      sellerId: currentIndustry.id,
      image: aluminiumScrap,
      description,
      quantity: Number(quantity),
      unit,
      condition,
      reusable,
      recyclable,
      specs: specs
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [label, ...rest] = line.split(":");
          return { label: (label ?? "Detail").trim(), value: rest.join(":").trim() || "-" };
        }),
      documents: docs.map((d) => ({ name: d, status: "Uploaded" as const })),
      pricePerUnit: Number(price),
      priceType,
      minOrder: Number(minOrder),
      ...loc,
    });
    toast.success("Material published to the marketplace");
    navigate({ to: "/material/$materialId", params: { materialId: id } });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <span className="label-caps text-primary">Sell material</span>
      <h1 className="mt-1 text-3xl font-bold text-foreground">List a material</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Five short steps. Buyers see your verified badge and location on every listing.
      </p>

      {/* Stepper */}
      <ol className="mt-6 flex flex-wrap gap-2">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
              index === step
                ? "border-primary bg-primary text-primary-foreground"
                : index < step
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-xs">
              {index < step ? <Check className="h-3 w-3" /> : index + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
        {step === 0 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Material name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Scrap Copper Wire (Bare Bright)"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Material image</Label>
              <div className="flex items-center gap-3 rounded-lg border border-dashed border-input bg-secondary p-4">
                <ImagePlus className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Upload a clear photo</p>
                  <p className="text-muted-foreground">
                    A sample industrial photo is attached for this demo listing.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Source of the material, packing, sorting, storage conditions..."
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="qty">Quantity</Label>
                <Input
                  id="qty"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 12000"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Condition / quality</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm font-medium">Reusable</span>
                <Switch checked={reusable} onCheckedChange={setReusable} />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm font-medium">Recyclable</span>
                <Switch checked={recyclable} onCheckedChange={setRecyclable} />
              </label>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="specs">Specifications (one per line, "Label: value")</Label>
              <Textarea
                id="specs"
                rows={4}
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                placeholder={"Purity: 99.9% Cu\nPacking: Palletised coils"}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Attach supporting documents. Buyers see them as <strong>Uploaded</strong> until the
              platform admin marks them <strong>Verified</strong>.
            </p>
            <div className="space-y-2">
              {DOC_OPTIONS.map((doc) => {
                const selected = docs.includes(doc);
                return (
                  <button
                    key={doc}
                    type="button"
                    onClick={() =>
                      setDocs((prev) =>
                        prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc],
                      )
                    }
                    className={`flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left ${
                      selected ? "border-primary bg-accent" : "border-border bg-card"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Upload className="h-4 w-4 text-primary" /> {doc}
                    </span>
                    {selected ? <Pill tone="primary">Uploaded</Pill> : <Pill>Attach</Pill>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {(["Fixed", "Negotiable"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPriceType(type)}
                  className={`rounded-lg border p-4 text-left ${
                    priceType === type ? "border-primary bg-accent" : "border-border bg-card"
                  }`}
                >
                  <p className="font-semibold text-foreground">{type} price</p>
                  <p className="text-sm text-muted-foreground">
                    {type === "Fixed"
                      ? "Buyers request at your listed price."
                      : "Buyers may propose a different price."}
                  </p>
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price per {unit} (INR)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 685"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="minorder">Minimum order quantity ({unit})</Label>
                <Input
                  id="minorder"
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  placeholder="e.g. 500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <label className="flex items-center justify-between rounded-lg border border-border p-4">
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  Use my company location
                </span>
                <span className="block text-sm text-muted-foreground">
                  {currentIndustry.address}, {currentIndustry.city} {currentIndustry.pin}
                </span>
              </span>
              <Switch checked={useCompanyLocation} onCheckedChange={setUseCompanyLocation} />
            </label>

            {!useCompanyLocation && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="addr">Address</Label>
                  <Input id="addr" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pin">PIN code</Label>
                  <Input id="pin" value={pin} onChange={(e) => setPin(e.target.value)} />
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Pickup coordinates are shown to buyers on the marketplace map so they can filter
              listings by distance.
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
              Continue
            </Button>
          ) : (
            <Button onClick={publish} disabled={!canNext()} className="font-display tracking-wide">
              PUBLISH LISTING
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Gate({
  title,
  text,
  industryStatus,
}: {
  title: string;
  text: string;
  industryStatus?: boolean;
}) {
  const { currentIndustry } = useApp();
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      {industryStatus && currentIndustry && (
        <div className="mt-4 flex justify-center">
          <VerifiedBadge status={currentIndustry.verification} />
        </div>
      )}
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/login"
          className="rounded-md border border-input px-4 py-2 text-sm font-semibold hover:bg-secondary"
        >
          Sign in
        </Link>
        <Link
          to="/register"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
        >
          Register industry
        </Link>
      </div>
    </div>
  );
}
