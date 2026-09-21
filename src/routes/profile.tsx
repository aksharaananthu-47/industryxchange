import { createFileRoute, Link } from "@tanstack/react-router";
import { CompanyProfile } from "@/components/site/CompanyProfile";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Company Profile | Industrial Waste Exchange" },
      {
        name: "description",
        content:
          "Your industry profile: verification status, documents, location, listed materials, transactions and buyer reviews.",
      },
      { property: "og:title", content: "Company Profile | Industrial Waste Exchange" },
      {
        property: "og:description",
        content: "Verification status, documents, listings, transactions and reviews.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { currentIndustry } = useApp();

  if (!currentIndustry) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Sign in to view your company profile</h1>
        <Link to="/login" className="mt-4 inline-block font-semibold text-primary hover:underline">
          Go to sign in
        </Link>
      </div>
    );
  }

  return <CompanyProfile industry={currentIndustry} isOwner />;
}
