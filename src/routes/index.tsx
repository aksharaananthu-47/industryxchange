import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ClipboardCheck,
  Cpu,
  FileSearch,
  GlassWater,
  Handshake,
  Newspaper,
  PackageCheck,
  Recycle,
  Shirt,
  Wrench,
} from "lucide-react";
import heroImage from "@/assets/hero-industrial.jpg";
import { MaterialCard } from "@/components/site/MaterialCard";
import { CATEGORIES } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Industrial Waste Exchange | Verified B2B Material Marketplace" },
      {
        name: "description",
        content:
          "Buy and sell reusable and recyclable industrial materials from verified industries. One account to list surplus and source material.",
      },
      {
        property: "og:title",
        content: "Industrial Waste Exchange | Verified B2B Material Marketplace",
      },
      {
        property: "og:description",
        content:
          "Buy and sell reusable and recyclable industrial materials from verified industries.",
      },
    ],
  }),
  component: Home,
});

const CATEGORY_ICONS = {
  Metal: Wrench,
  Plastic: Boxes,
  Textile: Shirt,
  Paper: Newspaper,
  Glass: GlassWater,
  "Electronic Waste": Cpu,
  Other: Recycle,
} as const;

const STEPS = [
  { icon: BadgeCheck, title: "Register & Verify", text: "Submit business documents once. Admin approves your industry." },
  { icon: FileSearch, title: "Find or List", text: "Search verified listings or publish your surplus material." },
  { icon: Handshake, title: "Request & Agree", text: "Send a request, negotiate quantity and price, then agree." },
  { icon: ClipboardCheck, title: "Inspect & Accept", text: "After delivery, inspect the material, accept it or report a problem." },
];

function Home() {
  const { materials, industries } = useApp();
  const recent = materials.filter((m) => m.status === "Active").slice(0, 6);
  const verifiedCount = industries.filter((i) => i.verification === "verified").length;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <img
          src={heroImage}
          alt="Industrial plant at dusk"
          width={1600}
          height={912}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <span className="label-caps inline-flex items-center gap-2 rounded-full border border-ink-foreground/20 bg-ink-foreground/5 px-3 py-1 text-ink-foreground/80">
            <BadgeCheck className="h-3.5 w-3.5" /> Verified industries only
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            INDUSTRIAL WASTE EXCHANGE
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-foreground/80">
            Buy and sell reusable and recyclable industrial materials from verified industries.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/buy"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-display text-sm font-bold tracking-wide text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              BUY MATERIALS <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 rounded-md bg-card px-6 py-3 font-display text-sm font-bold tracking-wide text-foreground transition-colors hover:bg-secondary"
            >
              SELL MATERIAL <PackageCheck className="h-4 w-4" />
            </Link>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-ink-foreground/15 pt-6">
            <div>
              <dt className="text-xs text-ink-foreground/60">Verified industries</dt>
              <dd className="font-display text-2xl font-bold">{verifiedCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-foreground/60">Live listings</dt>
              <dd className="font-display text-2xl font-bold">{materials.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-foreground/60">One account</dt>
              <dd className="font-display text-2xl font-bold">Buy + Sell</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="label-caps text-primary">Popular categories</span>
            <h2 className="mt-1 text-2xl font-bold text-foreground">
              Browse by material type
            </h2>
          </div>
          <Link
            to="/buy"
            className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            View all listings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <Link
                key={category}
                to="/buy"
                search={{ category }}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-foreground">{category}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <span className="label-caps text-primary">How it works</span>
          <h2 className="mt-1 text-2xl font-bold text-foreground">
            Four simple steps, start to finish
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-border bg-background p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-2xl font-bold text-border">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent materials */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="label-caps text-primary">Recently listed</span>
            <h2 className="mt-1 text-2xl font-bold text-foreground">Materials available now</h2>
          </div>
          <Link
            to="/buy"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      </section>
    </div>
  );
}
