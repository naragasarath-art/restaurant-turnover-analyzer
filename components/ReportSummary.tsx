type Sale = {
  menuItem: string;
  category: string;
  quantity: number;
  price: number;
  revenue: number;
};

type ReportSummaryProps = {
  sales: Sale[];
};

export default function ReportSummary({
  sales,
}: ReportSummaryProps) {

  const topItems = [...sales]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">

      <h2 className="text-2xl font-bold mb-5">
        🏆 Top 5 Best Selling Items
      </h2>

      {topItems.length === 0 ? (
        <p>No sales available.</p>
      ) : (
        <table className="w-full border-collapse border">

          <thead>

            <tr className="bg-gray-100">

              <th className="border p-3">Rank</th>
              <th className="border p-3">Menu Item</th>
              <th className="border p-3">Revenue</th>

            </tr>

          </thead>

          <tbody>

            {topItems.map((item, index) => (

              <tr key={index}>

                <td className="border p-3">
                  {index + 1}
                </td>

                <td className="border p-3">
                  {item.menuItem}
                </td>

                <td className="border p-3">
                  ₹{item.revenue}
                </td>

              </tr>

            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}