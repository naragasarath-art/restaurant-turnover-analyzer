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
import MenuManagement from "../../components/MenuManagement";
import MenuCard from "../../components/MenuCard";
import ChatBot from "../../components/ChatBot";

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
const [selectedMenuItem, setSelectedMenuItem] = useState<{
  name: string;
  category: string;
  price: number;
} | null>(null);
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
const [activeMenu, setActiveMenu] = useState("dashboard");

const [menuHistory, setMenuHistory] = useState<string[]>([
  "dashboard",
]);

const [historyIndex, setHistoryIndex] = useState(0);

const navigateToMenu = (menu: string) => {
  const newHistory = menuHistory.slice(0, historyIndex + 1);

  if (newHistory[newHistory.length - 1] === menu) {
    return;
  }

  newHistory.push(menu);

  setMenuHistory(newHistory);
  setHistoryIndex(newHistory.length - 1);
  setActiveMenu(menu);
};

const handleBack = () => {
  if (historyIndex > 0) {
    const newIndex = historyIndex - 1;

    setHistoryIndex(newIndex);
    setActiveMenu(menuHistory[newIndex]);
  }
};

const handleNext = () => {
  if (historyIndex < menuHistory.length - 1) {
    const newIndex = historyIndex + 1;

    setHistoryIndex(newIndex);
    setActiveMenu(menuHistory[newIndex]);
  }
};

 return (
  <>
  <button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    handleBack();
  }}
  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow"
>
  ← Back
</button>

    <button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    handleNext();
  }}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
>
  Next →
</button>

  <div className="flex min-h-screen bg-gray-100">

    {/* Sidebar */}
    <div className="w-64 bg-white shadow-lg p-5">

      <h2 className="text-xl font-bold mb-6">
        Menu
      </h2>
      <ul className="space-y-4">
        <li
         onClick={() => navigateToMenu("dashboard")}
          className="cursor-pointer hover:text-blue-600"
        >
          📊 Dashboard
        </li>

        <li
          onClick={() => navigateToMenu("menu")}
          className="cursor-pointer hover:text-blue-600"
        >
          🍔 Menu Management
        </li>

        <li
          onClick={() => navigateToMenu("expenses")}
          className="cursor-pointer hover:text-blue-600"
        >
          💰 Expenses
        </li>

        <li
          onClick={() => navigateToMenu("reports")}
          className="cursor-pointer hover:text-blue-600"
        >
          📈 Reports
        </li>

        <li
          onClick={() => navigateToMenu("export")}
          className="cursor-pointer hover:text-blue-600"
        >
          📄 Export
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
      {/* Main Content */}

  {/* Dashboard Header */}
  <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">

    <h1 className="text-3xl font-bold">
      🍽 Restaurant Monthly Turnover Analyzer
    </h1>

    <p className="mt-2 text-lg">
      Smart Dashboard for Sales, Expenses & Business Growth
    </p>

  </div>

    {activeMenu === "dashboard" && (
<>
  {/* Menu Card */}
  <div className="mt-6">
    <MenuCard
      onSelect={(item) => setSelectedMenuItem(item)}
    />
  </div>


  {/* Add Sales Entry */}
  <div className="mt-6">
    <MenuForm
      onAddSale={handleAddSale}
      selectedMenuItem={selectedMenuItem}
    />
  </div>


  {/* Sales Table */}
  <div className="mt-6">
    <SalesTable sales={filteredSales} />
  </div>


  {/* Monthly Expenses */}
  <div className="mt-6">
    <ExpenseForm
      onSaveExpenses={handleSaveExpenses}
    />
  </div>


  {/* Four Cards */}
  <div className="mt-6">
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
  </div>


  {/* Charts */}
  <div className="mt-6">
    <RevenueChart sales={sales} />
  </div>


  <div className="mt-6">
    <CategoryChart sales={sales} />
  </div>


  {/* Prediction */}
  <div className="mt-6">
    <TurnoverPrediction
      totalRevenue={totalRevenue}
      totalProfit={totalProfit}
    />
  </div>


  {/* Monthly Report */}
  <div className="mt-6">
    <MonthlyReport
      sales={sales}
      totalRevenue={totalRevenue}
      totalExpenses={totalExpenses}
      totalProfit={totalProfit}
    />
  </div>

</>
)}
      {activeMenu === "menu" && (
        <MenuManagement />
      )}

      {activeMenu === "expenses" && (
        <ExpenseForm onSaveExpenses={handleSaveExpenses} />
      )}

      {activeMenu === "reports" && (
        <MonthlyReport
          sales={sales}
          totalRevenue={totalRevenue}
          totalExpenses={totalExpenses}
          totalProfit={totalProfit}
        />
      )}

      {activeMenu === "export" && (
        <div className="space-y-4">
          <ExportCSV sales={sales} />

          <PDFReport
            sales={sales}
            totalRevenue={totalRevenue}
            totalExpenses={totalExpenses}
            totalProfit={totalProfit}
          />
        </div>
      )}

      <button
        onClick={clearAllData}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
      >
        🗑 Clear All Data
      </button>

    </div>
    <ChatBot />
  </div>
</>
);}