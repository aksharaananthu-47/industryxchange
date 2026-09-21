import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/site/badges";
import { formatMoney } from "@/lib/geo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/admin/transactions")({
  component: AdminTransactions,
});

function AdminTransactions() {
  const { transactions, getIndustry, getMaterial } = useApp();

  return (
    <div className="p-6 lg:p-8">
      <span className="label-caps text-primary">Oversight</span>
      <h1 className="mt-1 text-3xl font-bold text-foreground">Transactions</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every deal on the platform with its current lifecycle stage.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-secondary">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Material</th>
              <th className="px-4 py-3 font-semibold">Buyer</th>
              <th className="px-4 py-3 font-semibold">Seller</th>
              <th className="px-4 py-3 font-semibold">Quantity</th>
              <th className="px-4 py-3 font-semibold">Value</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => {
              const price = t.agreedPrice ?? t.proposedPrice;
              return (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{t.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {getMaterial(t.materialId)?.name ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {getIndustry(t.buyerId)?.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {getIndustry(t.sellerId)?.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {t.quantity.toLocaleString("en-IN")} {t.unit}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {formatMoney(price * t.quantity)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
