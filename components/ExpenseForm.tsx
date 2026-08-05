"use client";

import { useState } from "react";

type Expense = {
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
  const [staffSalary, setStaffSalary] = useState("");
  const [rent, setRent] = useState("");
  const [electricity, setElectricity] = useState("");
  const [water, setWater] = useState("");
  const [rawMaterials, setRawMaterials] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");

  const handleSave = () => {
    onSaveExpenses({
      staffSalary: Number(staffSalary || 0),
      rent: Number(rent || 0),
      electricity: Number(electricity || 0),
      water: Number(water || 0),
      rawMaterials: Number(rawMaterials || 0),
      otherExpenses: Number(otherExpenses || 0),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-5">
        Monthly Expenses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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