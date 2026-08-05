"use client";

import { useEffect, useState } from "react";

type Sale = {
  menuItem: string;
  revenue: number;
};


export default function ReportsPage() {

  const [sales, setSales] = useState<Sale[]>([]);

  const [expenses, setExpenses] = useState({
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


    if(savedSales){
      setSales(JSON.parse(savedSales));
    }


    if(savedExpenses){
      setExpenses(JSON.parse(savedExpenses));
    }

  }, []);



  const totalRevenue = sales.reduce(
    (sum,item)=> sum + item.revenue,
    0
  );


  const totalExpenses =
    expenses.staffSalary +
    expenses.rent +
    expenses.electricity +
    expenses.water +
    expenses.rawMaterials +
    expenses.otherExpenses;



  const totalProfit =
    totalRevenue - totalExpenses;



  const bestSellingItem =
    sales.length > 0
    ? sales.reduce(
      (best,current)=>
      current.revenue > best.revenue
      ? current
      : best
    )
    : null;



  return (

    <div className="min-h-screen bg-gray-100 p-8">


      <h1 className="text-3xl font-bold mb-6">
        📈 Business Reports
      </h1>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold">
            Total Revenue
          </h2>

          <p className="text-2xl">
            ₹ {totalRevenue}
          </p>
        </div>



        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="font-bold">
            Total Expenses
          </h2>

          <p className="text-2xl">
            ₹ {totalExpenses}
          </p>

        </div>



        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="font-bold">
            Total Profit
          </h2>

          <p className="text-2xl">
            ₹ {totalProfit}
          </p>

        </div>


      </div>




      <div className="bg-white mt-6 p-6 rounded-lg shadow">

        <h2 className="text-xl font-bold">
          ⭐ Best Selling Item
        </h2>


        <p className="mt-3">

          {
            bestSellingItem
            ? bestSellingItem.menuItem
            : "No Data"
          }

        </p>


      </div>




      <div className="bg-white mt-6 p-6 rounded-lg shadow">

        <h2 className="text-xl font-bold">
          Business Status
        </h2>


        <p className="mt-3">

          {
            totalProfit > 0
            ? "🟢 Business is Profitable"
            : "🔴 Need Improvement"
          }

        </p>

      </div>



    </div>

  );

}