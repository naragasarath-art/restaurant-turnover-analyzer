type DashboardCardsProps = {
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
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">

      <div className="bg-green-500 text-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold">💰 Total Revenue</h3>
        <p className="text-3xl font-bold mt-3">
          ₹{totalRevenue}
        </p>
      </div>

      <div className="bg-red-500 text-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold">💸 Total Expenses</h3>
        <p className="text-3xl font-bold mt-3">
          ₹{totalExpenses}
        </p>
      </div>

      <div className="bg-blue-600 text-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold">📈 Net Profit</h3>
        <p className="text-3xl font-bold mt-3">
          ₹{totalProfit}
        </p>
      </div>

      <div className="bg-yellow-500 text-black rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold">
          🏆 Best Seller
        </h3>

        <p className="text-2xl font-bold mt-3">
          {bestSellingItem}
        </p>
      </div>

    </div>
  );
}