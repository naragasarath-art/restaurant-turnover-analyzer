"use client";

import { useState, useEffect } from "react";

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

type MenuFormProps = {
  onAddSale: (sale: Sale) => void;
};

export default function MenuForm({
  onAddSale,
}: MenuFormProps) {

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [menuItem, setMenuItem] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");


  // Auto fill selected menu card item
  useEffect(() => {

    const fillMenuItem = () => {

      const savedItem = localStorage.getItem(
        "selectedMenuItem"
      );


      if (savedItem) {

        const item = JSON.parse(savedItem);

        setMenuItem(item.name);
        setCategory(item.category);
        setPrice(String(item.price));

      }

    };


    // Load when page opens
    fillMenuItem();


    // Load when menu card clicked
    window.addEventListener(
      "menuSelected",
      fillMenuItem
    );


    return () => {

      window.removeEventListener(
        "menuSelected",
        fillMenuItem
      );

    };


  }, []);



  const billNumber = "BILL-" + Date.now();



  const handleAdd = () => {


    if (!menuItem || !category || !quantity || !price) {

      alert("Please fill all fields.");
      return;

    }



    const sale: Sale = {

      billNumber,

      date,

      paymentMethod,

      menuItem,

      category,

      quantity: Number(quantity),

      price: Number(price),

      revenue:
        Number(quantity) * Number(price),

    };



    onAddSale(sale);



    // Clear after adding

    setMenuItem("");
    setCategory("");
    setQuantity("");
    setPrice("");

    localStorage.removeItem(
      "selectedMenuItem"
    );


  };



  return (

    <div className="bg-white p-5 rounded-xl shadow">


      <h2 className="text-2xl font-bold mb-5">
        Add Menu Item
      </h2>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          className="border rounded-lg p-3"
        />



        <input
          type="text"
          value={billNumber}
          readOnly
          className="border rounded-lg p-3 bg-gray-100"
        />



        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
          className="border rounded-lg p-3"
        >

          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>

        </select>




        <input
          type="text"
          placeholder="Menu Item"
          value={menuItem}
          onChange={(e) =>
            setMenuItem(e.target.value)
          }
          className="border rounded-lg p-3"
        />



        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="border rounded-lg p-3"
        >

          <option value="">
            Select Category
          </option>

          <option>
            Main Course
          </option>

          <option>
            Starter
          </option>

          <option>
            Beverages
          </option>

          <option>
            Dessert
          </option>

        </select>




        <input
          type="number"
          placeholder="Quantity Sold"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
          className="border rounded-lg p-3"
        />



        <input
          type="number"
          placeholder="Price per Item"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          className="border rounded-lg p-3"
        />



      </div>




      <button

        onClick={handleAdd}

        className="
        mt-6
        bg-blue-600
        hover:bg-blue-700
        text-white
        px-6
        py-3
        rounded-lg
        "

      >

        Add Item

      </button>


    </div>

  );

}