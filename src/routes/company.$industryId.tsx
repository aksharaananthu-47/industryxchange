import { createFileRoute, Link } from "@tanstack/react-router";
import { CompanyProfile } from "@/components/site/CompanyProfile";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/company/$industryId")({
  head: () => ({
    meta: [
      { title: "Industry Profile | Industrial Waste Exchange" },
      {
        name: "description",
        content:
          "Verified industry profile with location, listed materials, completed transactions and buyer reviews.",
      },
      { property: "og:title", content: "Industry Profile | Industrial Waste Exchange" },
      {
        property: "og:description",
        content: "Verified industry profile with listings, transactions and reviews.",
      },
    ],
  }),
  component: Company,
});

function Company() {
  const { industryId } = Route.useParams();
  const { getIndustry } = useApp();
  const industry = getIndustry(industryId);

  if (!industry) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Company not found</h1>
        <Link to="/buy" className="mt-4 inline-block font-semibold text-primary hover:underline">
          Back to marketplace
        </Link>
      </div>
    );
  }

  return <CompanyProfile industry={industry} />;
}
