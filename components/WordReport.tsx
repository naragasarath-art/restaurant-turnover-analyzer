
"use client";

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
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
  staffSalary?: number;
  rent?: number;
  electricity?: number;
  water?: number;
  rawMaterials?: number;
  otherExpenses?: number;
};

type WordReportProps = {
  sales: Sale[];
};

export default function WordReport({ sales }: WordReportProps) {
  const exportWord = async () => {
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

    // Get expense details from localStorage
    let expense: Expense = {};

    try {
      const savedExpenses = localStorage.getItem("expenses");

      if (savedExpenses) {
        const parsedExpenses = JSON.parse(savedExpenses);

        // Supports both object and array expense storage
        if (Array.isArray(parsedExpenses)) {
          expense = parsedExpenses.reduce(
            (total, item) => ({
              staffSalary:
                Number(total.staffSalary || 0) +
                Number(item.staffSalary || 0),
              rent:
                Number(total.rent || 0) +
                Number(item.rent || 0),
              electricity:
                Number(total.electricity || 0) +
                Number(item.electricity || 0),
              water:
                Number(total.water || 0) +
                Number(item.water || 0),
              rawMaterials:
                Number(total.rawMaterials || 0) +
                Number(item.rawMaterials || 0),
              otherExpenses:
                Number(total.otherExpenses || 0) +
                Number(item.otherExpenses || 0),
            }),
            {}
          );
        } else {
          expense = parsedExpenses;
        }
      }
    } catch (error) {
      console.error("Error reading expenses:", error);
    }

    const staffSalary = Number(expense.staffSalary || 0);
    const rent = Number(expense.rent || 0);
    const electricity = Number(expense.electricity || 0);
    const water = Number(expense.water || 0);
    const rawMaterials = Number(expense.rawMaterials || 0);
    const otherExpenses = Number(expense.otherExpenses || 0);

    const totalExpenses =
      staffSalary +
      rent +
      electricity +
      water +
      rawMaterials +
      otherExpenses;

    const netProfit = totalRevenue - totalExpenses;

    const tableRows = [
      new TableRow({
        children: [
          "Bill Number",
          "Date",
          "Payment Method",
          "Menu Item",
          "Category",
          "Quantity",
          "Price",
          "Revenue",
        ].map(
          (header) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: header,
                      bold: true,
                    }),
                  ],
                }),
              ],
            })
        ),
      }),

      ...sales.map(
        (sale) =>
          new TableRow({
            children: [
              sale.billNumber,
              sale.date,
              sale.paymentMethod || "",
              sale.menuItem,
              sale.category,
              String(sale.quantity),
              `Rs. ${Number(sale.price || 0).toFixed(2)}`,
              `Rs. ${Number(sale.revenue || 0).toFixed(2)}`,
            ].map(
              (value) =>
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun(String(value))],
                    }),
                  ],
                })
            ),
          })
      ),
    ];

    // Expense details table
    const expenseRows = [
      ["Staff Salary", staffSalary],
      ["Rent", rent],
      ["Electricity", electricity],
      ["Water", water],
      ["Raw Materials", rawMaterials],
      ["Other Expenses", otherExpenses],
    ].map(
      ([name, amount]) =>
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: String(name),
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: `Rs. ${Number(amount).toFixed(2)}`,
                }),
              ],
            }),
          ],
        })
    );

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              alignment: "center",
              children: [
                new TextRun({
                  text: "RESTAURANT MONTHLY TURNOVER ANALYZER",
                  bold: true,
                  size: 28,
                }),
              ],
            }),

            new Paragraph({
              alignment: "center",
              children: [
                new TextRun({
                  text: "SALES AND EXPENSES REPORT",
                  bold: true,
                  size: 24,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Report Generated On: ${new Date().toLocaleDateString(
                    "en-IN"
                  )}`,
                }),
              ],
            }),

            new Paragraph({ text: "" }),

            // SALES SUMMARY
            new Paragraph({
              children: [
                new TextRun({
                  text: "SALES SUMMARY",
                  bold: true,
                  size: 22,
                }),
              ],
            }),

            new Paragraph({
              text: `Total Sales Entries: ${sales.length}`,
            }),

            new Paragraph({
              text: `Total Quantity Sold: ${totalQuantity}`,
            }),

            new Paragraph({
              text: `Total Revenue: Rs. ${totalRevenue.toFixed(2)}`,
            }),

            new Paragraph({ text: "" }),

            // SALES DETAILS
            new Paragraph({
              children: [
                new TextRun({
                  text: "SALES DETAILS",
                  bold: true,
                  size: 22,
                }),
              ],
            }),

            new Table({
              rows: tableRows,
            }),

            new Paragraph({ text: "" }),

            // EXPENSE DETAILS
            new Paragraph({
              children: [
                new TextRun({
                  text: "EXPENSES DETAILS",
                  bold: true,
                  size: 22,
                }),
              ],
            }),

            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Expense Category",
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Amount",
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),

                ...expenseRows,

                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "TOTAL EXPENSES",
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Rs. ${totalExpenses.toFixed(2)}`,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            new Paragraph({ text: "" }),

            // FINAL SUMMARY
            new Paragraph({
              children: [
                new TextRun({
                  text: "FINAL SUMMARY",
                  bold: true,
                  size: 22,
                }),
              ],
            }),

            new Paragraph({
              text: `Total Revenue: Rs. ${totalRevenue.toFixed(2)}`,
            }),

            new Paragraph({
              text: `Total Expenses: Rs. ${totalExpenses.toFixed(2)}`,
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Net Profit: Rs. ${netProfit.toFixed(2)}`,
                  bold: true,
                }),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);

    saveAs(blob, "Restaurant_Sales_and_Expenses_Report.docx");
  };

  return (
    <button
      onClick={exportWord}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
    >
      Export Sales & Expenses Word
    </button>
  );
}
