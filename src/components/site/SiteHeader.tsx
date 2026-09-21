import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Recycle, ShieldCheck, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { DemoSwitcher } from "./DemoSwitcher";
import { VerifiedBadge } from "./badges";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/buy", label: "Buy Materials" },
  { to: "/sell", label: "Sell Material" },
  { to: "/transactions", label: "Transactions" },
  { to: "/profile", label: "Company Profile" },
] as const;

export function SiteHeader() {
  const { currentIndustry, session } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Recycle className="h-5 w-5" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-sm font-bold tracking-tight text-foreground">
              INDUSTRIAL WASTE EXCHANGE
            </span>
            <span className="block text-[11px] text-muted-foreground">
              Verified industry marketplace
            </span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-accent text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {currentIndustry && (
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-foreground">{currentIndustry.name}</p>
              <VerifiedBadge status={currentIndustry.verification} />
            </div>
          )}
          {session.kind === "guest" && (
            <Link
              to="/login"
              className="rounded-md border border-input px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Sign in
            </Link>
          )}
          <DemoSwitcher />
          <Link
            to="/admin"
            className="hidden items-center gap-1.5 rounded-md border border-input px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary sm:inline-flex"
          >
            <ShieldCheck className="h-4 w-4" /> Admin
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-input p-2 lg:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-card px-4 pb-4 pt-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Admin Portal
          </Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-sm font-bold tracking-wide">
            INDUSTRIAL WASTE EXCHANGE
          </p>
          <p className="text-sm text-ink-foreground/70">
            Buy and sell reusable and recyclable industrial materials from verified industries.
          </p>
        </div>
        <p className="text-xs text-ink-foreground/60">
          Demonstration prototype &middot; all industries and listings are sample data
        </p>
      </div>
    </footer>
  );
}
