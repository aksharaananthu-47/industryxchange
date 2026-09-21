import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Recycle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_INDUSTRY_ID } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Industry Sign In | Industrial Waste Exchange" },
      {
        name: "description",
        content: "Sign in to your verified industry account to buy or sell industrial materials.",
      },
      { property: "og:title", content: "Industry Sign In | Industrial Waste Exchange" },
      {
        property: "og:description",
        content: "Sign in to your verified industry account.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signInIndustry } = useApp();
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Recycle className="h-6 w-6" />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Industry sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        One account to buy and sell industrial materials.
      </p>

      <form
        className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          signInIndustry(DEMO_INDUSTRY_ID);
          toast.success("Signed in as Anantha Engineering Works");
          navigate({ to: "/" });
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Official email</Label>
          <Input id="email" type="email" defaultValue="ops@ananthaengg.in" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" defaultValue="demo1234" />
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New industry?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register here
          </Link>
        </p>
      </form>

      <Link
        to="/admin"
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-md border border-input px-4 py-2 text-sm font-semibold hover:bg-secondary"
      >
        <ShieldCheck className="h-4 w-4" /> Platform admin login
      </Link>
    </div>
  );
}
