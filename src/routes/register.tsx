import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pill } from "@/components/site/badges";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register Your Industry | Industrial Waste Exchange" },
      {
        name: "description",
        content:
          "Register your industry with business documents and location. Admin verification unlocks buying and selling.",
      },
      { property: "og:title", content: "Register Your Industry | Industrial Waste Exchange" },
      {
        property: "og:description",
        content: "Register with business documents and location to start trading material.",
      },
    ],
  }),
  component: RegisterPage,
});

const INDUSTRY_CATEGORIES = [
  "Metal Processing",
  "Metal Fabrication",
  "Plastics & Polymers",
  "Textiles",
  "Paper & Packaging",
  "Glass Manufacturing",
  "Electronics Recycling",
  "Chemicals",
  "Industrial Surplus",
  "Other",
];

const REQUIRED_DOCS = [
  "Business Registration Certificate",
  "GST / Business ID",
  "Government / Industry Authorization Certificate",
];

function RegisterPage() {
  const { registerIndustry } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: INDUSTRY_CATEGORIES[0] as string,
    address: "",
    city: "",
    state: "",
    pin: "",
    lat: "11.0168",
    lng: "76.9558",
    about: "",
    password: "",
  });
  const [docs, setDocs] = useState<string[]>([]);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.city || !form.password) {
      toast.error("Please fill the company, email, city and password fields");
      return;
    }
    if (docs.length < REQUIRED_DOCS.length) {
      toast.error("Please attach all three documents");
      return;
    }
    registerIndustry({
      name: form.name,
      email: form.email,
      phone: form.phone,
      category: form.category,
      address: form.address,
      city: form.city,
      state: form.state,
      pin: form.pin,
      lat: Number(form.lat),
      lng: Number(form.lng),
      about: form.about || "Newly registered industry.",
      documents: REQUIRED_DOCS.map((d) => ({ name: d, status: "Uploaded" as const })),
    });
    toast.success("Registration submitted — status is Pending Verification");
    navigate({ to: "/profile" });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <span className="label-caps text-primary">Step 1 of the journey</span>
      <h1 className="mt-1 text-3xl font-bold text-foreground">Register your industry</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        One registration for both buying and selling. Your account stays{" "}
        <strong>Pending Verification</strong> until the platform admin approves your documents.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <p className="label-caps text-muted-foreground">Company details</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Company / Industry name" className="sm:col-span-2">
              <Input value={form.name} onChange={(e) => set("name")(e.target.value)} />
            </Field>
            <Field label="Official email">
              <Input type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} />
            </Field>
            <Field label="Contact number">
              <Input value={form.phone} onChange={(e) => set("phone")(e.target.value)} />
            </Field>
            <Field label="Industry category" className="sm:col-span-2">
              <Select value={form.category} onValueChange={set("category")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="About your industry" className="sm:col-span-2">
              <Textarea
                rows={3}
                value={form.about}
                onChange={(e) => set("about")(e.target.value)}
                placeholder="What you manufacture, what material you generate or need."
              />
            </Field>
            <Field label="Password" className="sm:col-span-2">
              <Input
                type="password"
                value={form.password}
                onChange={(e) => set("password")(e.target.value)}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <p className="label-caps text-muted-foreground">Location</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Address" className="sm:col-span-2">
              <Input value={form.address} onChange={(e) => set("address")(e.target.value)} />
            </Field>
            <Field label="City">
              <Input value={form.city} onChange={(e) => set("city")(e.target.value)} />
            </Field>
            <Field label="State">
              <Input value={form.state} onChange={(e) => set("state")(e.target.value)} />
            </Field>
            <Field label="PIN code">
              <Input value={form.pin} onChange={(e) => set("pin")(e.target.value)} />
            </Field>
            <Field label="Latitude / Longitude">
              <div className="flex gap-2">
                <Input value={form.lat} onChange={(e) => set("lat")(e.target.value)} />
                <Input value={form.lng} onChange={(e) => set("lng")(e.target.value)} />
              </div>
            </Field>
          </div>
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Your coordinates place your plant on the marketplace map and power the 10/25/50/100/250
            km distance filters.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <p className="label-caps text-muted-foreground">Document uploads</p>
          <div className="mt-4 space-y-2">
            {REQUIRED_DOCS.map((doc) => {
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
                  {selected ? <Pill tone="primary">Uploaded</Pill> : <Pill>Attach file</Pill>}
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" className="font-display tracking-wide">
            SUBMIT REGISTRATION
          </Button>
          <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
            Already registered? Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
