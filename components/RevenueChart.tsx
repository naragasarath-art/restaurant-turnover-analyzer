"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Sale = {
  menuItem: string;
  category: string;
  quantity: number;
  price: number;
  revenue: number;
};

type RevenueChartProps = {
  sales: Sale[];
};

export default function RevenueChart({
  sales,
}: RevenueChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-5">
        Revenue by Menu Item
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={sales}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="menuItem" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="revenue" fill="#16a34a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}