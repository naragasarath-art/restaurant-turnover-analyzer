"use client";

export default function TurnoverPrediction({
  totalRevenue = 0,
  totalProfit = 0,
}) {
  // Calculate estimated growth from the profit-to-revenue ratio.
  // Limit the estimate to a range of 0% to 30%.
  const growthRate =
    totalRevenue > 0
      ? Math.min(
          30,
          Math.max(0, (totalProfit / totalRevenue) * 100)
        )
      : 0;

  // Predict next month's revenue using the estimated growth.
  const predictedRevenue =
    totalRevenue + (totalRevenue * growthRate) / 100;

  // Determine business performance.
  let status = "Average Performance";

  if (totalRevenue <= 0) {
    status = "No Revenue Data";
  } else if (totalProfit < 0) {
    status = "Need Improvement";
  } else if (totalProfit > 0 && growthRate > 0) {
    status = "Good Performance";
  }

  // Format money in Indian currency style.
  const formatCurrency = (amount) =>
    `₹ ${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">
        📈 Monthly Turnover Prediction
      </h2>

      <div className="space-y-3">
        <p>
          Current Revenue:{" "}
          <b>{formatCurrency(totalRevenue)}</b>
        </p>

        <p>
          Current Profit:{" "}
          <b>{formatCurrency(totalProfit)}</b>
        </p>

        <p>
          Expected Growth:{" "}
          <b>{growthRate.toFixed(2)}%</b>
        </p>

        <p>
          Predicted Next Month Revenue:{" "}
          <b>{formatCurrency(predictedRevenue)}</b>
        </p>

        <p className="mt-3">
          Business Status: <b>{status}</b>
        </p>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        This is an estimated growth rate based on the current
        profit-to-revenue ratio. Actual future revenue may differ.
      </p>
    </div>
  );
}
