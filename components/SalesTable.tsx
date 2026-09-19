"use client";

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
  selectedDate: string;
  onDateChange: (date: string) => void;
};

export default function SalesTable({
  sales,
  selectedDate,
  onDateChange,
}: SalesTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

        <h2 className="text-2xl font-bold">
          Sales Entries
        </h2>

        <div className="flex items-center gap-2">
          <label className="font-semibold">
            Select Date:
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="border rounded-lg p-2"
          />

          {selectedDate && (
            <button
              onClick={() => onDateChange("")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg"
            >
              All
            </button>
          )}
        </div>

      </div>

      {sales.length === 0 ? (
        <p className="text-gray-500">
          No sales entries found for the selected date.
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