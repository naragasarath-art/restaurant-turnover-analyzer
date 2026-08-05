"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Sale = {
  menuItem: string;
  category: string;
  quantity: number;
  price: number;
  revenue: number;
};

type CategoryChartProps = {
  sales: Sale[];
};

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
];

export default function CategoryChart({
  sales,
}: CategoryChartProps) {

  const categoryData = sales.reduce((acc, sale) => {

    const existing = acc.find(
      (item) => item.category === sale.category
    );

    if (existing) {
      existing.revenue += sale.revenue;
    } else {
      acc.push({
        category: sale.category,
        revenue: sale.revenue,
      });
    }

    return acc;

  }, [] as { category: string; revenue: number }[]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">

      <h2 className="text-2xl font-bold mb-5">
        Category-wise Revenue
      </h2>

      <ResponsiveContainer width="100%" height={350}>

        <PieChart>

          <Pie
            data={categoryData}
            dataKey="revenue"
            nameKey="category"
            outerRadius={120}
            label
          >

            {categoryData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}