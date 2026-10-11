
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type InventoryItem = {
  id: number;
  name: string;
  quantity: number;
  minimumStock: number;
  unit: string;
};

type DatabaseInventoryItem = {
  id: number;
  name: string;
  quantity: number | string;
  minimum_stock: number | string;
  unit: string;
};

export default function InventoryManagement() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [unit, setUnit] = useState("kg");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getToken = useCallback(async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    if (!session) {
      throw new Error("Please log in again to manage inventory.");
    }

    return session.access_token;
  }, []);

  const apiRequest = useCallback(
    async (method: string, body?: object) => {
      const token = await getToken();

      const response = await fetch("/api/inventory", {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Inventory request failed."
        );
      }

      return result;
    },
    [getToken]
  );

  const loadItems = useCallback(async () => {
    setLoading(true);

    try {
      const data = await apiRequest("GET");

      const formatted: InventoryItem[] = (
        data as DatabaseInventoryItem[]
      ).map((item) => ({
        id: item.id,
        name: item.name,
        quantity: Number(item.quantity),
        minimumStock: Number(item.minimum_stock),
        unit: item.unit,
      }));

      setItems(formatted);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load inventory."
      );
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function addItem() {
    const cleanName = name.trim();
    const qty = Number(quantity);
    const minimum = Number(minimumStock);

    if (
      !cleanName ||
      quantity.trim() === "" ||
      minimumStock.trim() === "" ||
      !Number.isFinite(qty) ||
      !Number.isFinite(minimum) ||
      qty < 0 ||
      minimum < 0
    ) {
      setMessage("Enter a valid item name and stock quantities.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const saved = (await apiRequest("POST", {
        name: cleanName,
        quantity: qty,
        minimumStock: minimum,
        unit,
      })) as DatabaseInventoryItem;

      setItems((previous) => [
        {
          id: saved.id,
          name: saved.name,
          quantity: Number(saved.quantity),
          minimumStock: Number(saved.minimum_stock),
          unit: saved.unit,
        },
        ...previous,
      ]);

      setName("");
      setQuantity("");
      setMinimumStock("");
      setUnit("kg");
      setMessage("Inventory item saved successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save inventory item."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateQuantity(id: number, change: number) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    const newQuantity = Math.max(0, item.quantity + change);
    if (newQuantity === item.quantity) return;

    setMessage("");

    try {
      const saved = (await apiRequest("PATCH", {
        id,
        quantity: newQuantity,
      })) as DatabaseInventoryItem;

      setItems((previous) =>
        previous.map((entry) =>
          entry.id === id
            ? { ...entry, quantity: Number(saved.quantity) }
            : entry
        )
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not update stock."
      );
    }
  }

  async function deleteItem(id: number) {
    setMessage("");

    try {
      await apiRequest("DELETE", { id });
      setItems((previous) =>
        previous.filter((item) => item.id !== id)
      );
      setMessage("Inventory item deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not delete inventory item."
      );
    }
  }

  const lowStockCount = items.filter(
    (item) => item.quantity <= item.minimumStock
  ).length;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Inventory Management
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Track restaurant stock and identify items that need restocking.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Inventory Items</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {items.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Low Stock Alerts</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {lowStockCount}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Add Inventory Item
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name (e.g. Rice)"
            className="min-w-0 rounded-lg border p-3"
          />

          <input
            type="number"
            min="0"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Current quantity"
            className="min-w-0 rounded-lg border p-3"
          />

          <input
            type="number"
            min="0"
            step="any"
            value={minimumStock}
            onChange={(e) => setMinimumStock(e.target.value)}
            placeholder="Minimum stock"
            className="min-w-0 rounded-lg border p-3"
          />

          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="min-w-0 rounded-lg border p-3"
          >
            <option value="kg">Kilograms (kg)</option>
            <option value="g">Grams (g)</option>
            <option value="litres">Litres</option>
            <option value="pieces">Pieces</option>
            <option value="packets">Packets</option>
          </select>
        </div>

        <button
          type="button"
          onClick={addItem}
          disabled={saving}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add Inventory Item"}
        </button>

        {message && (
          <p role="status" className="mt-3 text-sm text-slate-600">
            {message}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-5">
          <h3 className="text-lg font-semibold text-slate-800">
            Stock Details
          </h3>

          <button
            type="button"
            onClick={() => void loadItems()}
            disabled={loading}
            className="rounded border px-3 py-2 text-sm disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-slate-500">
            Loading inventory...
          </p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            No inventory items added yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Minimum</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {items.map((item) => {
                  const isLow =
                    item.quantity <= item.minimumStock;

                  return (
                    <tr key={item.id}>
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="p-4">
                        {item.minimumStock} {item.unit}
                      </td>
                      <td className="p-4">
                        <span
                          className={
                            isLow
                              ? "rounded-full bg-amber-100 px-3 py-1 text-amber-800"
                              : "rounded-full bg-green-100 px-3 py-1 text-green-800"
                          }
                        >
                          {isLow ? "Low Stock" : "In Stock"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              void updateQuantity(item.id, -1)
                            }
                            disabled={item.quantity <= 0}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="rounded border px-3 py-1 disabled:opacity-40"
                          >
                            −
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void updateQuantity(item.id, 1)
                            }
                            aria-label={`Increase ${item.name} quantity`}
                            className="rounded border px-3 py-1"
                          >
                            +
                          </button>

                          <button
                            type="button"
                            onClick={() => void deleteItem(item.id)}
                            className="rounded border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
