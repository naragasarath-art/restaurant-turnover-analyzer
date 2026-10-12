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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <h2 className="text-2xl font-bold">
          🍔 Menu Card
        </h2>

        <button
          onClick={loadMenuItems}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Refresh Menu
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Search Menu Item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg p-3 mb-5"
      />

      {loading ? (
        <p className="text-gray-500">
          Loading menu items...
        </p>
      ) : filteredItems.length === 0 ? (
        <p className="text-gray-500">
          No menu items found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className="text-left border rounded-xl p-4 hover:shadow-md hover:border-blue-500 transition"
            >
              <h3 className="text-lg font-bold">
                {item.name}
              </h3>

              <p className="text-gray-500">
                {item.category}
              </p>

              <p className="text-green-600 font-bold mt-2">
                ₹{Number(item.price).toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}