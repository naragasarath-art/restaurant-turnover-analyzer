type Sale = {
  menuItem: string;
  category: string;
  quantity: number;
  price: number;
  revenue: number;
};

type MonthlyReportProps = {
  sales: Sale[];
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
};

export default function MonthlyReport({
  sales,
  totalRevenue,
  totalExpenses,
  totalProfit,
}: MonthlyReportProps) {

  const totalItemsSold = sales.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const bestSellingItem =
    sales.length > 0
      ? sales.reduce((best, current) =>
          current.revenue > best.revenue ? current : best
        )
      : null;

  let performance = "Needs Improvement";

  if (totalProfit > 50000) {
    performance = "Excellent";
  } else if (totalProfit > 20000) {
    performance = "Good";
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">

      <h2 className="text-2xl font-bold mb-5">
        📋 Monthly Business Report
      </h2>

      <table className="w-full border-collapse border">

        <tbody>

          <tr>
            <td className="border p-3 font-semibold">
              Total Revenue
            </td>

            <td className="border p-3">
              ₹{totalRevenue}
            </td>
          </tr>

          <tr>
            <td className="border p-3 font-semibold">
              Total Expenses
            </td>

            <td className="border p-3">
              ₹{totalExpenses}
            </td>
          </tr>

          <tr>
            <td className="border p-3 font-semibold">
              Net Profit
            </td>

            <td className="border p-3">
              ₹{totalProfit}
            </td>
          </tr>

          <tr>
            <td className="border p-3 font-semibold">
              Total Items Sold
            </td>

            <td className="border p-3">
              {totalItemsSold}
            </td>
          </tr>

          <tr>
            <td className="border p-3 font-semibold">
              Best Selling Item
            </td>

            <td className="border p-3">
              {bestSellingItem
                ? bestSellingItem.menuItem
                : "No Data"}
            </td>
          </tr>

          <tr>
            <td className="border p-3 font-semibold">
              Business Performance
            </td>

            <td className="border p-3 font-bold">
              {performance}
            </td>
          </tr>

        </tbody>

      </table>

    </div>
  );
}