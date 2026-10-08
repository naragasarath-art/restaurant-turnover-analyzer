import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ======================================================
// HELPERS
// ======================================================

function money(value: number) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

function hasAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[?!.,;:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ======================================================
// DATE HELPERS - INDIA
// ======================================================

function getIndiaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getPreviousDay(dateString: string) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);

  return date.toISOString().slice(0, 10);
}

function getPreviousMonth(monthString: string) {
  const [year, month] = monthString.split("-").map(Number);

  if (month === 1) {
    return `${year - 1}-12`;
  }

  return `${year}-${String(month - 1).padStart(2, "0")}`;
}

// ======================================================
// PERIOD DETECTION
// ======================================================

function getPeriod(question: string) {
  if (
    hasAny(question, [
      "yesterday",
      "previous day",
      "day before",
    ])
  ) {
    return "yesterday";
  }

  if (
    hasAny(question, [
      "last month",
      "previous month",
      "previous month's",
    ])
  ) {
    return "lastMonth";
  }

  if (
    hasAny(question, [
      "today",
      "today's",
      "todays",
      "this day",
      "current day",
    ])
  ) {
    return "today";
  }

  if (
    hasAny(question, [
      "this month",
      "current month",
      "this month's",
      "current month's",
      "monthly",
      "month so far",
    ])
  ) {
    return "thisMonth";
  }

  return "overall";
}

// ======================================================
// INTENT DETECTION
// ======================================================

// MENU MANAGEMENT
function isMenuCountQuestion(question: string) {
  return (
    hasAny(question, [
      "menu management",
      "menu items",
      "menu item",
      "items in menu",
"items in the menu",
"items are in menu",
"items are in the menu",
"items in the menu card",
"items are in the menu card",
"menu card",
"item in menu",
"item in the menu",
      "menu has",
      "menu contains",
      "menu currently has",
      "menu currently contains",
      "number of menu",
      "count of menu",
      "menu count",
    ]) &&
    hasAny(question, [
      "how many",
      "number",
      "count",
      "total",
      "how much",
      "many",
      "available",
      "have",
      "contains",
      "has",
    ])
  );
}

function isMenuListQuestion(question: string) {
  return (
    hasAny(question, [
      "list menu",
      "list the menu",
      "show menu",
      "show the menu",
      "what items are in menu",
      "what items are in the menu",
      "which items are in menu",
      "which items are in the menu",
      "menu items list",
      "show menu items",
    ])
  );
}

function isMenuPriceQuestion(question: string) {
  return (
    hasAny(question, [
      "price of",
      "cost of",
      "how much is",
      "how much does",
      "price for",
    ]) &&
    hasAny(question, [
      "menu",
      "item",
      "food",
      "dish",
    ])
  );
}

// SALES
function isSoldQuantityQuestion(question: string) {
  return hasAny(question, [
    "items sold",
    "item sold",
    "sold items",
    "sold item",
    "units sold",
    "quantity sold",
    "how many sold",
    "how much quantity",
    "quantity of items sold",
    "number of items sold",
  ]);
}

function isBillCountQuestion(question: string) {
  return (
    hasAny(question, [
      "bill",
      "bills",
      "billing",
      "receipt",
      "receipts",
      "invoice",
      "invoices",
      "order",
      "orders",
      "transaction",
      "transactions",
    ]) &&
    hasAny(question, [
      "how many",
      "number",
      "count",
      "total",
      "entered",
      "recorded",
      "available",
      "have",
    ])
  );
}

function isRevenueQuestion(question: string) {
  return hasAny(question, [
    "revenue",
    "turnover",
    "sales revenue",
    "sales amount",
    "sales value",
    "money made",
    "amount made",
    "money earned",
    "amount earned",
    "earned from sales",
    "made from sales",
    "income from sales",
    "total sales",
    "sales income",
  ]);
}

function isExpenseQuestion(question: string) {
  return hasAny(question, [
    "expense",
    "expenses",
    "cost",
    "costs",
    "spending",
    "spent",
    "spend",
    "money spent",
    "amount spent",
    "operating cost",
    "operating costs",
  ]);
}

function isProfitQuestion(question: string) {
  return hasAny(question, [
    "profit",
    "profits",
    "net profit",
    "profit amount",
    "money left after expenses",
    "money left after costs",
    "left after expenses",
    "left after costs",
    "profit made",
    "profit earned",
    "profitable",
  ]);
}

function isBestSellingQuestion(question: string) {
  return hasAny(question, [
    "best selling",
    "best-selling",
    "bestselling",
    "most selling",
    "most sold",
    "sold the most",
    "top selling",
    "top-selling",
    "top item",
    "most popular item",
    "most popular",
    "popular item",
  ]);
}

function isLeastSellingQuestion(question: string) {
  return hasAny(question, [
    "least selling",
    "least-selling",
    "least sold",
    "sold the least",
    "worst selling",
    "worst-selling",
    "lowest selling",
    "slowest selling",
  ]);
}

function isCategoryQuestion(question: string) {
  return (
    hasAny(question, [
      "category",
      "categories",
    ]) &&
    hasAny(question, [
      "revenue",
      "sales",
      "highest",
      "best",
      "top",
      "most",
    ])
  );
}

function isAverageBillQuestion(question: string) {
  return hasAny(question, [
    "average bill",
    "average order",
    "average spending",
    "average amount",
    "average sale",
    "average transaction",
  ]);
}

// ======================================================
// GENERAL WEBSITE QUESTIONS
// ======================================================

function isWebsiteQuestion(question: string) {
  return hasAny(question, [
    "this website",
    "this project",
    "website purpose",
    "project purpose",
    "what does this website",
    "what does this project",
    "about this website",
    "about this project",
  ]);
}

function isTechnologyQuestion(question: string) {
  return hasAny(question, [
    "technology used",
    "technologies used",
    "tech stack",
    "technology stack",
    "programming languages",
    "programming language",
    "languages used",
    "which technologies",
    "which technology",
  ]);
}

function isNextJsQuestion(question: string) {
  return hasAny(question, [
    "next.js",
    "nextjs",
    "next js",
  ]);
}

function isReactQuestion(question: string) {
  return hasAny(question, [
    "react",
  ]);
}

function isSupabaseQuestion(question: string) {
  return hasAny(question, [
    "supabase",
  ]);
}

function isVercelQuestion(question: string) {
  return hasAny(question, [
    "vercel",
  ]);
}

function isDashboardQuestion(question: string) {
  return hasAny(question, [
    "dashboard",
    "dashboard purpose",
    "what is dashboard",
    "what does dashboard",
  ]);
}

// ======================================================
// RESTAURANT DEFINITION QUESTIONS
// ======================================================

function isDefinitionQuestion(question: string) {
  return hasAny(question, [
    "what is",
    "what are",
    "define",
    "meaning of",
    "explain",
  ]);
}

// ======================================================
// POST
// ======================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = body?.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    const question = normalize(message);

    // ==================================================
    // AUTHENTICATION
    // ==================================================

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        {
          error: "Please login first.",
        },
        {
          status: 401,
        }
      );
    }

    const token = authHeader.replace(/^Bearer\s+/i, "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Your session is invalid. Please login again.",
        },
        {
          status: 401,
        }
      );
    }

    // ==================================================
    // LOAD SALES
    // ==================================================

    const {
      data: salesData,
      error: salesError,
    } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", user.id);

    if (salesError) {
      console.error("Sales error:", salesError);

      return NextResponse.json(
        {
          error: "Unable to read sales data.",
        },
        {
          status: 500,
        }
      );
    }

    // ==================================================
    // LOAD EXPENSES
    // ==================================================

    const {
      data: expensesData,
      error: expensesError,
    } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id);

    if (expensesError) {
      console.error("Expenses error:", expensesError);

      return NextResponse.json(
        {
          error: "Unable to read expense data.",
        },
        {
          status: 500,
        }
      );
    }

    // ==================================================
    // LOAD MENU MANAGEMENT ITEMS
    // ==================================================

    const {
      data: menuData,
      error: menuError,
    } = await supabase
      .from("menu_items")
      .select("id, name, category, price")
      .eq("user_id", user.id);

    if (menuError) {
      console.error("Menu error:", menuError);

      return NextResponse.json(
        {
          error: "Unable to read menu data.",
        },
        {
          status: 500,
        }
      );
    }

    const sales = salesData || [];
    const expenses = expensesData || [];
    const menuItems = menuData || [];

    // ==================================================
    // MENU COUNT
    // ==================================================

    const menuItemCount = menuItems.length;

    // ==================================================
    // DATE INFORMATION
    // ==================================================

    const today = getIndiaDate();

    const yesterday = getPreviousDay(today);

    const currentMonth = today.slice(0, 7);

    const previousMonth = getPreviousMonth(currentMonth);

    // ==================================================
    // SALES BY PERIOD
    // ==================================================

    const todaySales = sales.filter((sale: any) => {
      return String(sale.date).slice(0, 10) === today;
    });

    const yesterdaySales = sales.filter((sale: any) => {
      return String(sale.date).slice(0, 10) === yesterday;
    });

    const monthSales = sales.filter((sale: any) => {
      return String(sale.date).slice(0, 7) === currentMonth;
    });

    const lastMonthSales = sales.filter((sale: any) => {
      return String(sale.date).slice(0, 7) === previousMonth;
    });

    // ==================================================
    // EXPENSES BY PERIOD
    // ==================================================

    const todayExpenses = expenses.filter((expense: any) => {
      return (
        String(expense.expense_date).slice(0, 10) === today
      );
    });

    const yesterdayExpenses = expenses.filter((expense: any) => {
      return (
        String(expense.expense_date).slice(0, 10) === yesterday
      );
    });

    const monthExpenses = expenses.filter((expense: any) => {
      return (
        String(expense.expense_date).slice(0, 7) === currentMonth
      );
    });

    const lastMonthExpenses = expenses.filter((expense: any) => {
      return (
        String(expense.expense_date).slice(0, 7) === previousMonth
      );
    });

    // ==================================================
    // CALCULATE REVENUE
    // ==================================================

    function calculateRevenue(items: any[]) {
      return items.reduce(
        (total, sale) =>
          total + Number(sale.revenue || 0),
        0
      );
    }

    const todayRevenue = calculateRevenue(todaySales);

    const yesterdayRevenue =
      calculateRevenue(yesterdaySales);

    const monthRevenue =
      calculateRevenue(monthSales);

    const lastMonthRevenue =
      calculateRevenue(lastMonthSales);

    const totalRevenue =
      calculateRevenue(sales);

    // ==================================================
    // CALCULATE EXPENSES
    // ==================================================

    function calculateOneExpense(expense: any) {
      return (
        Number(expense.staff_salary || 0) +
        Number(expense.rent || 0) +
        Number(expense.electricity || 0) +
        Number(expense.water || 0) +
        Number(expense.raw_materials || 0) +
        Number(expense.other_expenses || 0)
      );
    }

    function calculateExpenses(items: any[]) {
      return items.reduce(
        (total, expense) =>
          total + calculateOneExpense(expense),
        0
      );
    }

    const todayExpenseTotal =
      calculateExpenses(todayExpenses);

    const yesterdayExpenseTotal =
      calculateExpenses(yesterdayExpenses);

    const monthExpenseTotal =
      calculateExpenses(monthExpenses);

    const lastMonthExpenseTotal =
      calculateExpenses(lastMonthExpenses);

    const totalExpense =
      calculateExpenses(expenses);

    // ==================================================
    // CALCULATE PROFIT
    // ==================================================

    const todayProfit =
      todayRevenue - todayExpenseTotal;

    const yesterdayProfit =
      yesterdayRevenue - yesterdayExpenseTotal;

    const monthProfit =
      monthRevenue - monthExpenseTotal;

    const lastMonthProfit =
      lastMonthRevenue - lastMonthExpenseTotal;

    const totalProfit =
      totalRevenue - totalExpense;

    // ==================================================
    // BILL COUNTER
    // ==================================================

    function countBills(items: any[]) {
      const bills = new Set<string>();

      items.forEach((sale: any) => {
        if (sale.bill_number) {
          bills.add(String(sale.bill_number));
        } else if (sale.id !== undefined) {
          bills.add(`sale-${sale.id}`);
        }
      });

      return bills.size;
    }

    const todayBills = countBills(todaySales);

    const yesterdayBills =
      countBills(yesterdaySales);

    const monthBills =
      countBills(monthSales);

    const lastMonthBills =
      countBills(lastMonthSales);

    const totalBills =
      countBills(sales);

    // ==================================================
    // SOLD QUANTITY
    // ==================================================

    function calculateQuantity(items: any[]) {
      return items.reduce(
        (total, sale) =>
          total + Number(sale.quantity || 0),
        0
      );
    }

    const todayQuantity =
      calculateQuantity(todaySales);

    const yesterdayQuantity =
      calculateQuantity(yesterdaySales);

    const monthQuantity =
      calculateQuantity(monthSales);

    const lastMonthQuantity =
      calculateQuantity(lastMonthSales);

    const totalQuantity =
      calculateQuantity(sales);

    // ==================================================
    // BEST SELLING ITEM
    // ==================================================

    const itemTotals: Record<string, number> = {};

    sales.forEach((sale: any) => {
      const itemName =
        String(sale.menu_item || "Unknown Item");

      itemTotals[itemName] =
        (itemTotals[itemName] || 0) +
        Number(sale.quantity || 0);
    });

    const sortedItems = Object.entries(itemTotals).sort(
      (a, b) => b[1] - a[1]
    );

    const bestSellingItem =
      sortedItems.length > 0
        ? sortedItems[0]
        : null;

    const leastSellingItem =
      sortedItems.length > 0
        ? sortedItems[sortedItems.length - 1]
        : null;

    // ==================================================
    // CATEGORY REVENUE
    // ==================================================

    const categoryTotals: Record<string, number> = {};

    sales.forEach((sale: any) => {
      const category =
        String(sale.category || "Other");

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(sale.revenue || 0);
    });

    const sortedCategories =
      Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1]
      );

    const bestCategory =
      sortedCategories.length > 0
        ? sortedCategories[0]
        : null;

    // ==================================================
    // AVERAGE BILL
    // ==================================================

    const averageBill =
      totalBills > 0
        ? totalRevenue / totalBills
        : 0;

    const todayAverageBill =
      todayBills > 0
        ? todayRevenue / todayBills
        : 0;

    const monthAverageBill =
      monthBills > 0
        ? monthRevenue / monthBills
        : 0;

    // ==================================================
    // DETERMINE PERIOD
    // ==================================================

    const period = getPeriod(question);

    let selectedRevenue = totalRevenue;
    let selectedExpense = totalExpense;
    let selectedProfit = totalProfit;
    let selectedBills = totalBills;
    let selectedQuantity = totalQuantity;

    if (period === "today") {
      selectedRevenue = todayRevenue;
      selectedExpense = todayExpenseTotal;
      selectedProfit = todayProfit;
      selectedBills = todayBills;
      selectedQuantity = todayQuantity;
    }

    if (period === "yesterday") {
      selectedRevenue = yesterdayRevenue;
      selectedExpense = yesterdayExpenseTotal;
      selectedProfit = yesterdayProfit;
      selectedBills = yesterdayBills;
      selectedQuantity = yesterdayQuantity;
    }

    if (period === "thisMonth") {
      selectedRevenue = monthRevenue;
      selectedExpense = monthExpenseTotal;
      selectedProfit = monthProfit;
      selectedBills = monthBills;
      selectedQuantity = monthQuantity;
    }

    if (period === "lastMonth") {
      selectedRevenue = lastMonthRevenue;
      selectedExpense = lastMonthExpenseTotal;
      selectedProfit = lastMonthProfit;
      selectedBills = lastMonthBills;
      selectedQuantity = lastMonthQuantity;
    }

    // ==================================================
    // ANSWER
    // ==================================================

    let answer = "";

    // --------------------------------------------------
    // GREETINGS
    // --------------------------------------------------

    if (
      question === "hi" ||
      question === "hello" ||
      question === "hey" ||
      question.includes("good morning") ||
      question.includes("good afternoon") ||
      question.includes("good evening")
    ) {
      answer =
        "Hello! 👋 I am your Restaurant Assistant. Ask me about your menu, sales, bills, revenue, expenses, profit, reports, or this website.";
    }

    // --------------------------------------------------
    // MENU COUNT
    // IMPORTANT: BEFORE SOLD-QUANTITY CHECK
    // --------------------------------------------------

    else if (isMenuCountQuestion(question)) {
      answer =
        `There are ${menuItemCount} menu item(s) currently available in Menu Management.`;
    }

    // --------------------------------------------------
    // MENU LIST
    // --------------------------------------------------

    else if (isMenuListQuestion(question)) {
      if (menuItems.length === 0) {
        answer =
          "There are currently no menu items in Menu Management.";
      } else {
        const names = menuItems
          .map((item: any) => item.name)
          .filter(Boolean);

        answer =
          `There are ${menuItems.length} menu item(s): ${names.join(
            ", "
          )}.`;
      }
    }

    // --------------------------------------------------
    // MENU PRICE
    // --------------------------------------------------

    else if (isMenuPriceQuestion(question)) {
      let foundItem = null;

      for (const item of menuItems) {
        const name =
          String(item.name || "").toLowerCase();

        if (
          name &&
          question.includes(name)
        ) {
          foundItem = item;
          break;
        }
      }

      if (foundItem) {
        answer =
          `The price of ${foundItem.name} is ${money(
            Number(foundItem.price || 0)
          )}.`;
      } else {
        answer =
          "I couldn't identify the menu item. Please include the menu item's name in your question.";
      }
    }

    // --------------------------------------------------
    // BILL COUNT
    // --------------------------------------------------

    else if (isBillCountQuestion(question)) {
      if (period === "today") {
        answer =
          `There are ${todayBills} bill(s) recorded today.`;
      } else if (period === "yesterday") {
        answer =
          `There were ${yesterdayBills} bill(s) recorded yesterday.`;
      } else if (period === "thisMonth") {
        answer =
          `There are ${monthBills} bill(s) recorded this month.`;
      } else if (period === "lastMonth") {
        answer =
          `There were ${lastMonthBills} bill(s) recorded last month.`;
      } else {
        answer =
          `There are ${totalBills} bill(s) recorded in the system.`;
      }
    }

    // --------------------------------------------------
    // SOLD QUANTITY
    // --------------------------------------------------

    else if (isSoldQuantityQuestion(question)) {
      if (period === "today") {
        answer =
          `${todayQuantity} item(s) were sold today.`;
      } else if (period === "yesterday") {
        answer =
          `${yesterdayQuantity} item(s) were sold yesterday.`;
      } else if (period === "thisMonth") {
        answer =
          `${monthQuantity} item(s) were sold this month.`;
      } else if (period === "lastMonth") {
        answer =
          `${lastMonthQuantity} item(s) were sold last month.`;
      } else {
        answer =
          `${totalQuantity} item(s) have been sold in the recorded sales.`;
      }
    }

    // --------------------------------------------------
    // BEST SELLING
    // --------------------------------------------------

    else if (isBestSellingQuestion(question)) {
      if (bestSellingItem) {
        answer =
          `The best-selling item is "${bestSellingItem[0]}" with ${bestSellingItem[1]} item(s) sold.`;
      } else {
        answer =
          "There are no sales records available yet.";
      }
    }

    // --------------------------------------------------
    // LEAST SELLING
    // --------------------------------------------------

    else if (isLeastSellingQuestion(question)) {
      if (leastSellingItem) {
        answer =
          `The least-selling item is "${leastSellingItem[0]}" with ${leastSellingItem[1]} item(s) sold.`;
      } else {
        answer =
          "There are no sales records available yet.";
      }
    }

    // --------------------------------------------------
    // CATEGORY
    // --------------------------------------------------

    else if (isCategoryQuestion(question)) {
      if (bestCategory) {
        answer =
          `The highest-revenue category is "${bestCategory[0]}" with ${money(
            Number(bestCategory[1])
          )} in revenue.`;
      } else {
        answer =
          "There is no category sales data available yet.";
      }
    }

    // --------------------------------------------------
    // PROFIT
    // --------------------------------------------------

    else if (isProfitQuestion(question)) {
      if (period === "today") {
        answer =
          `Today's revenue is ${money(
            todayRevenue
          )}, expenses are ${money(
            todayExpenseTotal
          )}, so today's profit is ${money(
            todayProfit
          )}.`;
      } else if (period === "yesterday") {
        answer =
          `Yesterday's revenue was ${money(
            yesterdayRevenue
          )}, expenses were ${money(
            yesterdayExpenseTotal
          )}, so the profit was ${money(
            yesterdayProfit
          )}.`;
      } else if (period === "thisMonth") {
        answer =
          `This month's revenue is ${money(
            monthRevenue
          )}, expenses are ${money(
            monthExpenseTotal
          )}, so this month's profit is ${money(
            monthProfit
          )}.`;
      } else if (period === "lastMonth") {
        answer =
          `Last month's revenue was ${money(
            lastMonthRevenue
          )}, expenses were ${money(
            lastMonthExpenseTotal
          )}, so last month's profit was ${money(
            lastMonthProfit
          )}.`;
      } else {
        answer =
          `Your total revenue is ${money(
            totalRevenue
          )}, total expenses are ${money(
            totalExpense
          )}, and total profit is ${money(
            totalProfit
          )}.`;
      }
    }

    // --------------------------------------------------
    // EXPENSES
    // --------------------------------------------------

    else if (isExpenseQuestion(question)) {
      if (period === "today") {
        answer =
          `Today's total expenses are ${money(
            todayExpenseTotal
          )}.`;
      } else if (period === "yesterday") {
        answer =
          `Yesterday's total expenses were ${money(
            yesterdayExpenseTotal
          )}.`;
      } else if (period === "thisMonth") {
        answer =
          `This month's total expenses are ${money(
            monthExpenseTotal
          )}.`;
      } else if (period === "lastMonth") {
        answer =
          `Last month's total expenses were ${money(
            lastMonthExpenseTotal
          )}.`;
      } else {
        answer =
          `Your total recorded expenses are ${money(
            totalExpense
          )}.`;
      }
    }

    // --------------------------------------------------
    // REVENUE
    // --------------------------------------------------

    else if (isRevenueQuestion(question)) {
      if (period === "today") {
        answer =
          `Today's revenue is ${money(
            todayRevenue
          )}.`;
      } else if (period === "yesterday") {
        answer =
          `Yesterday's revenue was ${money(
            yesterdayRevenue
          )}.`;
      } else if (period === "thisMonth") {
        answer =
          `This month's revenue is ${money(
            monthRevenue
          )}.`;
      } else if (period === "lastMonth") {
        answer =
          `Last month's revenue was ${money(
            lastMonthRevenue
          )}.`;
      } else {
        answer =
          `Your total recorded revenue is ${money(
            totalRevenue
          )}.`;
      }
    }

    // --------------------------------------------------
    // AVERAGE BILL
    // --------------------------------------------------

    else if (isAverageBillQuestion(question)) {
      if (period === "today") {
        answer =
          `Today's average bill amount is ${money(
            todayAverageBill
          )}.`;
      } else if (period === "thisMonth") {
        answer =
          `This month's average bill amount is ${money(
            monthAverageBill
          )}.`;
      } else {
        answer =
          `The overall average bill amount is ${money(
            averageBill
          )}.`;
      }
    }

    // --------------------------------------------------
    // WEBSITE
    // --------------------------------------------------

    else if (isWebsiteQuestion(question)) {
      answer =
        "This website is a Restaurant Monthly Turnover Analyzer. It helps manage menu items, record sales and expenses, calculate revenue and profit, and generate useful reports.";
    }

    // --------------------------------------------------
    // TECHNOLOGY
    // --------------------------------------------------

    else if (isTechnologyQuestion(question)) {
      answer =
        "The project uses Next.js and React for the web application, TypeScript and JavaScript for development, Tailwind CSS for styling, Supabase for the database and backend services, and Vercel for deployment.";
    }

    // --------------------------------------------------
    // NEXT.JS
    // --------------------------------------------------

    else if (isNextJsQuestion(question)) {
      answer =
        "Next.js is used as the main web framework. It handles the application's pages, routing, server-side functionality, API routes, and overall project structure.";
    }

    // --------------------------------------------------
    // REACT
    // --------------------------------------------------

    else if (isReactQuestion(question)) {
      answer =
        "React is used to build the interactive user interface and reusable components of the Restaurant Turnover Analyzer.";
    }

    // --------------------------------------------------
    // SUPABASE
    // --------------------------------------------------

    else if (isSupabaseQuestion(question)) {
      answer =
        "Supabase is used for the application's database and backend services. It stores information such as menu items, sales, expenses, and user-related data.";
    }

    // --------------------------------------------------
    // VERCEL
    // --------------------------------------------------

    else if (isVercelQuestion(question)) {
      answer =
        "Vercel is used to deploy and host the Restaurant Monthly Turnover Analyzer online.";
    }

    // --------------------------------------------------
    // DASHBOARD
    // --------------------------------------------------

    else if (isDashboardQuestion(question)) {
      answer =
        "The Dashboard gives an overview of restaurant performance, including revenue, expenses, profit, sales information, and visual charts.";
    }

    // --------------------------------------------------
    // RESTAURANT DEFINITIONS
    // --------------------------------------------------

    else if (
      isDefinitionQuestion(question) &&
      hasAny(question, ["profit", "profits"])
    ) {
      answer =
        "Profit is the money remaining after subtracting expenses from revenue. Profit = Revenue − Expenses.";
    }

    else if (
      isDefinitionQuestion(question) &&
      hasAny(question, ["revenue", "income"])
    ) {
      answer =
        "Revenue is the total money earned from sales before subtracting expenses.";
    }

    else if (
      isDefinitionQuestion(question) &&
      hasAny(question, ["turnover"])
    ) {
      answer =
        "Restaurant turnover is the total sales revenue generated during a specific period, such as a day, month, or year.";
    }

    else if (
      isDefinitionQuestion(question) &&
      hasAny(question, [
        "expense",
        "expenses",
        "cost",
        "costs",
      ])
    ) {
      answer =
        "Restaurant expenses are the costs involved in operating the restaurant, such as salaries, rent, electricity, water, raw materials, and other expenses.";
    }

    else if (
      isDefinitionQuestion(question) &&
      hasAny(question, ["food cost"])
    ) {
      answer =
        "Food cost is the money spent on ingredients and raw materials used to prepare the food sold by the restaurant.";
    }

    else if (
      isDefinitionQuestion(question) &&
      hasAny(question, ["bill", "invoice"])
    ) {
      answer =
        "A bill is a record of a customer's purchase. It normally contains the items purchased, quantities, prices, total amount, date, and payment method.";
    }

    // --------------------------------------------------
    // PROFIT IMPROVEMENT
    // --------------------------------------------------

    else if (
      hasAny(question, [
        "increase profit",
        "improve profit",
        "make more profit",
        "increase revenue",
        "increase sales",
        "grow restaurant",
        "improve restaurant",
      ])
    ) {
      answer =
        "A restaurant can improve profit by controlling food costs, reducing unnecessary expenses, reducing waste, promoting popular items, improving customer service, and regularly monitoring sales and expenses.";
    }

    // --------------------------------------------------
    // HELP
    // --------------------------------------------------

    else if (
      hasAny(question, [
        "help",
        "what can you do",
        "what can i ask",
        "what questions can i ask",
      ])
    ) {
      answer =
        "You can ask me about Menu Management, sales, bills, revenue, turnover, expenses, profit, best-selling items, reports, and the technology used in this website.";
    }

    // --------------------------------------------------
    // FALLBACK
    // --------------------------------------------------

    else {
      answer =
        "I couldn't identify that question yet. Try asking about your menu items, items sold, bills, revenue, expenses, profit, turnover, best-selling items, or this website.";
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error("Chat error:", error);

    return NextResponse.json(
      {
        error: "Unable to process your question.",
      },
      {
        status: 500,
      }
    );
  }
}