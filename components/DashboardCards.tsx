
"use client";

type Props = {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  bestSellingItem: string;
};

export default function DashboardCards({
  totalRevenue,
  totalExpenses,
  totalProfit,
  bestSellingItem,
}: Props) {
  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: "↗",
      description: "Total sales generated",
      iconStyle: "bg-emerald-50 text-emerald-700",
      valueStyle: "text-slate-900",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: "₹",
      description: "Recorded operating expenses",
      iconStyle: "bg-rose-50 text-rose-700",
      valueStyle: "text-slate-900",
    },
    {
      title: "Total Profit",
      value: formatCurrency(totalProfit),
      icon: "◆",
      description: "Revenue minus expenses",
      iconStyle: "bg-blue-50 text-blue-700",
      valueStyle:
        totalProfit < 0 ? "text-rose-700" : "text-slate-900",
    },
    {
      title: "Best-Selling Item",
      value: bestSellingItem,
      icon: "★",
      description: "Top item by recorded sale revenue",
      iconStyle: "bg-amber-50 text-amber-700",
      valueStyle: "text-slate-900",
    },
  ];

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Business Overview
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          A quick summary of your restaurant's performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <p
                  className={`mt-4 break-words text-2xl font-bold tracking-tight sm:text-3xl ${card.valueStyle}`}
                >
                  {card.value}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${card.iconStyle}`}
                aria-hidden="true"
              >
                {card.icon}
              </div>
            </div>

            <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

