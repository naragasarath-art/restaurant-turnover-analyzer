"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

type PDFReportProps = {
  sales: Sale[];
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
};

export default function PDFReport({
  sales,
  totalRevenue,
  totalExpenses,
  totalProfit,
}: PDFReportProps) {

  const generatePDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Restaurant Monthly Report", 14, 20);

    doc.setFontSize(12);

    doc.text(`Total Revenue : ₹${totalRevenue}`, 14, 35);
    doc.text(`Total Expenses : ₹${totalExpenses}`, 14, 43);
    doc.text(`Total Profit : ₹${totalProfit}`, 14, 51);

    autoTable(doc, {
      startY: 60,
      head: [[
        "Bill No",
        "Date",
        "Payment",
        "Menu",
        "Category",
        "Qty",
        "Price",
        "Revenue"
      ]],
      body: sales.map((sale) => [
        sale.billNumber,
        sale.date,
        sale.paymentMethod,
        sale.menuItem,
        sale.category,
        sale.quantity,
        sale.price,
        sale.revenue,
      ]),
    });

    doc.save("Restaurant_Report.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
    >
      📄 Download PDF Report
    </button>
  );
}