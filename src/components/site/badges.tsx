import { BadgeCheck, Clock, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TxStatus, VerificationStatus } from "@/lib/mock-data";

export function VerifiedBadge({
  status,
  className,
}: {
  status: VerificationStatus;
  className?: string;
}) {
  if (status === "verified") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-xs font-semibold text-success",
          className,
        )}
      >
        <BadgeCheck className="h-3.5 w-3.5" /> Verified Industry
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-destructive/12 px-2 py-0.5 text-xs font-semibold text-destructive",
          className,
        )}
      >
        <ShieldX className="h-3.5 w-3.5" /> Verification Rejected
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-warning/18 px-2 py-0.5 text-xs font-semibold text-warning-foreground",
        className,
      )}
    >
      <Clock className="h-3.5 w-3.5" /> Pending Verification
    </span>
  );
}

const TX_STYLES: Record<TxStatus, string> = {
  Requested: "bg-accent text-accent-foreground",
  Agreed: "bg-primary/12 text-primary",
  Delivered: "bg-ink/10 text-ink",
  Inspection: "bg-warning/18 text-warning-foreground",
  Completed: "bg-success/14 text-success",
  Rejected: "bg-muted text-muted-foreground",
  "Problem Reported": "bg-destructive/12 text-destructive",
};

export function StatusBadge({ status }: { status: TxStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TX_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export function Pill({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "primary" | "success" | "warning" | "danger";
}) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/14 text-success",
    warning: "bg-warning/18 text-warning-foreground",
    danger: "bg-destructive/12 text-destructive",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
