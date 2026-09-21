import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Gavel } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pill, StatusBadge } from "@/components/site/badges";
import { RESOLUTIONS, type Resolution } from "@/lib/mock-data";
import { formatMoney } from "@/lib/geo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/admin/disputes")({
  component: AdminDisputes,
});

function AdminDisputes() {
  const { disputes, transactions, getIndustry, getMaterial, resolveDispute } = useApp();
  const [drafts, setDrafts] = useState<Record<string, { resolution: Resolution; note: string }>>(
    {},
  );

  return (
    <div className="p-6 lg:p-8">
      <span className="label-caps text-primary">Dispute management</span>
      <h1 className="mt-1 text-3xl font-bold text-foreground">Disputes</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Review the buyer claim, seller response and evidence, then assign a resolution.
      </p>

      <div className="mt-6 space-y-4">
        {disputes.length === 0 && (
          <p className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No disputes raised.
          </p>
        )}

        {disputes.map((dispute) => {
          const tx = transactions.find((t) => t.id === dispute.transactionId);
          const material = tx ? getMaterial(tx.materialId) : undefined;
          const buyer = tx ? getIndustry(tx.buyerId) : undefined;
          const seller = tx ? getIndustry(tx.sellerId) : undefined;
          const draft = drafts[dispute.id] ?? { resolution: RESOLUTIONS[0], note: "" };
          const value = tx ? (tx.agreedPrice ?? tx.proposedPrice) * tx.quantity : 0;

          return (
            <div
              key={dispute.id}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm font-bold text-muted-foreground">
                      {dispute.id}
                    </span>
                    <Pill tone="danger">{dispute.problemType}</Pill>
                    <Pill tone={dispute.status === "Open" ? "warning" : "success"}>
                      {dispute.status}
                    </Pill>
                    {tx && <StatusBadge status={tx.status} />}
                  </div>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">
                    {material?.name ?? "Material"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {dispute.transactionId} &middot; {tx?.quantity.toLocaleString("en-IN")}{" "}
                    {tx?.unit} &middot; {formatMoney(value)} &middot; raised {dispute.raisedOn}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">Buyer:</span> {buyer?.name}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Seller:</span> {seller?.name}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div className="rounded-lg bg-destructive/8 p-4">
                  <p className="label-caps text-destructive">Buyer claim</p>
                  <p className="mt-1.5 text-sm text-foreground">{dispute.description}</p>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <p className="label-caps text-muted-foreground">Seller response</p>
                  <p className="mt-1.5 text-sm text-foreground">
                    {dispute.sellerResponse ?? "No response submitted yet."}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <p className="label-caps text-muted-foreground">Evidence</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {dispute.evidence.map((file) => (
                    <li
                      key={file}
                      className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-sm text-foreground"
                    >
                      <FileText className="h-4 w-4 text-primary" /> {file}
                    </li>
                  ))}
                </ul>
              </div>

              {dispute.status === "Open" ? (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  <div className="grid gap-3 sm:grid-cols-[240px_1fr]">
                    <Select
                      value={draft.resolution}
                      onValueChange={(v) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [dispute.id]: { ...draft, resolution: v as Resolution },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RESOLUTIONS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      rows={2}
                      placeholder="Resolution note sent to both industries"
                      value={draft.note}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [dispute.id]: { ...draft, note: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <Button
                    onClick={() => {
                      resolveDispute(dispute.id, draft.resolution, draft.note);
                      toast.success(`Dispute ${dispute.id} resolved: ${draft.resolution}`);
                    }}
                  >
                    <Gavel className="mr-1.5 h-4 w-4" /> Assign resolution
                  </Button>
                </div>
              ) : (
                <div className="mt-4 rounded-lg bg-success/10 p-4">
                  <p className="text-sm font-semibold text-success">
                    Resolution: {dispute.resolution}
                  </p>
                  {dispute.resolutionNote && (
                    <p className="mt-1 text-sm text-foreground">{dispute.resolutionNote}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
