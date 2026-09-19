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

    doc.setFontSize(20);
    doc.text("Restaurant Monthly Turnover Report", 14, 20);

    doc.setFontSize(12);

    if (selectedDate) {
      doc.text(`Selected Date : ${selectedDate}`, 14, 30);
    } else {
      doc.text("Selected Date : All Dates", 14, 30);
    }

    const selectedRevenue = sales.reduce(
      (sum, sale) => sum + sale.revenue,
      0
    );

    doc.text(
      `Sales Revenue : ₹${selectedRevenue.toFixed(2)}`,
      14,
      42
    );

    autoTable(doc, {
      startY: 52,
      head: [[
        "Bill No",
        "Date",
        "Payment",
        "Menu",
        "Category",
        "Qty",
        "Price",
        "Revenue",
      ]],
      body: sales.map((sale) => [
        sale.billNumber,
        sale.date,
        sale.paymentMethod,
        sale.menuItem,
        sale.category,
        sale.quantity,
        `₹${Number(sale.price).toFixed(2)}`,
        `₹${Number(sale.revenue).toFixed(2)}`,
      ]),
      styles: {
        fontSize: 7,
      },
      headStyles: {
        fontSize: 7,
      },
    });

    const salesTableEndY =
      (doc as any).lastAutoTable?.finalY || 52;

    let expenseStartY = salesTableEndY + 15;

    if (expenseStartY > 240) {
      doc.addPage();
      expenseStartY = 20;
    }

    doc.setFontSize(16);
    doc.text("Expense Details", 14, expenseStartY);

    const expenseRows = expenses.map((expense) => {
      const rowTotal =
        Number(expense.staffSalary || 0) +
        Number(expense.rent || 0) +
        Number(expense.electricity || 0) +
        Number(expense.water || 0) +
        Number(expense.rawMaterials || 0) +
        Number(expense.otherExpenses || 0);

      return [
        expense.expenseDate,
        `₹${Number(expense.staffSalary || 0).toFixed(2)}`,
        `₹${Number(expense.rent || 0).toFixed(2)}`,
        `₹${Number(expense.electricity || 0).toFixed(2)}`,
        `₹${Number(expense.water || 0).toFixed(2)}`,
        `₹${Number(expense.rawMaterials || 0).toFixed(2)}`,
        `₹${Number(expense.otherExpenses || 0).toFixed(2)}`,
        `₹${rowTotal.toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      startY: expenseStartY + 8,
      head: [[
        "Date",
        "Staff Salary",
        "Rent",
        "Electricity",
        "Water",
        "Raw Materials",
        "Other",
        "Total",
      ]],
      body: expenseRows,
      styles: {
        fontSize: 6.5,
      },
      headStyles: {
        fontSize: 6.5,
      },
    });

    const expenseTableEndY =
      (doc as any).lastAutoTable?.finalY ||
      expenseStartY + 30;

    let summaryY = expenseTableEndY + 15;

    if (summaryY > 250) {
      doc.addPage();
      summaryY = 20;
    }

    doc.setFontSize(14);

    doc.text(
      `Total Revenue : ₹${Number(totalRevenue).toFixed(2)}`,
      14,
      summaryY
    );

    doc.text(
      `Total Expenses : ₹${Number(totalExpenses).toFixed(2)}`,
      14,
      summaryY + 10
    );

    doc.text(
      `Total Profit : ₹${Number(totalProfit).toFixed(2)}`,
      14,
      summaryY + 20
    );

    const fileName = selectedDate
      ? `Restaurant_Report_${selectedDate}.pdf`
      : "Restaurant_Monthly_Turnover_Report.pdf";

    doc.save(fileName);
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