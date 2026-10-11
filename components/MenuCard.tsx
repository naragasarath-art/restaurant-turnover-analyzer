
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
};

type MenuCardProps = {
  onSelect: (item: {
    name: string;
    category: string;
    price: number;
  }) => void;
};

export default function MenuCard({ onSelect }: MenuCardProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMenuItems = async () => {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setMenuItems([]);
        return;
      }

      const response = await fetch("/api/menu", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        setMenuItems([]);
        return;
      }

      const data = await response.json();
      setMenuItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Menu loading error:", error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: MenuItem) => {
    onSelect({
      name: item.name,
      category: item.category,
      price: Number(item.price),
    });
  };

  return (
    <div className="rounded-xl bg-white p-6 text-gray-900 shadow-lg dark:bg-slate-800 dark:text-slate-100">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold !text-gray-900 dark:!text-slate-100">
          🍔 Menu Card
        </h2>

        <button
          type="button"
          onClick={loadMenuItems}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Refresh Menu
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Search Menu Item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        
className="mb-5 w-full rounded-lg border border-gray-300 bg-white p-3 !text-gray-900 placeholder:!text-gray-500 dark:border-slate-600 dark:bg-slate-900 dark:!text-slate-100 dark:placeholder:!text-slate-400"

      />

      {loading ? (
        <p className="text-gray-600 dark:text-slate-300">
          Loading menu items...
        </p>
      ) : filteredItems.length === 0 ? (
        <p className="text-gray-600 dark:text-slate-300">
          No menu items found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-blue-500 hover:shadow-md dark:border-slate-600 dark:bg-slate-700"
            >
            <h3 className="text-lg font-bold !text-gray-900 dark:!text-white">
                {item.name}
              </h3>

              <p className="text-gray-600 dark:text-slate-300">
                {item.category}
              </p>

              <p className="mt-2 font-bold text-green-600 dark:text-green-400">
                ₹{Number(item.price).toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
