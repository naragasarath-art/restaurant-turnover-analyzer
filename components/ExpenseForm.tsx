"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Expense = {
  expenseDate: string;
  staffSalary: number;
  rent: number;
  electricity: number;
  water: number;
  rawMaterials: number;
  otherExpenses: number;
};

type ExpenseFormProps = {
  onSaveExpenses: (expense: Expense) => void;
};

export default function ExpenseForm({
  onSaveExpenses,
}: ExpenseFormProps) {
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [staffSalary, setStaffSalary] = useState("");
  const [rent, setRent] = useState("");
  const [electricity, setElectricity] = useState("");
  const [water, setWater] = useState("");
  const [rawMaterials, setRawMaterials] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");

  const handleSave = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Please login first.");
        return;
      }

      if (!expenseDate) {
        alert("Please select an expense date.");
        return;
      }

      const expense = {
        expenseDate,
        staffSalary: Number(staffSalary || 0),
        rent: Number(rent || 0),
        electricity: Number(electricity || 0),
        water: Number(water || 0),
        rawMaterials: Number(rawMaterials || 0),
        otherExpenses: Number(otherExpenses || 0),
      };

      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(expense),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save expenses");
      }

      onSaveExpenses(expense);

      alert("Expenses saved successfully!");
    } catch (error) {
      console.error("Expense save error:", error);
      alert("Could not save expenses.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-5">
        Monthly Expenses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Expense Date */}
        <div className="flex flex-col">
          <label className="font-semibold mb-2">
            Expense Date
          </label>

          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="border rounded-lg p-3"
          />
        </div>

        <input
          type="number"
          placeholder="Staff Salary"
          value={staffSalary}
          onChange={(e) => setStaffSalary(e.target.value)}
          className="border rounded-lg p-3"
        />

        <input
          type="number"
          placeholder="Rent"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          className="border rounded-lg p-3"
        />

        <input
          type="number"
          placeholder="Electricity Bill"
          value={electricity}
          onChange={(e) => setElectricity(e.target.value)}
          className="border rounded-lg p-3"
        />

        <input
          type="number"
          placeholder="Water Bill"
          value={water}
          onChange={(e) => setWater(e.target.value)}
          className="border rounded-lg p-3"
        />

        <input
          type="number"
          placeholder="Raw Material Cost"
          value={rawMaterials}
          onChange={(e) => setRawMaterials(e.target.value)}
          className="border rounded-lg p-3"
        />

        <input
          type="number"
          placeholder="Other Expenses"
          value={otherExpenses}
          onChange={(e) => setOtherExpenses(e.target.value)}
          className="border rounded-lg p-3"
        />

      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
      >
        Save Expenses
      </button>
    </div>
  );
}