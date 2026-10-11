"use client";

import { useMemo } from "react";

type Sale = {
  menuItem: string;
  category: string;
  quantity: number;
  revenue: number;
};

type Props = {
  sales: Sale[];
};

export default function MenuPerformance({ sales }: Props) {
  const items = useMemo(() => {
    const summary = new Map<
      string,
      {
        name: string;
        category: string;
        quantity: number;
        revenue: number;
      }
    >();

    sales.forEach((sale) => {
      const name = sale.menuItem?.trim();

      if (!name) return;

      const key = name.toLowerCase();
      const existing = summary.get(key);

      if (existing) {
        existing.quantity += Number(sale.quantity) || 0;
        existing.revenue += Number(sale.revenue) || 0;
      } else {
        summary.set(key, {
          name,
          category: sale.category || "Uncategorized",
          quantity: Number(sale.quantity) || 0,
          revenue: Number(sale.revenue) || 0,
        });
      }
    });

    return Array.from(summary.values()).sort(
      (a, b) => b.revenue - a.revenue
    );
  }, [sales]);

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const mostSold = [...items].sort(
    (a, b) => b.quantity - a.quantity
  )[0];

  const leastSold = [...items].sort(
    (a, b) => a.quantity - b.quantity
  )[0];

  const highestRevenue = items[0];

  const maxRevenue = Math.max(
    1,
    ...items.map((item) => item.revenue)
  );

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          Menu Insights
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Menu Performance Analysis
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Compare items by total quantity sold and recorded sales revenue.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-600">
          No sales data available. Record a sale to view menu performance.
        </p>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-sm text-emerald-800">Most Sold Item</p>
              <p className="mt-2 text-lg font-bold text-emerald-950">
                {mostSold.name}
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                {mostSold.quantity} units sold
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                Highest Revenue Item
              </p>
              <p className="mt-2 text-lg font-bold text-blue-950">
                {highestRevenue.name}
              </p>
              <p className="mt-1 text-sm text-blue-800">
                {formatCurrency(highestRevenue.revenue)}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-sm text-amber-800">Least Sold Item</p>
              <p className="mt-2 text-lg font-bold text-amber-950">
                {leastSold.name}
              </p>
              <p className="mt-1 text-sm text-amber-800">
                {leastSold.quantity} units sold
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {items.map((item) => (
              <div key={item.name.toLowerCase()}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.category} · {item.quantity} units sold
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    {formatCurrency(item.revenue)}
                  </p>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (item.revenue / maxRevenue) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3">Menu Item</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3 text-right">Quantity Sold</th>
                  <th className="px-3 py-3 text-right">Revenue</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.name.toLowerCase()}
                    className="border-b border-slate-100"
                  >
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {item.name}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {item.category}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-slate-800">
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
