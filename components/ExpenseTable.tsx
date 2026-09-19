"use client";

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

type ExpenseTableProps = {
  expenses: Expense[];
  selectedDate: string;
  onDateChange: (date: string) => void;
};

export default function ExpenseTable({
  expenses,
  selectedDate,
  onDateChange,
}: ExpenseTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <h2 className="text-2xl font-bold">
          Monthly Expenses
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

      {expenses.length === 0 ? (
        <p className="text-gray-500">
          No expenses found for the selected date.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3">
                  Date
                </th>
                <th className="border border-gray-300 p-3">
                  Staff Salary
                </th>
                <th className="border border-gray-300 p-3">
                  Rent
                </th>
                <th className="border border-gray-300 p-3">
                  Electricity
                </th>
                <th className="border border-gray-300 p-3">
                  Water
                </th>
                <th className="border border-gray-300 p-3">
                  Raw Materials
                </th>
                <th className="border border-gray-300 p-3">
                  Other Expenses
                </th>
                <th className="border border-gray-300 p-3">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense, index) => {
                const total =
                  expense.staffSalary +
                  expense.rent +
                  expense.electricity +
                  expense.water +
                  expense.rawMaterials +
                  expense.otherExpenses;

                return (
                  <tr
                    key={`${expense.id ?? "expense"}-${expense.expenseDate}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="border border-gray-300 p-3">
                      {expense.expenseDate}
                    </td>

                    <td className="border border-gray-300 p-3">
                      ₹{expense.staffSalary}
                    </td>

                    <td className="border border-gray-300 p-3">
                      ₹{expense.rent}
                    </td>

                    <td className="border border-gray-300 p-3">
                      ₹{expense.electricity}
                    </td>

                    <td className="border border-gray-300 p-3">
                      ₹{expense.water}
                    </td>

                    <td className="border border-gray-300 p-3">
                      ₹{expense.rawMaterials}
                    </td>

                    <td className="border border-gray-300 p-3">
                      ₹{expense.otherExpenses}
                    </td>

                    <td className="border border-gray-300 p-3 font-bold">
                      ₹{total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}