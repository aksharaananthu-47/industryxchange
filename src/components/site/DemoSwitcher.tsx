import { useNavigate } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { DEMO_INDUSTRY_ID } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export function DemoSwitcher() {
  const { session, currentIndustry, signInIndustry, signInAdmin, signOut, setVerification } =
    useApp();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground hover:bg-accent"
        >
          <FlaskConical className="h-4 w-4" />
          <span className="hidden sm:inline">Demo</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Demo account switcher</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signInIndustry(DEMO_INDUSTRY_ID);
            navigate({ to: "/" });
          }}
        >
          Industry user &middot; Anantha Engineering
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            signInAdmin();
            navigate({ to: "/admin" });
          }}
        >
          Platform admin
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            signOut();
            navigate({ to: "/" });
          }}
        >
          Sign out (guest view)
        </DropdownMenuItem>

        {currentIndustry && (
          <>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between gap-3 px-2 py-2">
              <div>
                <p className="text-sm font-medium">Verified status</p>
                <p className="text-xs text-muted-foreground">
                  {currentIndustry.verification === "verified"
                    ? "Verified Industry"
                    : "Pending Verification"}
                </p>
              </div>
              <Switch
                checked={currentIndustry.verification === "verified"}
                onCheckedChange={(checked) =>
                  setVerification(currentIndustry.id, checked ? "verified" : "pending")
                }
              />
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
