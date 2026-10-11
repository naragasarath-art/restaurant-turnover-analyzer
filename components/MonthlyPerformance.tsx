
"use client";

import { useMemo } from "react";

type Sale = {
  date: string;
  revenue: number;
};

type Expense = {
  expenseDate: string;
  staffSalary: number;
  rent: number;
  electricity: number;
  water: number;
  rawMaterials: number;
  otherExpenses: number;
};

type Props = {
  sales: Sale[];
  expenses: Expense[];
};

type MonthSummary = {
  key: string;
  label: string;
  revenue: number;
  expenses: number;
  profit: number;
};

export default function MonthlyPerformance({
  sales,
  expenses,
}: Props) {
  const monthlyData = useMemo(() => {
    const months = new Map<string, MonthSummary>();

    const getMonth = (date: string) => {
      if (!date || !/^\d{4}-\d{2}-\d{2}/.test(date)) {
        return null;
      }

      const key = date.slice(0, 7);

      if (!months.has(key)) {
        const [year, month] = key.split("-").map(Number);
        const label = new Date(
          year,
          month - 1,
          1
        ).toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        });

        months.set(key, {
          key,
          label,
          revenue: 0,
          expenses: 0,
          profit: 0,
        });
      }

      return months.get(key)!;
    };

    sales.forEach((sale) => {
      const month = getMonth(sale.date);
      if (month) month.revenue += Number(sale.revenue) || 0;
    });

    expenses.forEach((expense) => {
      const month = getMonth(expense.expenseDate);

      if (month) {
        month.expenses +=
          (Number(expense.staffSalary) || 0) +
          (Number(expense.rent) || 0) +
          (Number(expense.electricity) || 0) +
          (Number(expense.water) || 0) +
          (Number(expense.rawMaterials) || 0) +
          (Number(expense.otherExpenses) || 0);
      }
    });

    return Array.from(months.values())
      .map((month) => ({
        ...month,
        profit: month.revenue - month.expenses,
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [sales, expenses]);

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const bestMonth = monthlyData.reduce<MonthSummary | null>(
    (best, month) =>
      !best || month.profit > best.profit ? month : best,
    null
  );

  const current = monthlyData[monthlyData.length - 1];
  const previous = monthlyData[monthlyData.length - 2];

  const revenueChange =
    current && previous && previous.revenue !== 0
      ? ((current.revenue - previous.revenue) /
          previous.revenue) *
        100
      : null;

  const maxValue = Math.max(
    1,
    ...monthlyData.map((month) =>
      Math.max(month.revenue, month.expenses, Math.abs(month.profit))
    )
  );

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          Financial Analysis
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Monthly Performance Comparison
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Compare revenue, expenses and profit using your recorded data.
        </p>
      </div>

      {monthlyData.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-600">
          No dated sales or expenses are available yet. Add records to
          see your monthly performance.
        </p>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-sm text-emerald-800">Latest Month Revenue</p>
              <p className="mt-2 text-xl font-bold text-emerald-950">
                {formatCurrency(current.revenue)}
              </p>
              <p className="mt-1 text-xs text-emerald-800">
                {current.label}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm text-blue-800">Latest Month Profit</p>
              <p className="mt-2 text-xl font-bold text-blue-950">
                {formatCurrency(current.profit)}
              </p>
              <p className="mt-1 text-xs text-blue-800">
                Revenue minus expenses
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                Revenue Change vs Previous Month
              </p>
              <p className="mt-2 text-xl font-bold text-amber-950">
                {revenueChange === null
                  ? "Not available"
                  : `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`}
              </p>
              <p className="mt-1 text-xs text-amber-800">
                {revenueChange === null
                  ? "Requires two months and non-zero previous revenue"
                  : "Based on recorded monthly revenue"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-4 font-semibold text-slate-800">
              Revenue, Expenses and Profit
            </h3>

            <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-600">
              <span>🟩 Revenue</span>
              <span>🟦 Expenses</span>
              <span>🟧 Profit / Loss</span>
            </div>

            <div className="space-y-5">
              {monthlyData.map((month) => (
                <div key={month.key}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-700">
                      {month.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      Profit: {formatCurrency(month.profit)}
                    </span>
                  </div>

                  {[
                    {
                      label: "Revenue",
                      value: month.revenue,
                      color: "bg-emerald-500",
                    },
                    {
                      label: "Expenses",
                      value: month.expenses,
                      color: "bg-blue-500",
                    },
                    {
                      label: "Profit / Loss",
                      value: Math.abs(month.profit),
                      color:
                        month.profit < 0
                          ? "bg-rose-500"
                          : "bg-amber-500",
                    },
                  ].map((bar) => (
                    <div
                      key={bar.label}
                      className="mb-2 grid grid-cols-[76px_minmax(0,1fr)_auto] items-center gap-2"
                    >
                      <span className="text-xs text-slate-500">
                        {bar.label}
                      </span>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${bar.color}`}
                          style={{
                            width: `${Math.min(
                              100,
                              (bar.value / maxValue) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-700">
                        {formatCurrency(bar.value)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800">
              Best Profit Month
            </h3>
            {bestMonth && (
              <p className="mt-2 text-sm text-slate-600">
                {bestMonth.label} recorded the highest profit among the
                months with available sales or expense records:
                {" "}
                <strong className="text-slate-900">
                  {formatCurrency(bestMonth.profit)}
                </strong>
              </p>
            )}
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3">Month</th>
                  <th className="px-3 py-3 text-right">Revenue</th>
                  <th className="px-3 py-3 text-right">Expenses</th>
                  <th className="px-3 py-3 text-right">Profit / Loss</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((month) => (
                  <tr key={month.key} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {month.label}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {formatCurrency(month.revenue)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {formatCurrency(month.expenses)}
                    </td>
                    <td
                      className={`px-3 py-3 text-right font-semibold ${
                        month.profit < 0
                          ? "text-rose-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {formatCurrency(month.profit)}
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
