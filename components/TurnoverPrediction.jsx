"use client";

export default function TurnoverPrediction({
  totalRevenue,
  totalProfit
}) {

  const growthRate = 10; // estimated growth percentage

  const predictedRevenue =
    totalRevenue + (totalRevenue * growthRate) / 100;

  let status = "Average Performance";

  if (totalProfit > 0 && predictedRevenue > totalRevenue) {
    status = "Good Performance";
  }

  if (totalProfit < 0) {
    status = "Need Improvement";
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">

      <h2 className="text-2xl font-bold mb-4">
        📈 Monthly Turnover Prediction
      </h2>

      <p>
        Current Revenue:
        <b> ₹ {totalRevenue}</b>
      </p>

      <p>
        Expected Growth:
        <b> {growthRate}%</b>
      </p>

      <p>
        Predicted Next Month Revenue:
        <b> ₹ {predictedRevenue}</b>
      </p>

      <p className="mt-3">
        Business Status:
        <b> {status}</b>
      </p>

    </div>
  );
}