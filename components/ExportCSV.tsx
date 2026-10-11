
"use client";

import { saveAs } from "file-saver";

type Sale = {
  billNumber: string;
  date: string;
  paymentMethod: string;
  menuItem: string;
  category: string;
  quantity: number;
  price: number;
  revenue: number;
};

type Expense = {
  id?: number;
  expenseDate: string;
  staffSalary: number;
  rent: number;
  electricity: number;
  water: number;
  rawMaterials: number;
  otherExpenses: number;
};

type ExportCSVProps = {
  sales: Sale[];
  expenses: Expense[];
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  selectedDate?: string;
};

export default function ExportCSV({
  sales,
  expenses = [],
  totalRevenue,
  totalExpenses,
  totalProfit,
  selectedDate,
}: ExportCSVProps) {
  const exportData = () => {
    const rows: (string | number)[][] = [];

    const add = (...values: (string | number)[]) => {
      rows.push(values);
    };

    const escapeCSV = (value: string | number) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const money = (value: number) =>
      Number(value || 0).toFixed(2);

    const totalQuantity = sales.reduce(
      (sum, s) => sum + Number(s.quantity || 0), 0
    );

    const bestSelling = sales.length
      ? sales.reduce((best, current) =>
          current.revenue > best.revenue ? current : best
        )
      : null;

    const predictedRevenue = totalRevenue * 1.1;
    const predictedProfit = predictedRevenue - totalExpenses;

    const performance =
      totalProfit > 50000 ? "Excellent" :
      totalProfit > 20000 ? "Good" :
      totalProfit > 0 ? "Positive" :
      "Needs Improvement";

    add("RESTAURANT MONTHLY TURNOVER ANALYZER");
    add("COMPLETE BUSINESS REPORT");
    add("Report Generated On", new Date().toLocaleDateString("en-IN"));
    add("Report Period", selectedDate || "All available dates");
    add();

    // 1. Sales Entries
    add("1. SALES ENTRIES");
    add("Total Sales Entries", sales.length);
    add("Total Quantity Sold", totalQuantity);
    add("Bill Number", "Date", "Payment Method", "Menu Item", "Category", "Quantity", "Price", "Revenue");

    if (sales.length === 0) {
      add("No sales records available");
    } else {
      sales.forEach(s =>
        add(
          s.billNumber, s.date, s.paymentMethod || "",
          s.menuItem, s.category, s.quantity,
          money(s.price), money(s.revenue)
        )
      );
    }

    add();

    // 2. Monthly Expenses
    add("2. MONTHLY EXPENSES");
    add("Expense Date", "Staff Salary", "Rent", "Electricity", "Water", "Raw Materials", "Other Expenses", "Total Expenses");

    expenses.forEach(e => {
      const total =
        Number(e.staffSalary || 0) +
        Number(e.rent || 0) +
        Number(e.electricity || 0) +
        Number(e.water || 0) +
        Number(e.rawMaterials || 0) +
        Number(e.otherExpenses || 0);

      add(
        e.expenseDate, money(e.staffSalary), money(e.rent),
        money(e.electricity), money(e.water),
        money(e.rawMaterials), money(e.otherExpenses),
        money(total)
      );
    });

    add("TOTAL EXPENSES", money(totalExpenses));
    add();

    // 3. Business Overview
    add("3. BUSINESS OVERVIEW");
    add("Metric", "Value");
    add("Total Revenue", money(totalRevenue));
    add("Total Expenses", money(totalExpenses));
    add(totalProfit >= 0 ? "Net Profit" : "Net Loss", money(Math.abs(totalProfit)));
    add("Best-Selling Item (highest revenue entry)", bestSelling?.menuItem || "No sales data");
    add("Total Sales Entries", sales.length);
    add("Total Items Sold", totalQuantity);
    add();

    // 4. Monthly Turnover Prediction
    add("4. MONTHLY TURNOVER PREDICTION");
    add("Prediction Metric", "Value");
    add("Prediction Method", "Estimated 10% revenue growth assumption; estimate only");
    add("Current Revenue", money(totalRevenue));
    add("Estimated Growth", "10%");
    add("Predicted Next-Month Turnover", money(predictedRevenue));
    add("Indicative Profit if Expenses Stay Unchanged", money(predictedProfit));
    add();

    // 5. Monthly Report
    add("5. MONTHLY REPORT");
    add("Monthly Summary", "Value");
    add("Report Period", selectedDate || "All available dates");
    add("Revenue", money(totalRevenue));
    add("Expenses", money(totalExpenses));
    add(totalProfit >= 0 ? "Profit" : "Loss", money(Math.abs(totalProfit)));
    add("Business Performance", performance);

    const csv = rows
      .map(row => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(
      blob,
      selectedDate
        ? `Restaurant_Complete_Report_${selectedDate}.csv`
        : "Restaurant_Complete_Business_Report.csv"
    );
  };

  return (
    <button
      onClick={exportData}
      className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
    >
      📊 Download Complete CSV Report
    </button>
  );
}
