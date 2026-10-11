
"use client";

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

type Sale = {
  billNumber: string;
  date: string;
  paymentMethod?: string;
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

type WordReportProps = {
  sales: Sale[];
  expenses: Expense[];
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  selectedDate?: string;
};

const money = (v: number) => `Rs. ${Number(v || 0).toFixed(2)}`;

const paragraph = (text: string, bold = false) =>
  new Paragraph({
    children: [new TextRun({ text, bold })],
    spacing: { after: 100 },
  });

const heading = (text: string) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 220, after: 120 },
  });

function makeTable(headers: string[], rows: (string | number)[][]) {
  const actualRows = rows.length ? rows : [["No records available"]];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(
          h =>
            new TableCell({
              children: [paragraph(h, true)],
              shading: { fill: "DCE6F1" },
            })
        ),
      }),
      ...actualRows.map(row =>
        new TableRow({
          children: headers.map((_, index) =>
            new TableCell({
              children: [
                paragraph(
                  row.length === 1 && row[0] === "No records available"
                    ? index === 0 ? "No records available" : ""
                    : String(row[index] ?? "")
                ),
              ],
            })
          ),
        })
      ),
    ],
  });
}

export default function WordReport({
  sales,
  expenses = [],
  totalRevenue,
  totalExpenses,
  totalProfit,
  selectedDate,
}: WordReportProps) {
  const exportWord = async () => {
    const totalQuantity = sales.reduce(
      (sum, s) => sum + Number(s.quantity || 0), 0
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

    const expenseRows = expenses.map(e => {
      const total =
        Number(e.staffSalary || 0) +
        Number(e.rent || 0) +
        Number(e.electricity || 0) +
        Number(e.water || 0) +
        Number(e.rawMaterials || 0) +
        Number(e.otherExpenses || 0);

      return [
        e.expenseDate,
        money(e.staffSalary),
        money(e.rent),
        money(e.electricity),
        money(e.water),
        money(e.rawMaterials),
        money(e.otherExpenses),
        money(total),
      ];
    });

    const doc = new Document({
      creator: "Restaurant Monthly Turnover Analyzer",
      title: "Restaurant Monthly Turnover Report",
      sections: [
        {
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "RESTAURANT MONTHLY TURNOVER ANALYZER",
                  bold: true,
                  size: 30,
                  color: "1E40AF",
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "MONTHLY BUSINESS PERFORMANCE REPORT",
                  bold: true,
                  size: 22,
                }),
              ],
              spacing: { after: 200 },
            }),

            paragraph(`Generated on: ${new Date().toLocaleDateString("en-IN")}`),
            paragraph(`Report period: ${selectedDate || "All available dates"}`),

            heading("1. Sales Entries"),
            paragraph(`Total sales entries: ${sales.length}`),
            paragraph(`Total quantity sold: ${totalQuantity}`),
            makeTable(
              ["Bill Number", "Date", "Payment", "Menu Item", "Category", "Qty", "Price", "Revenue"],
              sales.map(s => [
                s.billNumber, s.date, s.paymentMethod || "",
                s.menuItem, s.category, s.quantity,
                money(s.price), money(s.revenue),
              ])
            ),

            heading("2. Monthly Expenses"),
            makeTable(
              ["Expense Date", "Salary", "Rent", "Electricity", "Water", "Materials", "Other", "Total"],
              expenseRows
            ),
            paragraph(`Total expenses: ${money(totalExpenses)}`, true),

            heading("3. Business Overview"),
            makeTable(["Metric", "Value"], [
              ["Total Revenue", money(totalRevenue)],
              ["Total Expenses", money(totalExpenses)],
              [totalProfit >= 0 ? "Net Profit" : "Net Loss", money(Math.abs(totalProfit))],
              ["Best-Selling Item (highest revenue entry)", bestSelling?.menuItem || "No sales data"],
              ["Total Sales Entries", sales.length],
              ["Total Items Sold", totalQuantity],
            ]),

            heading("4. Monthly Turnover Prediction"),
            paragraph(
              "Prediction method: estimated 10% revenue growth assumption. This is an estimate, not a guarantee."
            ),
            makeTable(["Prediction Metric", "Value"], [
              ["Current Revenue", money(totalRevenue)],
              ["Estimated Growth", "10%"],
              ["Predicted Next-Month Turnover", money(predictedRevenue)],
              ["Indicative Profit if Expenses Stay Unchanged", money(predictedProfit)],
            ]),

            heading("5. Monthly Report"),
            makeTable(["Monthly Summary", "Value"], [
              ["Report Period", selectedDate || "All available dates"],
              ["Revenue", money(totalRevenue)],
              ["Expenses", money(totalExpenses)],
              [totalProfit >= 0 ? "Profit" : "Loss", money(Math.abs(totalProfit))],
              ["Business Performance", performance],
            ]),

            new Paragraph({
              text: "End of Report",
              alignment: AlignmentType.CENTER,
              spacing: { before: 300 },
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);

    saveAs(
      blob,
      selectedDate
        ? `Restaurant_Turnover_Report_${selectedDate}.docx`
        : "Restaurant_Monthly_Turnover_Report.docx"
    );
  };

  return (
    <button
      onClick={exportWord}
      className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
    >
      📝 Download Complete Word Report
    </button>
  );
}
