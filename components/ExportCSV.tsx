"use client";

import { saveAs } from "file-saver";

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

type ExportCSVProps = {
  sales: Sale[];
};

export default function ExportCSV({ sales }: ExportCSVProps) {

  const exportData = () => {

    if (sales.length === 0) {
      alert("No sales data available.");
      return;
    }

    const headers = [
      "Bill Number",
      "Date",
      "Payment Method",
      "Menu Item",
      "Category",
      "Quantity",
      "Price",
      "Revenue",
    ];

    const rows = sales.map((sale) => [
      sale.billNumber,
      sale.date,
      sale.paymentMethod,
      sale.menuItem,
      sale.category,
      sale.quantity,
      sale.price,
      sale.revenue,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, "Restaurant_Sales_Report.csv");
  };

  return (
    <button
      onClick={exportData}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
    >
      📥 Export Sales CSV
    </button>
  );
}
 