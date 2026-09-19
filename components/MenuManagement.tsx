"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
};

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  // Get logged-in user's session
  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  };

  // Load menu items for the current account
  const loadMenu = async () => {
    try {
      const session = await getSession();

      if (!session) {
        alert("Please login first.");
        return;
      }

      const response = await fetch("/api/menu", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load menu");
      }

      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error(error);
      alert("Could not load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // Add menu item
  const addItem = async () => {
    if (!name || !category || !price) {
      alert("Please fill all fields");
      return;
    }

    try {
      const session = await getSession();

      if (!session) {
        alert("Please login first.");
        return;
      }

      const response = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name,
          category,
          price: Number(price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add menu item");
      }

      // Add newly created item to the screen
      setMenuItems((previous) => [...previous, data]);

      // Clear form
      setName("");
      setCategory("");
      setPrice("");
    } catch (error) {
      console.error(error);
      alert("Could not add menu item.");
    }
  };

  // Delete menu item
  const deleteItem = async (id: number) => {
    try {
      const session = await getSession();

      if (!session) {
        alert("Please login first.");
        return;
      }

      const response = await fetch("/api/menu", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete menu item");
      }

      // Remove deleted item from screen
      setMenuItems((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Could not delete menu item.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">
        🍔 Menu Management
      </h2>

      <input
        className="border p-3 m-2"
        placeholder="Menu Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="border p-3 m-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Category</option>
        <option>Main Course</option>
        <option>Starter</option>
        <option>Beverages</option>
        <option>Dessert</option>
      </select>

      <input
        className="border p-3 m-2"
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button
        onClick={addItem}
        className="bg-blue-600 text-white px-5 py-3 rounded"
      >
        Add Menu Item
      </button>

      <h3 className="text-xl font-bold mt-8">
        Available Menu
      </h3>

      {loading ? (
        <p className="mt-3 text-gray-500">
          Loading menu...
        </p>
      ) : menuItems.length === 0 ? (
        <p className="mt-3 text-gray-500">
          No menu items available.
        </p>
      ) : (
        menuItems.map((item) => (
          <div
            key={item.id}
            className="border p-3 mt-3 flex justify-between"
          >
            <div>
              <b>{item.name}</b>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
            </div>

            <button
              onClick={() => deleteItem(item.id)}
              className="bg-red-500 text-white px-3 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}