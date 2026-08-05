"use client";

type Props = {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  bestSellingItem: string;
};

export default function DashboardCards({
  totalRevenue,
  totalExpenses,
  totalProfit,
  bestSellingItem,
}: Props) {

  return (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">

    <div className="bg-green-500 text-white p-5 rounded-xl shadow-lg">
      <h2 className="font-bold">
        💰 Total Revenue
      </h2>

      <p className="text-3xl font-bold mt-3">
        ₹ {totalRevenue}
      </p>
    </div>


    <div className="bg-red-500 text-white p-5 rounded-xl shadow-lg">
      <h2 className="font-bold">
        📉 Total Expenses
      </h2>

      <p className="text-3xl font-bold mt-3">
        ₹ {totalExpenses}
      </p>
    </div>


    <div className="bg-blue-600 text-white p-5 rounded-xl shadow-lg">
      <h2 className="font-bold">
        📈 Total Profit
      </h2>

      <p className="text-3xl font-bold mt-3">
        ₹ {totalProfit}
      </p>
    </div>


    <div className="bg-yellow-500 text-white p-5 rounded-xl shadow-lg">
      <h2 className="font-bold">
        ⭐ Best Selling
      </h2>

      <p className="text-xl font-bold mt-3">
        {bestSellingItem}
      </p>
    </div>


  </div>
  );
}