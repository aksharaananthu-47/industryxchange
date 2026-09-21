import { Link } from "@tanstack/react-router";
import { Building2, FileCheck2, FileText, Mail, MapPin, Phone, Star } from "lucide-react";
import type { Industry } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { MaterialCard } from "./MaterialCard";
import { Pill, StatusBadge, VerifiedBadge } from "./badges";

export function CompanyProfile({
  industry,
  isOwner,
}: {
  industry: Industry;
  isOwner?: boolean;
}) {
  const { materials, transactions } = useApp();
  const listings = materials.filter((m) => m.sellerId === industry.id);
  const deals = transactions.filter(
    (t) => t.sellerId === industry.id || t.buyerId === industry.id,
  );
  const reviews = transactions.filter((t) => t.sellerId === industry.id && t.review);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{industry.name}</h1>
              <VerifiedBadge status={industry.verification} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {industry.category} &middot; Member since {industry.memberSince}
            </p>
            {industry.rating > 0 && (
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-foreground">
                <Star className="h-4 w-4 fill-warning text-warning" /> {industry.rating} (
                {industry.reviewCount} reviews)
              </p>
            )}
          </div>
          {isOwner && (
            <Link
              to="/sell"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
            >
              List new material
            </Link>
          )}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{industry.about}</p>

        <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              {industry.address}
              <br />
              {industry.city}, {industry.state} {industry.pin}
              <br />
              <span className="text-xs">
                Lat {industry.lat.toFixed(4)}, Long {industry.lng.toFixed(4)}
              </span>
            </span>
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" /> {industry.email}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 text-primary" /> {industry.phone}
          </p>
        </div>
      </div>

      {isOwner && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
          <p className="label-caps text-muted-foreground">Verification documents</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {industry.documents.map((doc) => (
              <li
                key={doc.name}
                className="flex items-center justify-between gap-2 rounded-lg bg-secondary px-3 py-2"
              >
                <span className="flex items-center gap-2 text-sm text-foreground">
                  {doc.status === "Verified" ? (
                    <FileCheck2 className="h-4 w-4 text-success" />
                  ) : (
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  )}
                  {doc.name}
                </span>
                <Pill tone={doc.status === "Verified" ? "success" : "muted"}>{doc.status}</Pill>
              </li>
            ))}
          </ul>
          {industry.reviewNote && (
            <p className="mt-3 text-sm text-destructive">Admin note: {industry.reviewNote}</p>
          )}
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-bold text-foreground">Listed materials ({listings.length})</h2>
        {listings.length === 0 ? (
          <p className="mt-3 rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No materials listed yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((m) => (
              <MaterialCard key={m.id} material={m} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-foreground">Transactions ({deals.length})</h2>
          <ul className="mt-4 space-y-2">
            {deals.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">
                  {t.id} &middot; {t.quantity.toLocaleString("en-IN")} {t.unit}
                </span>
                <StatusBadge status={t.status} />
              </li>
            ))}
            {deals.length === 0 && (
              <li className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                No transactions yet.
              </li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Reviews ({reviews.length})</h2>
          <ul className="mt-4 space-y-2">
            {reviews.map((t) => (
              <li key={t.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-1 text-warning">
                  {Array.from({ length: t.rating ?? 0 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-1 text-sm text-foreground">{t.review}</p>
              </li>
            ))}
            {reviews.length === 0 && (
              <li className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                No reviews yet.
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
