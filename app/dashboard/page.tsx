"use client";

import { useState, useEffect } from "react";

import MenuForm from "../../components/MenuForm";
import ExpenseForm from "../../components/ExpenseForm";
import SalesTable from "../../components/SalesTable";
import DashboardCards from "../../components/DashboardCards";
import RevenueChart from "../../components/RevenueChart";
import ReportSummary from "../../components/ReportSummary";
import CategoryChart from "../../components/CategoryChart";
import MonthlyReport from "../../components/MonthlyReport";
import ExportCSV from "../../components/ExportCSV";
import PDFReport from "../../components/PDFReport";

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
  staffSalary: number;
  rent: number;
  electricity: number;
  water: number;
  rawMaterials: number;
  otherExpenses: number;
};

export default function DashboardPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState("");
  const [expenses, setExpenses] = useState<Expense>({
  
    staffSalary: 0,
    rent: 0,
    electricity: 0,
    water: 0,
    rawMaterials: 0,
    otherExpenses: 0,
  });
  useEffect(() => {
  const savedSales = localStorage.getItem("sales");
  const savedExpenses = localStorage.getItem("expenses");

  if (savedSales) {
    setSales(JSON.parse(savedSales));
  }

  if (savedExpenses) {
    setExpenses(JSON.parse(savedExpenses));
  }
}, []);

useEffect(() => {
  localStorage.setItem("sales", JSON.stringify(sales));
}, [sales]);

useEffect(() => {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}, [expenses]);

  const handleAddSale = (sale: Sale) => {
    setSales((prev) => [...prev, sale]);
  };

  const handleSaveExpenses = (expense: Expense) => {
    setExpenses(expense);
  };
  const filteredSales = sales.filter((sale) =>
  sale.menuItem.toLowerCase().includes(search.toLowerCase())
);

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + sale.revenue,
    0
  );

  const totalExpenses =
    expenses.staffSalary +
    expenses.rent +
    expenses.electricity +
    expenses.water +
    expenses.rawMaterials +
    expenses.otherExpenses;

  const totalProfit = totalRevenue - totalExpenses;

  const bestSellingItem =
  
    sales.length > 0
      ? sales.reduce((best, current) =>
          current.revenue > best.revenue ? current : best
        )
      : null;
      const clearAllData = () => {
  if (confirm("Are you sure you want to clear all data?")) {
    localStorage.removeItem("sales");
    localStorage.removeItem("expenses");

    setSales([]);

    setExpenses({
      staffSalary: 0,
      rent: 0,
      electricity: 0,
      water: 0,
      rawMaterials: 0,
      otherExpenses: 0,
    });
  }
};

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
    <div className="bg-blue-700 text-white rounded-xl p-6 mb-6 shadow-lg">
  <h1 className="text-4xl font-bold">
    🍽 Restaurant Turnover Analyzer
  </h1>

  <p className="mt-2 text-lg">
    Sales • Expenses • Profit • Reports
  </p>
</div>

    <MenuForm onAddSale={handleAddSale} />

    <ExpenseForm onSaveExpenses={handleSaveExpenses} />

    <DashboardCards
      totalRevenue={totalRevenue}
      totalExpenses={totalExpenses}
      totalProfit={totalProfit}
      bestSellingItem={
        bestSellingItem ? bestSellingItem.menuItem : "No Data"
      }
    />

    <div className="flex gap-4 mt-6 mb-6">

  <ExportCSV sales={sales} />

  <PDFReport
    sales={sales}
    totalRevenue={totalRevenue}
    totalExpenses={totalExpenses}
    totalProfit={totalProfit}
  />

</div>

    <div className="mt-6">
      <input
        type="text"
        placeholder="🔍 Search Menu Item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg p-3"
      />
    </div>

    <SalesTable sales={filteredSales} />

    <RevenueChart sales={sales} />

    <ReportSummary sales={sales} />

    <CategoryChart sales={sales} />

    <MonthlyReport
      sales={sales}
      totalRevenue={totalRevenue}
      totalExpenses={totalExpenses}
      totalProfit={totalProfit}
    />

    <div className="mt-6">
      <button
        onClick={clearAllData}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
      >
        🗑 Clear All Data
      </button>
    </div>
<footer className="mt-12 text-center text-gray-600">
  <hr className="mb-4" />

  <p className="font-semibold">
    Restaurant Monthly Turnover Analyzer
  </p>

  <p>Developed by Sarath Kumar</p>

  <p>© 2026 All Rights Reserved</p>
</footer>
  </div>
);
}