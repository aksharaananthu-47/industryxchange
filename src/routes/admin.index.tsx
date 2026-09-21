import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, BadgeCheck, Flag, Receipt } from "lucide-react";
import { StatusBadge } from "@/components/site/badges";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { industries, transactions, disputes, materials } = useApp();

  const pending = industries.filter((i) => i.verification === "pending");
  const active = transactions.filter((t) =>
    ["Requested", "Agreed", "Delivered", "Inspection"].includes(t.status),
  );
  const problems = transactions.filter((t) => t.status === "Problem Reported");
  const openDisputes = disputes.filter((d) => d.status === "Open");

  const cards = [
    {
      label: "Pending Verifications",
      value: pending.length,
      icon: BadgeCheck,
      to: "/admin/verification" as const,
      tone: "text-warning-foreground bg-warning/18",
    },
    {
      label: "Active Transactions",
      value: active.length,
      icon: Receipt,
      to: "/admin/transactions" as const,
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Reported Problems",
      value: problems.length,
      icon: Flag,
      to: "/admin/disputes" as const,
      tone: "text-destructive bg-destructive/10",
    },
    {
      label: "Active Disputes",
      value: openDisputes.length,
      icon: AlertTriangle,
      to: "/admin/disputes" as const,
      tone: "text-destructive bg-destructive/10",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <span className="label-caps text-primary">Platform operations</span>
      <h1 className="mt-1 text-3xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {industries.length} registered industries &middot; {materials.length} listings
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.tone}`}
            >
              <card.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-3xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-bold text-foreground">
            Verification queue
          </h2>
          <ul className="mt-3 space-y-2">
            {pending.map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2.5"
              >
                <span className="text-sm">
                  <span className="block font-medium text-foreground">{i.name}</span>
                  <span className="text-muted-foreground">
                    {i.category} &middot; {i.city}
                  </span>
                </span>
                <Link
                  to="/admin/verification"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Review
                </Link>
              </li>
            ))}
            {pending.length === 0 && (
              <li className="rounded-lg bg-secondary p-4 text-center text-sm text-muted-foreground">
                No industries waiting for verification.
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-bold text-foreground">
            Latest transactions
          </h2>
          <ul className="mt-3 space-y-2">
            {transactions.slice(0, 5).map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2.5"
              >
                <span className="text-sm font-medium text-foreground">{t.id}</span>
                <StatusBadge status={t.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
