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
import TurnoverPrediction from "../../components/TurnoverPrediction";
import { useRouter } from "next/navigation";
import MenuManagement from "../../components/MenuManagement";
import MenuCard from "../../components/MenuCard";
import ChatBot from "../../components/ChatBot";
import { supabase } from "../../lib/supabaseClient";
import ExpenseTable from "../../components/ExpenseTable";
import MonthlyPerformance from "../../components/MonthlyPerformance";
import MenuPerformance from "../../components/MenuPerformance";
import BusinessInsights from "../../components/BusinessInsights";
import InventoryManagement from "@/components/InventoryManagement";
import ThemeToggle from "@/components/ThemeToggle";
import PDFReport from "@/components/PDFReport";
import WordReport from "@/components/WordReport";
import ExportCSV from "@/components/ExportCSV";


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

export default function DashboardPage() {
  const router = useRouter();

const logout = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};
const [selectedMenuItem, setSelectedMenuItem] = useState<{
  name: string;
  category: string;
  price: number;
} | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [search, setSearch] = useState("");
 const [expenses, setExpenses] = useState<Expense>({
  expenseDate: new Date().toISOString().split("T")[0],
  staffSalary: 0,
  rent: 0,
  electricity: 0,
  water: 0,
  rawMaterials: 0,
  otherExpenses: 0,
});

const [expenseHistory, setExpenseHistory] = useState<Expense[]>([]);

const [selectedExpenseDate, setSelectedExpenseDate] =
  useState("");
  useEffect(() => {
  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    const response = await fetch("/api/sales", {
  headers: {
    Authorization: `Bearer ${session.access_token}`,
  },
});

if (response.ok) {
  const data = await response.json();

  const formattedSales = data.map((sale: any) => ({
    billNumber: sale.bill_number,
    date: sale.date,
    paymentMethod: sale.payment_method,
    menuItem: sale.menu_item,
    category: sale.category,
    quantity: Number(sale.quantity),
    price: Number(sale.price),
    revenue: Number(sale.revenue),
  }));

  setSales(formattedSales);
}
    const expenseResponse = await fetch("/api/expenses", {
  headers: {
    Authorization: `Bearer ${session.access_token}`,
  },
});

if (expenseResponse.ok) {
  const expenseData = await expenseResponse.json();

  const formattedExpenses = expenseData.map((expense: any) => ({
    id: expense.id,
    expenseDate: expense.expense_date,
    staffSalary: Number(expense.staff_salary) || 0,
    rent: Number(expense.rent) || 0,
    electricity: Number(expense.electricity) || 0,
    water: Number(expense.water) || 0,
    rawMaterials: Number(expense.raw_materials) || 0,
    otherExpenses: Number(expense.other_expenses) || 0,
  }));

  setExpenseHistory(formattedExpenses);

  if (formattedExpenses.length > 0) {
    setExpenses(formattedExpenses[0]);
  }
}
  };

  checkUser();
}, [router]);





  const handleAddSale = async (sale: Sale) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Please login first.");
      return;
    }

    const response = await fetch("/api/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(sale),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to save sale");
    }

    // Add the sale to the dashboard
    setSales((prev) => [...prev, sale]);
  } catch (error) {
    console.error(error);
    alert("Could not save the sale.");
  }
};

 const handleSaveExpenses = (expense: Expense) => {
  setExpenses(expense);

  setExpenseHistory((prev) => {
    const existing = prev.find(
      (item) => item.expenseDate === expense.expenseDate
    );

    if (existing) {
      return prev.map((item) =>
        item.expenseDate === expense.expenseDate
          ? {
              ...expense,
              id: existing.id,
            }
          : item
      );
    }

    return [...prev, expense];
  });

};
 const filteredSales = sales.filter((sale) => {
  const matchesSearch = sale.menuItem
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesDate =
    selectedDate === "" || sale.date === selectedDate;

  return matchesSearch && matchesDate;
});
const filteredExpenses = expenseHistory.filter((expense) => {
  return (
    selectedExpenseDate === "" ||
    expense.expenseDate === selectedExpenseDate
  );
});

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + sale.revenue,
    0
  );

  const totalExpenses = expenseHistory.reduce(
  (sum, expense) =>
    sum +
    expense.staffSalary +
    expense.rent +
    expense.electricity +
    expense.water +
    expense.rawMaterials +
    expense.otherExpenses,
  0
);

  const totalProfit = totalRevenue - totalExpenses;

  const bestSellingItem =
  
    sales.length > 0
      ? sales.reduce((best, current) =>
          current.revenue > best.revenue ? current : best
        )
      : null;
    

const clearAllData = async () => {
  if (!confirm("Are you sure you want to clear all data?")) {
    return;
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Please login first.");
      return;
    }

    const salesResponse = await fetch("/api/sales", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({}),
    });

    if (!salesResponse.ok) {
      const data = await salesResponse.json();
      throw new Error(data.error || "Failed to clear sales");
    }

    const expenseResponse = await fetch("/api/expenses", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({}),
    });

    if (!expenseResponse.ok) {
      const data = await expenseResponse.json();
      throw new Error(data.error || "Failed to clear expenses");
    }

    setSales([]);
    setExpenseHistory([]);

    setExpenses({
      expenseDate: new Date().toISOString().split("T")[0],
      staffSalary: 0,
      rent: 0,
      electricity: 0,
      water: 0,
      rawMaterials: 0,
      otherExpenses: 0,
    });

    alert("All your sales and expenses have been cleared.");
  } catch (error) {
    console.error("Clear data error:", error);
    alert("Could not clear all data.");
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
  } else {
    window.location.href = "/login";
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

  <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">

    {/* Sidebar */}
    <div className="w-64 shrink-0 border-r border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">

     <div className="mb-8 border-b border-slate-100 pb-5">
  <div className="flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-2xl text-white">
      🍽️
    </div>
    <div>
      <h2 className="text-base font-bold text-slate-900">
        Restaurant
      </h2>
      <p className="text-xs text-slate-500">
        Analytics Platform
      </p>
    </div>
  </div>
</div>
      <ul className="space-y-4">
        <li
  onClick={() => navigateToMenu("dashboard")}
  className={`cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition ${
    activeMenu === "dashboard"
      ? "bg-blue-50 text-blue-700"
      : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
  }`}
>
  📊 Dashboard
</li>

        
<li
  onClick={() => navigateToMenu("menu")}
  className={`cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition ${
    activeMenu === "menu"
      ? "bg-blue-50 text-blue-700"
      : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
  }`}
>
  🍔 Menu Management
</li>


       
<li
  onClick={() => navigateToMenu("expenses")}
  className={`cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition ${
    activeMenu === "expenses"
      ? "bg-blue-50 text-blue-700"
      : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
  }`}
>
  💰 Expenses
</li>


       
<li
  onClick={() => navigateToMenu("reports")}
  className={`cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition ${
    activeMenu === "reports"
      ? "bg-blue-50 text-blue-700"
      : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
  }`}
>
  📈 Reports
</li>


        
<li
  onClick={() => navigateToMenu("export")}
  className={`cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition ${
    activeMenu === "export"
      ? "bg-blue-50 text-blue-700"
      : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
  }`}
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
    <div className="min-w-0 flex-1 p-5 md:p-8">
      {/* Main Content */}

  {/* Dashboard Header */}
  <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-700 dark:bg-slate-900">
  <div>
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
      Restaurant Management System
    </p>

   <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-slate-100">
  Monthly Turnover Analyzer
</h1>

    <p className="mt-2 text-sm text-slate-500">
      Monitor sales, expenses, profit and restaurant performance.
    </p>
  </div>

 <div className="flex flex-wrap items-center gap-3">
  <ThemeToggle />

  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
    <span className="h-2 w-2 rounded-full bg-emerald-500" />
    Business Overview
  </div>
</div>
</div>

    

    {activeMenu === "dashboard" && (
<>

{/* Menu Card and Sales Entry - Responsive Layout */}
<div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">

  {/* Menu Card */}
  <div className="min-w-0">
    <MenuCard
      onSelect={(item) => setSelectedMenuItem(item)}
    />
  </div>

  {/* Add Sales Entry */}
  <div className="min-w-0">
    <MenuForm
      onAddSale={handleAddSale}
      selectedMenuItem={selectedMenuItem}
    />
  </div>

</div>



  {/* Sales Table */}
  <div className="mt-6">
    <SalesTable
  sales={filteredSales}
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
/>
  </div>


  {/* Monthly Expenses */}
  <div className="mt-6">
    <ExpenseForm
      onSaveExpenses={handleSaveExpenses}
    />
  </div>
  <div className="mt-6">
  <ExpenseTable
    expenses={filteredExpenses}
    selectedDate={selectedExpenseDate}
    onDateChange={setSelectedExpenseDate}
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
  <div className="mt-6">
  <MonthlyPerformance
    sales={sales}
    expenses={expenseHistory}
  />
</div>
<div className="mt-6">
  <MenuPerformance sales={sales} />
</div>

<div className="mt-6">
  <BusinessInsights
    sales={sales}
    expenses={expenseHistory}
  />
</div>
<div className="mt-6">
  <InventoryManagement />
</div>


</>
)}
      {activeMenu === "menu" && (
        <MenuManagement />
      )}

      {activeMenu === "expenses" && (
  <>
    <h2 className="text-3xl font-bold mb-6">
      💰 Expenses
    </h2>

    <ExpenseForm
      onSaveExpenses={handleSaveExpenses}
    />

    <div className="mt-6">
      <ExpenseTable
        expenses={filteredExpenses}
        selectedDate={selectedExpenseDate}
        onDateChange={setSelectedExpenseDate}
      />
    </div>
  </>
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
         
<ExportCSV
  sales={sales}
  expenses={expenseHistory}
  totalRevenue={totalRevenue}
  totalExpenses={totalExpenses}
  totalProfit={totalProfit}
/>

<WordReport
  sales={sales}
  expenses={expenseHistory}
  totalRevenue={totalRevenue}
  totalExpenses={totalExpenses}
  totalProfit={totalProfit}
/>



 <PDFReport
  sales={filteredSales}
  expenses={filteredExpenses}
  totalRevenue={totalRevenue}
  totalExpenses={totalExpenses}
  totalProfit={totalProfit}
  selectedDate={selectedDate}
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
);
}