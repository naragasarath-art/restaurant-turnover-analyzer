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

type SalesTableProps = {
  sales: Sale[];
};

export default function SalesTable({ sales }: SalesTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">

      <h2 className="text-2xl font-bold mb-5">
        Sales Entries
      </h2>

      {sales.length === 0 ? (
        <p className="text-gray-500">
          No menu items added yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">

            <thead className="bg-gray-100">

              <tr>
                <th className="border p-3">Bill No</th>
                <th className="border p-3">Date</th>
                <th className="border p-3">Payment</th>
                <th className="border p-3">Menu Item</th>
                <th className="border p-3">Category</th>
                <th className="border p-3">Quantity</th>
                <th className="border p-3">Price (₹)</th>
                <th className="border p-3">Revenue (₹)</th>
              </tr>

            </thead>

            <tbody>

              {sales.map((sale, index) => (

                <tr key={index}>

                  <td className="border p-3">
                    {sale.billNumber}
                  </td>

                  <td className="border p-3">
                    {sale.date}
                  </td>

                  <td className="border p-3">
                    {sale.paymentMethod}
                  </td>

                  <td className="border p-3">
                    {sale.menuItem}
                  </td>

                  <td className="border p-3">
                    {sale.category}
                  </td>

                  <td className="border p-3">
                    {sale.quantity}
                  </td>

                  <td className="border p-3">
                    ₹{sale.price}
                  </td>

                  <td className="border p-3 font-semibold text-green-600">
                    ₹{sale.revenue}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}