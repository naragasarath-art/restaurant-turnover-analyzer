"use client";

import { useEffect, useState } from "react";
import ExpenseForm from "../../components/ExpenseForm";
import ExpenseTable from "../../components/ExpenseTable";

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

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedDate, setSelectedDate] = useState("");

  const loadExpenses = async () => {
    try {
      const response = await fetch("/api/expenses", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      const formattedExpenses = Array.isArray(data)
        ? data.map((expense: any) => ({
            id: expense.id,
            expenseDate: expense.expense_date,
            staffSalary: Number(expense.staff_salary) || 0,
            rent: Number(expense.rent) || 0,
            electricity: Number(expense.electricity) || 0,
            water: Number(expense.water) || 0,
            rawMaterials: Number(expense.raw_materials) || 0,
            otherExpenses: Number(expense.other_expenses) || 0,
          }))
        : [];

      setExpenses(formattedExpenses);
    } catch (error) {
      console.error("Expense loading error:", error);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleSaveExpenses = (expense: Expense) => {
    setExpenses((prev) => {
      const existing = prev.find(
        (item) => item.expenseDate === expense.expenseDate
      );

      if (existing) {
        return prev.map((item) =>
          item.expenseDate === expense.expenseDate
            ? { ...expense, id: existing.id }
            : item
        );
      }

      return [...prev, expense];
    });
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      selectedDate === "" || expense.expenseDate === selectedDate
  );

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        💰 Expenses
      </h1>

      <ExpenseForm
        onSaveExpenses={handleSaveExpenses}
      />

      <div className="mt-6">
        <ExpenseTable
          expenses={filteredExpenses}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
    </main>
  );
}