"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("restaurant-theme");
    const initialTheme: Theme = savedTheme === "dark" ? "dark" : "light";

    setTheme(initialTheme);
    document.documentElement.classList.toggle(
      "dark",
      initialTheme === "dark"
    );
  }, []);

  function changeTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    localStorage.setItem("restaurant-theme", nextTheme);
    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark"
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-600 dark:bg-slate-800">
      <button
        type="button"
        onClick={() => changeTheme("light")}
        aria-pressed={theme === "light"}
        className={`rounded-md px-3 py-2 ${
          theme === "light"
            ? "bg-blue-600 text-white"
            : "text-slate-700 dark:text-slate-200"
        }`}
      >
        ☀️ Light
      </button>

      <button
        type="button"
        onClick={() => changeTheme("dark")}
        aria-pressed={theme === "dark"}
        className={`rounded-md px-3 py-2 ${
          theme === "dark"
            ? "bg-blue-600 text-white"
            : "text-slate-700 dark:text-slate-200"
        }`}
      >
        🌙 Dark
      </button>
    </div>
  );
}