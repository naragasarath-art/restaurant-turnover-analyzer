
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

type Expense = {
  id?: number;
  expenseDate: string;
  staffSalary: number;
  rent: number;
  electricity: number;
  water: number;
  rawMaterials: number;
  otherExpenses: number;
};

type PDFReportProps = {
  sales: Sale[];
  expenses: Expense[];
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  selectedDate?: string;
};

const money = (value: number) =>
  `Rs. ${Number(value || 0).toFixed(2)}`;

export default function PDFReport({
  sales,
  expenses = [],
  totalRevenue,
  totalExpenses,
  totalProfit,
  selectedDate,
}: PDFReportProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const totalQuantity = sales.reduce(
      (sum, sale) => sum + Number(sale.quantity || 0), 0
    );

    const bestSelling = sales.length
      ? sales.reduce((best, current) =>
          current.revenue > best.revenue ? current : best
        )
      : null;

    const predictedRevenue = totalRevenue * 1.1;
    const predictedProfit = predictedRevenue - totalExpenses;

    const performance =
      totalProfit > 50000 ? "Excellent" :
      totalProfit > 20000 ? "Good" :
      totalProfit > 0 ? "Positive" :
      "Needs Improvement";

    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageWidth, 34, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(
      "RESTAURANT MONTHLY TURNOVER ANALYZER",
      pageWidth / 2, 14, { align: "center" }
    );
    doc.setFontSize(12);
    doc.text(
      "Monthly Business Performance Report",
      pageWidth / 2, 23, { align: "center" }
    );

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")} | Period: ${selectedDate || "All available dates"}`,
      14, 43
    );

    // 1. Sales Entries
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("1. SALES ENTRIES", 14, 54);

    autoTable(doc, {
      startY: 60,
      head: [[
        "Bill Number", "Date", "Payment", "Menu Item",
        "Category", "Qty", "Price", "Revenue"
      ]],
      body: sales.length
        ? sales.map(s => [
            s.billNumber, s.date, s.paymentMethod || "",
            s.menuItem, s.category, String(s.quantity),
            money(s.price), money(s.revenue)
          ])
        : [["No sales records", "", "", "", "", "", "", ""]],
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [30, 64, 175] },
    });

    let y = ((doc as any).lastAutoTable?.finalY || 70) + 10;

    // 2. Monthly Expenses
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("2. MONTHLY EXPENSES", 14, y);

    autoTable(doc, {
      startY: y + 5,
      head: [[
        "Expense Date", "Salary", "Rent", "Electricity",
        "Water", "Materials", "Other", "Total"
      ]],
      body: expenses.length
        ? expenses.map(e => {
            const total =
              Number(e.staffSalary || 0) +
              Number(e.rent || 0) +
              Number(e.electricity || 0) +
              Number(e.water || 0) +
              Number(e.rawMaterials || 0) +
              Number(e.otherExpenses || 0);

            return [
              e.expenseDate, money(e.staffSalary), money(e.rent),
              money(e.electricity), money(e.water),
              money(e.rawMaterials), money(e.otherExpenses),
              money(total)
            ];
          })
        : [["No expense records", "", "", "", "", "", "", ""]],
      foot: [["TOTAL", "", "", "", "", "", "", money(totalExpenses)]],
      theme: "grid",
      styles: { fontSize: 6.5, cellPadding: 2 },
      headStyles: { fillColor: [30, 64, 175] },
    });

    y = ((doc as any).lastAutoTable?.finalY || y + 15) + 10;

    // 3. Business Overview
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("3. BUSINESS OVERVIEW", 14, y);

    autoTable(doc, {
      startY: y + 5,
      body: [
        ["Total Revenue", money(totalRevenue)],
        ["Total Expenses", money(totalExpenses)],
        [totalProfit >= 0 ? "Net Profit" : "Net Loss", money(Math.abs(totalProfit))],
        ["Best-Selling Item (highest revenue entry)", bestSelling?.menuItem || "No sales data"],
        ["Total Sales Entries", String(sales.length)],
        ["Total Items Sold", String(totalQuantity)],
      ],
      theme: "striped",
      styles: { fontSize: 9, cellPadding: 3 },
    });

    y = ((doc as any).lastAutoTable?.finalY || y + 25) + 10;

    // 4. Monthly Turnover Prediction
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("4. MONTHLY TURNOVER PREDICTION", 14, y);

    autoTable(doc, {
      startY: y + 5,
      body: [
        ["Prediction Method", "Estimated 10% revenue growth assumption"],
        ["Current Revenue", money(totalRevenue)],
        ["Predicted Turnover", money(predictedRevenue)],
        ["Indicative Profit if Expenses Stay Unchanged", money(predictedProfit)],
        ["Note", "Estimate only; not a guaranteed result"],
      ],
      theme: "striped",
      styles: { fontSize: 9, cellPadding: 3 },
    });

    y = ((doc as any).lastAutoTable?.finalY || y + 25) + 10;

    // 5. Monthly Report
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("5. MONTHLY REPORT", 14, y);

    autoTable(doc, {
      startY: y + 5,
      body: [
        ["Report Period", selectedDate || "All available dates"],
        ["Revenue", money(totalRevenue)],
        ["Expenses", money(totalExpenses)],
        [totalProfit >= 0 ? "Profit" : "Loss", money(Math.abs(totalProfit))],
        ["Business Performance", performance],
      ],
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3 },
    });

    doc.save(
      selectedDate
        ? `Restaurant_Turnover_Report_${selectedDate}.pdf`
        : "Restaurant_Monthly_Turnover_Report.pdf"
    );
  };

  return (
    <button
      onClick={generatePDF}
      className="rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
    >
      📄 Download Complete PDF Report
    </button>
  );
}
