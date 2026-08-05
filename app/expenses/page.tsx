"use client";

import { useState, useEffect } from "react";

export default function ExpensesPage() {

  const [expenses, setExpenses] = useState({
    staffSalary: 0,
    rent: 0,
    electricity: 0,
    water: 0,
    rawMaterials: 0,
    otherExpenses: 0,
  });


  useEffect(() => {
    const saved = localStorage.getItem("expenses");

    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);


  const handleChange = (name: string, value: string) => {
    setExpenses({
      ...expenses,
      [name]: Number(value),
    });
  };


  const saveExpenses = () => {

    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses)
    );

    alert("Expenses Saved");
  };


  const totalExpense =
    expenses.staffSalary +
    expenses.rent +
    expenses.electricity +
    expenses.water +
    expenses.rawMaterials +
    expenses.otherExpenses;


  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6">
        💰 Expense Management
      </h1>


      <div className="bg-white p-6 rounded-lg shadow">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


          <input
            type="number"
            placeholder="💼 Staff Salary"
            onChange={(e)=>handleChange("staffSalary", e.target.value)}
            className="border p-3 rounded-lg"
          />


          <input
            type="number"
            placeholder="🏠 Rent"
            onChange={(e)=>handleChange("rent", e.target.value)}
            className="border p-3 rounded-lg"
          />


          <input
            type="number"
            placeholder="⚡ Electricity Bill"
            onChange={(e)=>handleChange("electricity", e.target.value)}
            className="border p-3 rounded-lg"
          />


          <input
            type="number"
            placeholder="💧 Water Bill"
            onChange={(e)=>handleChange("water", e.target.value)}
            className="border p-3 rounded-lg"
          />


          <input
            type="number"
            placeholder="🥦 Raw Materials"
            onChange={(e)=>handleChange("rawMaterials", e.target.value)}
            className="border p-3 rounded-lg"
          />


          <input
            type="number"
            placeholder="📦 Other Expenses"
            onChange={(e)=>handleChange("otherExpenses", e.target.value)}
            className="border p-3 rounded-lg"
          />


        </div>


        <button
          onClick={saveExpenses}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Save Expenses
        </button>


      </div>


      <div className="bg-white mt-6 p-6 rounded-lg shadow">

        <h2 className="text-xl font-bold">
          Total Expenses
        </h2>

        <p className="text-2xl">
          ₹ {totalExpense}
        </p>

      </div>


    </div>
  );
}