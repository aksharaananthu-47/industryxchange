import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  LayoutDashboard,
  Package,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal | Industrial Waste Exchange" },
      {
        name: "description",
        content:
          "Platform operator portal for industry verification, listing moderation and dispute resolution.",
      },
      { property: "og:title", content: "Admin Portal | Industrial Waste Exchange" },
      {
        property: "og:description",
        content: "Verification queue, listing moderation and dispute resolution.",
      },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/verification", label: "Industry Verification", icon: BadgeCheck, exact: false },
  { to: "/admin/listings", label: "Material Listings", icon: Package, exact: false },
  { to: "/admin/transactions", label: "Transactions", icon: Receipt, exact: false },
  { to: "/admin/disputes", label: "Disputes", icon: AlertTriangle, exact: false },
] as const;

function AdminLayout() {
  const { session, signInAdmin } = useApp();

  if (session.kind !== "admin") {
    return <AdminLogin onSignIn={signInAdmin} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col bg-ink text-ink-foreground lg:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold">ADMIN PORTAL</span>
            <span className="block text-[11px] text-ink-foreground/60">
              Industrial Waste Exchange
            </span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink-foreground/70 hover:bg-ink-foreground/10 hover:text-ink-foreground"
              activeProps={{ className: "bg-primary text-primary-foreground" }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/"
          className="m-3 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-ink-foreground/70 hover:bg-ink-foreground/10"
        >
          <ArrowLeft className="h-4 w-4" /> Back to marketplace
        </Link>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-3 overflow-x-auto border-b border-border bg-card px-4 py-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground"
              activeProps={{ className: "bg-primary text-primary-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </header>
        <Outlet />
      </div>
    </div>
  );
}

function AdminLogin({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSignIn();
        }}
        className="w-full max-w-sm rounded-xl bg-card p-7 shadow-lift"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-foreground">Platform admin login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Verification, listing moderation and dispute resolution.
        </p>
        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="adminEmail">Admin email</Label>
            <Input id="adminEmail" type="email" defaultValue="admin@iwexchange.in" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="adminPass">Password</Label>
            <Input id="adminPass" type="password" defaultValue="admin1234" />
          </div>
          <Button type="submit" className="w-full">
            Sign in to admin portal
          </Button>
          <Link
            to="/"
            className="block text-center text-sm font-semibold text-primary hover:underline"
          >
            Back to marketplace
          </Link>
        </div>
      </form>
    </div>
  );
}
