
"use client";

import { useEffect, useState } from "react";
import WordReport from "@/components/WordReport";

type Sale = {
  billNumber: string;
  date: string;
  paymentMethod?: string;
  menuItem: string;
  category: string;
  quantity: number;
  price: number;
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

export default function ExportPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    try {
      const savedSales = localStorage.getItem("sales");
      const savedExpenses = localStorage.getItem("expenses");

      if (savedSales) {
        setSales(JSON.parse(savedSales));
      }

      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, []);

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + Number(sale.revenue || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) =>
      sum +
      Number(expense.staffSalary || 0) +
      Number(expense.rent || 0) +
      Number(expense.electricity || 0) +
      Number(expense.water || 0) +
      Number(expense.rawMaterials || 0) +
      Number(expense.otherExpenses || 0),
    0
  );

  const totalProfit = totalRevenue - totalExpenses;

  const exportCSV = () => {
    if (sales.length === 0 && expenses.length === 0) {
      alert("No sales or expense data available.");
      return;
    }

    const rows: (string | number)[][] = [
      ["RESTAURANT MONTHLY TURNOVER ANALYZER"],
      ["BUSINESS OVERVIEW"],
      ["Total Revenue", totalRevenue.toFixed(2)],
      ["Total Expenses", totalExpenses.toFixed(2)],
      [
        totalProfit >= 0 ? "Net Profit" : "Net Loss",
        Math.abs(totalProfit).toFixed(2),
      ],
      [],
      ["1. SALES ENTRIES"],
      [
        "Bill Number",
        "Date",
        "Payment Method",
        "Menu Item",
        "Category",
        "Quantity",
        "Price",
        "Revenue",
      ],
      ...sales.map((sale) => [
        sale.billNumber,
        sale.date,
        sale.paymentMethod || "",
        sale.menuItem,
        sale.category,
        sale.quantity,
        sale.price,
        sale.revenue,
      ]),
      [],
      ["2. MONTHLY EXPENSES"],
      [
        "Expense Date",
        "Staff Salary",
        "Rent",
        "Electricity",
        "Water",
        "Raw Materials",
        "Other Expenses",
        "Total",
      ],
      ...expenses.map((expense) => [
        expense.expenseDate,
        expense.staffSalary,
        expense.rent,
        expense.electricity,
        expense.water,
        expense.rawMaterials,
        expense.otherExpenses,
        Number(expense.staffSalary || 0) +
          Number(expense.rent || 0) +
          Number(expense.electricity || 0) +
          Number(expense.water || 0) +
          Number(expense.rawMaterials || 0) +
          Number(expense.otherExpenses || 0),
      ]),
      [],
      ["3. BUSINESS OVERVIEW"],
      ["Total Sales Records", sales.length],
      [
        "Total Quantity Sold",
        sales.reduce(
          (sum, sale) => sum + Number(sale.quantity || 0),
          0
        ),
      ],
      [
        "Highest Revenue Sale Item",
        sales.length
          ? sales.reduce((best, sale) =>
              Number(sale.revenue) > Number(best.revenue)
                ? sale
                : best
            ).menuItem
          : "No sales data",
      ],
      [],
      ["4. MONTHLY TURNOVER PREDICTION"],
      ["Prediction Method", "Illustrative 10% revenue growth estimate"],
      ["Current Revenue", totalRevenue.toFixed(2)],
      ["Estimated Turnover", (totalRevenue * 1.1).toFixed(2)],
      [
        "Estimated Profit if Expenses Stay Unchanged",
        (totalRevenue * 1.1 - totalExpenses).toFixed(2),
      ],
      ["Note", "Estimate only; not a guaranteed result"],
      [],
      ["5. MONTHLY REPORT"],
      ["Revenue", totalRevenue.toFixed(2)],
      ["Expenses", totalExpenses.toFixed(2)],
      [
        totalProfit >= 0 ? "Profit" : "Loss",
        Math.abs(totalProfit).toFixed(2),
      ],
    ];

    const escapeCSV = (value: string | number) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent =
      "\uFEFF" +
      rows
        .map((row) => row.map(escapeCSV).join(","))
        .join("\r\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "restaurant-complete-business-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold">
        📄 Export Reports
      </h1>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          Download Your Restaurant Data
        </h2>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4">
            <p>Total Revenue</p>
            <p className="text-xl font-bold">
              ₹{totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="rounded-lg bg-red-50 p-4">
            <p>Total Expenses</p>
            <p className="text-xl font-bold">
              ₹{totalExpenses.toFixed(2)}
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4">
            <p>{totalProfit >= 0 ? "Net Profit" : "Net Loss"}</p>
            <p className="text-xl font-bold">
              ₹{Math.abs(totalProfit).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportCSV}
            className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
          >
            ⬇ Download Complete CSV
          </button>

          <WordReport
            sales={sales}
            expenses={expenses}
            totalRevenue={totalRevenue}
            totalExpenses={totalExpenses}
            totalProfit={totalProfit}
          />
        </div>

        <p className="mt-5">
          Total Sales Records: {sales.length}
        </p>

        <p className="mt-2">
          Total Expense Records: {expenses.length}
        </p>
      </div>
    </div>
  );
}
