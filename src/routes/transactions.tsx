import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Package,
  Star,
  Truck,
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pill, StatusBadge } from "@/components/site/badges";
import { PROBLEM_TYPES, type ProblemType, type Transaction } from "@/lib/mock-data";
import { formatMoney } from "@/lib/geo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions | Industrial Waste Exchange" },
      {
        name: "description",
        content:
          "Track every deal from request to completion: agree, deliver, inspect, accept the material or report a problem.",
      },
      { property: "og:title", content: "Transactions | Industrial Waste Exchange" },
      {
        property: "og:description",
        content: "Track requests, agreements, deliveries and material inspection in one place.",
      },
    ],
  }),
  component: Transactions,
});

const LIFECYCLE = ["Requested", "Agreed", "Delivered", "Inspection", "Completed"];

function Transactions() {
  const { transactions, currentIndustry, session } = useApp();

  if (session.kind !== "industry" || !currentIndustry) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Sign in to view transactions</h1>
        <Link to="/login" className="mt-4 inline-block font-semibold text-primary hover:underline">
          Go to sign in
        </Link>
      </div>
    );
  }

  const buying = transactions.filter((t) => t.buyerId === currentIndustry.id);
  const selling = transactions.filter((t) => t.sellerId === currentIndustry.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <span className="label-caps text-primary">My deals</span>
      <h1 className="mt-1 text-3xl font-bold text-foreground">Transactions</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Requested &rarr; Agreed &rarr; Delivered &rarr; Inspection &rarr; Completed
      </p>

      <Tabs defaultValue="buying" className="mt-6">
        <TabsList>
          <TabsTrigger value="buying">Buying ({buying.length})</TabsTrigger>
          <TabsTrigger value="selling">Selling ({selling.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="buying" className="space-y-4">
          {buying.length === 0 && <Empty label="You have not requested any material yet." />}
          {buying.map((tx) => (
            <TxCard key={tx.id} tx={tx} role="buyer" />
          ))}
        </TabsContent>
        <TabsContent value="selling" className="space-y-4">
          {selling.length === 0 && <Empty label="No buyer requests on your listings yet." />}
          {selling.map((tx) => (
            <TxCard key={tx.id} tx={tx} role="seller" />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function TxCard({ tx, role }: { tx: Transaction; role: "buyer" | "seller" }) {
  const { getMaterial, getIndustry, advance, counterOffer, acceptMaterial, reportProblem } =
    useApp();
  const material = getMaterial(tx.materialId);
  const counterparty = getIndustry(role === "buyer" ? tx.sellerId : tx.buyerId);

  const [negotiateOpen, setNegotiateOpen] = useState(false);
  const [counterPrice, setCounterPrice] = useState(String(tx.proposedPrice));
  const [counterNote, setCounterNote] = useState("");
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [problemOpen, setProblemOpen] = useState(false);
  const [problemType, setProblemType] = useState<ProblemType>(PROBLEM_TYPES[0]);
  const [problemDesc, setProblemDesc] = useState("");

  const price = tx.agreedPrice ?? tx.counterOffer?.price ?? tx.proposedPrice;
  const stepIndex = LIFECYCLE.indexOf(tx.status);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-4">
          {material && (
            <img
              src={material.image}
              alt={material.name}
              loading="lazy"
              className="h-20 w-24 shrink-0 rounded-lg object-cover"
            />
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-sm font-bold text-muted-foreground">{tx.id}</span>
              <StatusBadge status={tx.status} />
              <Pill tone="primary">{role === "buyer" ? "Buying" : "Selling"}</Pill>
            </div>
            <h3 className="mt-1 text-base font-semibold text-foreground">
              {material?.name ?? "Material"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {role === "buyer" ? "Seller" : "Buyer"}: {counterparty?.name}
            </p>
            <p className="mt-1 text-sm text-foreground">
              {tx.quantity.toLocaleString("en-IN")} {tx.unit} &middot; {formatMoney(price)} /{" "}
              {tx.unit} &middot;{" "}
              <span className="font-semibold">{formatMoney(price * tx.quantity)}</span> total
            </p>
          </div>
        </div>

        {material && (
          <Link
            to="/material/$materialId"
            params={{ materialId: material.id }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View listing <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {tx.requirements && (
        <p className="mt-3 rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Buyer requirements: </span>
          {tx.requirements}
        </p>
      )}

      {tx.counterOffer && tx.status === "Requested" && (
        <p className="mt-3 rounded-lg bg-accent p-3 text-sm text-accent-foreground">
          Seller counter offer: {formatMoney(tx.counterOffer.price)} / {tx.unit}
          {tx.counterOffer.note && ` \u2014 ${tx.counterOffer.note}`}
        </p>
      )}

      {/* Lifecycle */}
      {stepIndex >= 0 && (
        <ol className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          {LIFECYCLE.map((label, index) => (
            <li
              key={label}
              className={`rounded-md px-2 py-1 font-semibold ${
                index <= stepIndex
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {label}
            </li>
          ))}
        </ol>
      )}

      {tx.status === "Problem Reported" && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/8 p-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" /> A problem was reported. The platform admin is
          reviewing this dispute.
        </p>
      )}

      {tx.rating && (
        <div className="mt-4 rounded-lg bg-success/8 p-3">
          <div className="flex items-center gap-1 text-warning">
            {Array.from({ length: tx.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <p className="mt-1 text-sm text-foreground">{tx.review}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {role === "seller" && tx.status === "Requested" && (
          <>
            <Button
              onClick={() => {
                advance(tx.id, "Agreed", "Seller accepted the request");
                toast.success("Request accepted — agreement created");
              }}
            >
              Accept request
            </Button>
            <Button variant="outline" onClick={() => setNegotiateOpen(true)}>
              Negotiate
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                advance(tx.id, "Rejected", "Seller rejected the request");
                toast("Request rejected");
              }}
            >
              Reject
            </Button>
          </>
        )}

        {role === "buyer" && tx.status === "Requested" && tx.counterOffer && (
          <Button
            onClick={() => {
              advance(tx.id, "Agreed", "Buyer accepted counter offer");
              toast.success("Counter offer accepted");
            }}
          >
            Accept counter offer
          </Button>
        )}

        {tx.status === "Agreed" && (
          <Button
            onClick={() => {
              advance(tx.id, "Delivered", `Marked delivered by ${role}`);
              toast.success("Marked as delivered");
            }}
          >
            <Truck className="mr-1.5 h-4 w-4" /> Mark as delivered
          </Button>
        )}

        {role === "buyer" && tx.status === "Delivered" && (
          <Button onClick={() => advance(tx.id, "Inspection", "Buyer started inspection")}>
            <ClipboardCheck className="mr-1.5 h-4 w-4" /> Start material inspection
          </Button>
        )}

        {role === "buyer" && tx.status === "Inspection" && (
          <>
            <Button
              className="bg-success text-success-foreground hover:bg-success/90"
              onClick={() => setAcceptOpen(true)}
            >
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> ACCEPT MATERIAL
            </Button>
            <Button variant="destructive" onClick={() => setProblemOpen(true)}>
              <AlertTriangle className="mr-1.5 h-4 w-4" /> REPORT A PROBLEM
            </Button>
          </>
        )}

        {role === "seller" && tx.status === "Delivered" && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" /> Waiting for buyer inspection.
          </p>
        )}
      </div>

      {/* Negotiate dialog */}
      <Dialog open={negotiateOpen} onOpenChange={setNegotiateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send a counter offer</DialogTitle>
            <DialogDescription>
              Buyer proposed {formatMoney(tx.proposedPrice)} per {tx.unit}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor={`cp-${tx.id}`}>Your price per {tx.unit}</Label>
              <Input
                id={`cp-${tx.id}`}
                type="number"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`cn-${tx.id}`}>Note to buyer</Label>
              <Textarea
                id={`cn-${tx.id}`}
                rows={3}
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                placeholder="Reason for the revised price, packing changes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNegotiateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                counterOffer(tx.id, Number(counterPrice) || tx.proposedPrice, counterNote);
                setNegotiateOpen(false);
                toast.success("Counter offer sent");
              }}
            >
              Send counter offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Accept + review dialog */}
      <Dialog open={acceptOpen} onOpenChange={setAcceptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept material</DialogTitle>
            <DialogDescription>
              Confirm the material matches the listing, then rate the seller.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => setRating(value)}>
                    <Star
                      className={`h-7 w-7 ${
                        value <= rating ? "fill-warning text-warning" : "text-border"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`rv-${tx.id}`}>Review</Label>
              <Textarea
                id={`rv-${tx.id}`}
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Quality, packing, accuracy of the listing..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-success text-success-foreground hover:bg-success/90"
              onClick={() => {
                acceptMaterial(tx.id, rating, review || "Material accepted as described.");
                setAcceptOpen(false);
                toast.success("Transaction completed");
              }}
            >
              Accept & complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report problem dialog */}
      <Dialog open={problemOpen} onOpenChange={setProblemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report a problem</DialogTitle>
            <DialogDescription>
              This opens a dispute for the platform admin to review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Problem type</Label>
              <Select
                value={problemType}
                onValueChange={(v) => setProblemType(v as ProblemType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROBLEM_TYPES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`pd-${tx.id}`}>What went wrong?</Label>
              <Textarea
                id={`pd-${tx.id}`}
                rows={4}
                value={problemDesc}
                onChange={(e) => setProblemDesc(e.target.value)}
                placeholder="Describe the issue, affected quantity and impact."
              />
            </div>
            <div className="rounded-lg border border-dashed border-input bg-secondary p-3 text-sm text-muted-foreground">
              Photo / document evidence is attached automatically in this demo
              (inspection-photo.jpg).
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProblemOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (problemDesc.trim().length < 10) {
                  toast.error("Please describe the problem in a little more detail");
                  return;
                }
                reportProblem({
                  txId: tx.id,
                  problemType,
                  description: problemDesc,
                  evidence: ["inspection-photo.jpg"],
                });
                setProblemOpen(false);
                toast("Problem reported — dispute created");
              }}
            >
              Submit report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
