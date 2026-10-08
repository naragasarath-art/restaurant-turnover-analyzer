
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

    const totalRevenue = sales.reduce(
      (total, sale) => total + Number(sale.revenue || 0),
      0
    );

    const totalQuantity = sales.reduce(
      (total, sale) => total + Number(sale.quantity || 0),
      0
    );

    const escapeCSV = (value: string | number) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    // Short date format for better Excel display
    const formatDate = (date: string) => {
      const d = new Date(date);

      if (isNaN(d.getTime())) {
        return date;
      }

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);

      return `${day}-${month}-${year}`;
    };

    const reportDate = new Date();
    const generatedDate =
      `${String(reportDate.getDate()).padStart(2, "0")}-` +
      `${String(reportDate.getMonth() + 1).padStart(2, "0")}-` +
      `${reportDate.getFullYear()}`;

    const csvRows: string[] = [];

    // Report heading
    csvRows.push(`"RESTAURANT MONTHLY TURNOVER ANALYZER"`);
    csvRows.push(`"SALES REPORT"`);
    csvRows.push(`"Report Generated On","${generatedDate}"`);
    csvRows.push("");

    // Summary
    csvRows.push(`"SALES SUMMARY"`);
    csvRows.push(`"Total Sales Entries","${sales.length}"`);
    csvRows.push(`"Total Quantity Sold","${totalQuantity}"`);
    csvRows.push(
      `"Total Revenue","${totalRevenue.toFixed(2)}"`
    );
    csvRows.push("");

    // Sales details
    csvRows.push(`"SALES DETAILS"`);

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

    csvRows.push(headers.map(escapeCSV).join(","));

    sales.forEach((sale) => {
      const row = [
        sale.billNumber,
        formatDate(sale.date),
        sale.paymentMethod,
        sale.menuItem,
        sale.category,
        sale.quantity,
        Number(sale.price || 0).toFixed(2),
        Number(sale.revenue || 0).toFixed(2),
      ];

      csvRows.push(row.map(escapeCSV).join(","));
    });

    // Total revenue
    csvRows.push("");

    csvRows.push(
      [
        "",
        "",
        "",
        "",
        "",
        "",
        "TOTAL REVENUE",
        totalRevenue.toFixed(2),
      ]
        .map(escapeCSV)
        .join(",")
    );

    const csvContent = csvRows.join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
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
