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
import TurnoverPrediction from "../../components/TurnoverPrediction";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

const logout = () => {
  router.push("/login");
};
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
  

  <div>

    {/* Header */}
    <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-6 shadow-lg">

  <h1 className="text-4xl font-bold">
    🍽 Restaurant Monthly Turnover Analyzer
  </h1>

  <p className="mt-2 text-lg">
    Smart Dashboard for Sales, Expenses & Business Growth
  </p>

</div>


    <div className="flex flex-col md:flex-row">


      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white min-h-screen p-5 shadow-lg border-r">

        <h2 className="text-xl font-bold mb-6">
          Menu
        </h2>


        <ul className="space-y-4">


          <li>
            <a
              href="/dashboard"
              className="hover:text-blue-600"
            >
              📊 Dashboard
            </a>
          </li>


          <li>
            <a
              href="/menu"
              className="hover:text-blue-600"
            >
              🍔 Menu Management
            </a>
          </li>


          <li>
            <a
              href="/expenses"
              className="hover:text-blue-600"
            >
              💰 Expenses
            </a>
          </li>


          <li>
            <a
              href="/reports"
              className="hover:text-blue-600"
            >
              📈 Reports
            </a>
          </li>


          <li>
            <a
              href="/export"
              className="hover:text-blue-600"
            >
              📄 Export
            </a>
          </li>


        </ul>



        <button
          onClick={logout}
          className="mt-10 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg w-full"
        >
          🚪 Logout
        </button>


      </div>



      {/* Main Content */}
      <div className="flex-1 p-6">


        <MenuForm 
          onAddSale={handleAddSale} 
        />


        <ExpenseForm
          onSaveExpenses={handleSaveExpenses}
        />



        <DashboardCards
          totalRevenue={totalRevenue}
          totalExpenses={totalExpenses}
          totalProfit={totalProfit}
          bestSellingItem={
            bestSellingItem
              ? bestSellingItem.menuItem
              : "No Data"
          }
        />



        <TurnoverPrediction
          totalRevenue={totalRevenue}
          totalProfit={totalProfit}
        />



        <SalesTable 
          sales={filteredSales} 
        />



        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">

  <h2 className="text-2xl font-bold mb-4">
    📊 Revenue Analysis
  </h2>

  <RevenueChart sales={sales} />

</div>


<div className="mt-8 bg-white p-6 rounded-xl shadow-lg">

  <h2 className="text-2xl font-bold mb-4">
    🍽 Category Performance
  </h2>

  <CategoryChart sales={sales} />

</div>



        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">

  <h2 className="text-2xl font-bold mb-4">
    📄 Monthly Report
  </h2>

  <MonthlyReport
    sales={sales}
    totalRevenue={totalRevenue}
    totalExpenses={totalExpenses}
    totalProfit={totalProfit}
  />

</div>



        <button
          onClick={clearAllData}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
        >
          🗑 Clear All Data
        </button>


      </div>


    </div>


  </div>

);
}