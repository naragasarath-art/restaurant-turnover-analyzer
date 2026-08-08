
"use client";

import { useState } from "react";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [chat, setChat] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hello 👋 I am your Restaurant Assistant. Ask me about revenue, expenses, profit, menu, sales, turnover, reports, or your project.",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const text = message.toLowerCase().trim();

    let reply =
      "I can help with restaurant sales, revenue, expenses, profit, menu management, turnover, reports, and your project. Try asking me one of these topics.";

    // Greeting
    if (
      text.includes("hello") ||
      text.includes("hi") ||
      text.includes("hey")
    ) {
      reply =
        "Hello! 👋 How can I help you with your restaurant project today?";
    }

    // Revenue
    else if (
      text.includes("revenue") ||
      text.includes("sales amount") ||
      text.includes("total sales")
    ) {
      reply =
        "Revenue is the total money earned from your sales. You can see the total revenue in the Dashboard Cards and Reports section. 📊";
    }

    // Expenses
    else if (
      text.includes("expense") ||
      text.includes("expenses") ||
      text.includes("cost")
    ) {
      reply =
        "You can manage monthly expenses such as staff salary, rent, electricity, water, raw materials and other expenses in the Expenses section. 💰";
    }

    // Profit
    else if (
      text.includes("profit") ||
      text.includes("earnings")
    ) {
      reply =
        "Your profit is calculated as Total Revenue minus Total Expenses. 📈";
    }

    // Loss
    else if (
      text.includes("loss") ||
      text.includes("losing money")
    ) {
      reply =
        "A loss occurs when your total expenses are greater than your total revenue. Check your Expenses and Revenue sections to identify the main cause.";
    }

    // Menu
    else if (
      text.includes("menu") ||
      text.includes("food") ||
      text.includes("dish")
    ) {
      reply =
        "You can add, view and delete restaurant food items from Menu Management. 🍔";
    }

    // Add menu
    else if (
      text.includes("add item") ||
      text.includes("add food") ||
      text.includes("new menu")
    ) {
      reply =
        "Open Menu Management, enter the food name, category and price, then click Add Menu Item.";
    }

    // Sales
    else if (
      text.includes("sale") ||
      text.includes("sales entry") ||
      text.includes("bill")
    ) {
      reply =
        "You can enter a sale using the Add Menu Item/Sales Entry form. Select the menu item, enter quantity and payment method, and save the sale.";
    }

    // Turnover
    else if (
      text.includes("turnover") ||
      text.includes("business turnover")
    ) {
      reply =
        "Restaurant turnover generally refers to the total sales revenue generated during a specific period, such as a month or year.";
    }

    // Monthly
    else if (
      text.includes("monthly") ||
      text.includes("month")
    ) {
      reply =
        "Your project uses monthly sales and expense information to help analyze revenue, expenses, profit and turnover.";
    }

    // Report
    else if (
      text.includes("report") ||
      text.includes("reports")
    ) {
      reply =
        "You can view the Monthly Report from the Reports section. It summarizes sales, revenue, expenses and profit.";
    }

    // Prediction
    else if (
      text.includes("prediction") ||
      text.includes("predict") ||
      text.includes("future")
    ) {
      reply =
        "The Turnover Prediction section provides an estimate based on your available restaurant revenue and profit information.";
    }

    // Dashboard
    else if (
      text.includes("dashboard") ||
      text.includes("home page")
    ) {
      reply =
        "The Dashboard gives you an overview of your restaurant's revenue, expenses, profit, sales, charts and turnover prediction. 📊";
    }

    // Payment
    else if (
      text.includes("payment") ||
      text.includes("cash") ||
      text.includes("upi") ||
      text.includes("card")
    ) {
      reply =
        "Your sales entries can record different payment methods such as Cash, UPI and Card.";
    }

    // Category
    else if (
      text.includes("category") ||
      text.includes("categories")
    ) {
      reply =
        "Your menu supports categories such as Main Course, Starter, Beverages and Dessert.";
    }

    // Best selling
    else if (
      text.includes("best selling") ||
      text.includes("top selling") ||
      text.includes("most sold")
    ) {
      reply =
        "The Dashboard Cards can show your best-selling item based on the sales data entered into the system.";
    }

    // Chart
    else if (
      text.includes("chart") ||
      text.includes("graph")
    ) {
      reply =
        "Your dashboard contains revenue and category charts to help visualize restaurant performance.";
    }

    // Export
    else if (
      text.includes("export") ||
      text.includes("download")
    ) {
      reply =
        "Use the Export section to generate or export your restaurant sales and report information.";
    }

    // Project
    else if (
      text.includes("project") ||
      text.includes("application") ||
      text.includes("system")
    ) {
      reply =
        "Your project is a Restaurant Monthly Turnover Analyzer. It helps manage menu items, record sales, track expenses, calculate profit, analyze reports and predict turnover.";
    }

    // Technology
    else if (
      text.includes("technology") ||
      text.includes("technologies") ||
      text.includes("built")
    ) {
      reply =
        "Your application is built as a web application using Next.js, React, TypeScript, Tailwind CSS and browser localStorage for storing data.";
    }

    // Help
    else if (
      text.includes("help") ||
      text.includes("what can you do")
    ) {
      reply =
        "I can help you with revenue, sales, expenses, profit, menu management, monthly reports, turnover prediction, charts, payments and your project.";
    }

    // Thanks
    else if (
      text.includes("thank") ||
      text.includes("thanks")
    ) {
      reply = "You're welcome! 😊 I'm happy to help.";
    }

    setChat((previousChat) => [
      ...previousChat,
      {
        sender: "user",
        text: message,
      },
      {
        sender: "bot",
        text: reply,
      },
    ]);

    setMessage("");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg z-50"
      >
        💬
      </button>

      {/* Chatbot Window */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 max-w-[90vw] bg-white shadow-2xl rounded-xl border z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4">
            <h3 className="font-bold text-lg">
              🤖 Restaurant Chatbot
            </h3>

            <p className="text-sm text-blue-100">
              Ask me about your restaurant
            </p>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 bg-gray-50">
            {chat.map((item, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  item.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg ${
                    item.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 border"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t bg-white">
            <input
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              className="border rounded-lg p-2 flex-1 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}