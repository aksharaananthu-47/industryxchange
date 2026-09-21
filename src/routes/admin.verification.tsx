import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, VerifiedBadge } from "@/components/site/badges";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/admin/verification")({
  component: AdminVerification,
});

function AdminVerification() {
  const { industries, setVerification } = useApp();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const pending = industries.filter((i) => i.verification === "pending");
  const reviewed = industries.filter((i) => i.verification !== "pending");

  return (
    <div className="p-6 lg:p-8">
      <span className="label-caps text-primary">Trust & safety</span>
      <h1 className="mt-1 text-3xl font-bold text-foreground">Industry Verification</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Review submitted business documents. Approval awards the Verified Industry badge.
      </p>

      <Tabs defaultValue="pending" className="mt-6">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed ({reviewed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pending.length === 0 && (
            <p className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              The verification queue is clear.
            </p>
          )}
          {pending.map((industry) => (
            <div
              key={industry.id}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{industry.name}</h2>
                    <VerifiedBadge status={industry.verification} />
                  </div>
                  <p className="text-sm text-muted-foreground">{industry.category}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Registered {industry.memberSince}
                </p>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {industry.address}, {industry.city}, {industry.state} {industry.pin}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" /> {industry.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> {industry.phone}
                </p>
              </div>

              <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                {industry.documents.map((doc) => (
                  <li
                    key={doc.name}
                    className="flex items-center justify-between gap-2 rounded-lg bg-secondary px-3 py-2"
                  >
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <FileText className="h-4 w-4 text-muted-foreground" /> {doc.name}
                    </span>
                    <Pill>{doc.status}</Pill>
                  </li>
                ))}
              </ul>

              <Textarea
                className="mt-4"
                rows={2}
                placeholder="Reviewer notes (required when rejecting)"
                value={notes[industry.id] ?? ""}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, [industry.id]: e.target.value }))
                }
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  className="bg-success text-success-foreground hover:bg-success/90"
                  onClick={() => {
                    setVerification(industry.id, "verified");
                    toast.success(`${industry.name} approved as a Verified Industry`);
                  }}
                >
                  Approve verification
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    const note = notes[industry.id];
                    if (!note || note.trim().length < 5) {
                      toast.error("Add a reviewer note explaining the rejection");
                      return;
                    }
                    setVerification(industry.id, "rejected", note);
                    toast("Verification rejected");
                  }}
                >
                  Reject with notes
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-3">
          {reviewed.map((industry) => (
            <div
              key={industry.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4"
            >
              <div>
                <p className="font-medium text-foreground">{industry.name}</p>
                <p className="text-sm text-muted-foreground">
                  {industry.category} &middot; {industry.city}
                </p>
                {industry.reviewNote && (
                  <p className="mt-1 text-sm text-destructive">Note: {industry.reviewNote}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <VerifiedBadge status={industry.verification} />
                {industry.verification === "verified" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVerification(industry.id, "pending")}
                  >
                    Move to pending
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setVerification(industry.id, "verified")}>
                    Approve
                  </Button>
                )}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
