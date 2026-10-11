
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Sale = {
  revenue: number;
};

type Expense = {
  staffSalary: number;
  rent: number;
  electricity: number;
  water: number;
  rawMaterials: number;
  otherExpenses: number;
};

type InventoryItem = {
  id: number;
  name: string;
  quantity: number | string;
  minimum_stock: number | string;
  unit: string;
};

type Props = {
  sales: Sale[];
  expenses: Expense[];
};

export default function BusinessInsights({
  sales,
  expenses,
}: Props) {
  // Inventory data for restocking alerts
  const [inventoryItems, setInventoryItems] = useState<
    InventoryItem[]
  >([]);
  const [inventoryError, setInventoryError] = useState("");
  const [inventoryLoading, setInventoryLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadInventory() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          throw new Error("Please log in to view inventory alerts.");
        }

        const response = await fetch("/api/inventory", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Could not load inventory alerts."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Unexpected inventory response from server.");
        }

        if (!cancelled) {
          setInventoryItems(data as InventoryItem[]);
          setInventoryError("");
        }
      } catch (error) {
        if (!cancelled) {
          setInventoryError(
            error instanceof Error
              ? error.message
              : "Could not load inventory alerts."
          );
        }
      } finally {
        if (!cancelled) {
          setInventoryLoading(false);
        }
      }
    }

    void loadInventory();

    return () => {
      cancelled = true;
    };
  }, []);

  // Existing financial calculations
  const revenue = sales.reduce(
    (total, sale) => total + (Number(sale.revenue) || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total +
      (Number(expense.staffSalary) || 0) +
      (Number(expense.rent) || 0) +
      (Number(expense.electricity) || 0) +
      (Number(expense.water) || 0) +
      (Number(expense.rawMaterials) || 0) +
      (Number(expense.otherExpenses) || 0),
    0
  );

  const profit = revenue - totalExpenses;

  const profitMargin =
    revenue > 0 ? (profit / revenue) * 100 : null;

  const expenseRatio =
    revenue > 0 ? (totalExpenses / revenue) * 100 : null;

  const expenseBreakdown = [
    {
      name: "Staff Salary",
      amount: expenses.reduce(
        (s, e) => s + (Number(e.staffSalary) || 0),
        0
      ),
    },
    {
      name: "Rent",
      amount: expenses.reduce(
        (s, e) => s + (Number(e.rent) || 0),
        0
      ),
    },
    {
      name: "Electricity",
      amount: expenses.reduce(
        (s, e) => s + (Number(e.electricity) || 0),
        0
      ),
    },
    {
      name: "Water",
      amount: expenses.reduce(
        (s, e) => s + (Number(e.water) || 0),
        0
      ),
    },
    {
      name: "Raw Materials",
      amount: expenses.reduce(
        (s, e) => s + (Number(e.rawMaterials) || 0),
        0
      ),
    },
    {
      name: "Other Expenses",
      amount: expenses.reduce(
        (s, e) => s + (Number(e.otherExpenses) || 0),
        0
      ),
    },
  ].sort((a, b) => b.amount - a.amount);

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const highestExpense = expenseBreakdown[0];

  const insights: string[] = [];

  if (revenue === 0 && totalExpenses === 0) {
    insights.push(
      "Add sales and expense records to generate business insights."
    );
  } else {
    if (profit < 0) {
      insights.push(
        "Recorded expenses are higher than revenue. Review costs and sales records."
      );
    } else if (profit === 0) {
      insights.push(
        "Recorded revenue equals recorded expenses. There is no recorded profit or loss."
      );
    } else {
      insights.push(
        "Recorded revenue is higher than recorded expenses."
      );
    }

    if (revenue > 0 && profitMargin !== null) {
      insights.push(
        `Your recorded profit margin is ${profitMargin.toFixed(1)}%.`
      );
    } else {
      insights.push(
        "Profit margin is unavailable because recorded revenue is zero."
      );
    }

    if (totalExpenses > 0 && highestExpense.amount > 0) {
      insights.push(
        `${highestExpense.name} is your largest recorded expense category (${formatCurrency(highestExpense.amount)}).`
      );
    }
  }

  // Inventory items at or below their minimum stock level
  const lowStockItems = inventoryItems.filter(
    (item) =>
      Number(item.quantity) <= Number(item.minimum_stock)
  );

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          Business Intelligence
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Profit Margin &amp; Business Insights
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Financial indicators calculated from your recorded sales and expenses.
        </p>
      </div>

      {/* Financial summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Total Revenue</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(revenue)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Total Expenses</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(totalExpenses)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Profit / Loss</p>
          <p
            className={`mt-2 text-xl font-bold ${
              profit < 0 ? "text-rose-700" : "text-emerald-700"
            }`}
          >
            {formatCurrency(profit)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Profit Margin</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {profitMargin === null
              ? "N/A"
              : `${profitMargin.toFixed(1)}%`}
          </p>
        </div>
      </div>

      {/* Existing expense breakdown and financial insights */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800">
            Expense Breakdown
          </h3>

          <div className="mt-4 space-y-4">
            {expenseBreakdown.map((item) => {
              const percentage =
                totalExpenses > 0
                  ? (item.amount / totalExpenses) * 100
                  : 0;

              return (
                <div key={item.name}>
                  <div className="mb-1 flex justify-between gap-3 text-sm">
                    <span className="text-slate-600">
                      {item.name}
                    </span>

                    <span className="font-medium text-slate-800">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Expense ratio:{" "}
            {expenseRatio === null
              ? "Unavailable until revenue is recorded"
              : `${expenseRatio.toFixed(1)}% of revenue`}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800">
            Business Insights
          </h3>

          <ul className="mt-4 space-y-3">
            {insights.map((insight, index) => (
              <li
                key={index}
                className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700"
              >
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* New inventory restocking alerts */}
      <div className="mt-6 rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-800">
            Inventory Restocking Alerts
          </h3>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              lowStockItems.length > 0
                ? "bg-amber-100 text-amber-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {inventoryLoading
              ? "Checking..."
              : `${lowStockItems.length} low-stock item(s)`}
          </span>
        </div>

        {inventoryLoading ? (
          <p className="mt-3 text-sm text-slate-500">
            Loading inventory alerts...
          </p>
        ) : inventoryError ? (
          <p role="alert" className="mt-3 text-sm text-rose-700">
            {inventoryError}
          </p>
        ) : lowStockItems.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            All recorded inventory items have sufficient stock.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="rounded-lg bg-amber-50 p-3 text-sm"
              >
                <p className="font-semibold text-amber-900">
                  {item.name} — Restock needed
                </p>

                <p className="mt-1 text-amber-800">
                  Current stock: {Number(item.quantity)} {item.unit}
                  {" · "}
                  Minimum stock: {Number(item.minimum_stock)} {item.unit}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-5 text-xs text-slate-500">
        Note: These figures use recorded sales and expenses only. They do
        not include unrecorded costs, taxes, or other adjustments.
      </p>
    </section>
  );
}
