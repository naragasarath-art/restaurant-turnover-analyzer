"use client";

import { useEffect, useState } from "react";

type Sale = {
  billNumber: string;
  date: string;
  paymentMethod: string;
  menuItem: string;
  category: string;
  quantity: number;
  price: number;
  revenue: number;
};

type SelectedMenuItem = {
  name: string;
  category: string;
  price: number;
};

type MenuFormProps = {
  onAddSale: (sale: Sale) => void;
  selectedMenuItem: SelectedMenuItem | null;
};

export default function MenuForm({
  onAddSale,
  selectedMenuItem,
}: MenuFormProps) {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [menuItem, setMenuItem] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  // Automatically fill Menu Form when a menu card is selected
  useEffect(() => {
    if (selectedMenuItem) {
      setMenuItem(selectedMenuItem.name);
      setCategory(selectedMenuItem.category);
      setPrice(String(selectedMenuItem.price));
    }
  }, [selectedMenuItem]);

  const handleAdd = () => {
    if (!menuItem || !category || !quantity || !price) {
      alert("Please fill all fields.");
      return;
    }

    const sale: Sale = {
      billNumber: "BILL-" + Date.now(),
      date,
      paymentMethod,
      menuItem,
      category,
      quantity: Number(quantity),
      price: Number(price),
      revenue: Number(quantity) * Number(price),
    };

    onAddSale(sale);

    // Clear form after adding sale
    setMenuItem("");
    setCategory("");
    setQuantity("");
    setPrice("");
    setPaymentMethod("Cash");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">
        🧾 Add Sales Entry
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg p-3"
        />

        {/* Bill Number */}
        <input
          type="text"
          value={"BILL-" + Date.now()}
          readOnly
          className="border rounded-lg p-3 bg-gray-100"
        />

        {/* Payment Method */}
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>
        </select>

        {/* Menu Item */}
        <input
          type="text"
          placeholder="Menu Item"
          value={menuItem}
          onChange={(e) => setMenuItem(e.target.value)}
          className="border rounded-lg p-3"
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option value="">Select Category</option>
          <option value="Main Course">Main Course</option>
          <option value="Starter">Starter</option>
          <option value="Beverages">Beverages</option>
          <option value="Dessert">Dessert</option>
        </select>

        {/* Quantity */}
        <input
          type="number"
          min="1"
          placeholder="Quantity Sold"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border rounded-lg p-3"
        />

        {/* Price */}
        <input
          type="number"
          min="0"
          placeholder="Price per Item"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded-lg p-3"
        />

      </div>

      <button
        onClick={handleAdd}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        Add Sale
      </button>
    </div>
  );
}