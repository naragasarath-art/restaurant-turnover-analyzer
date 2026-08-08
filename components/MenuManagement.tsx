"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const saved = localStorage.getItem("menuItems");

    if (saved) {
      setMenuItems(JSON.parse(saved));
    }
  }, []);


  const addItem = () => {

    if (!name || !category || !price) {
      alert("Please fill all fields");
      return;
    }

    const newItem: MenuItem = {
      id: Date.now(),
      name,
      category,
      price: Number(price),
    };


    const updatedMenu = [
      ...menuItems,
      newItem
    ];


    setMenuItems(updatedMenu);

    localStorage.setItem(
      "menuItems",
      JSON.stringify(updatedMenu)
    );


    setName("");
    setCategory("");
    setPrice("");
  };


  const deleteItem = (id:number)=>{

    const updatedMenu =
      menuItems.filter(
        item => item.id !== id
      );

    setMenuItems(updatedMenu);

    localStorage.setItem(
      "menuItems",
      JSON.stringify(updatedMenu)
    );
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
        onChange={(e)=>setName(e.target.value)}
      />


      <select
        className="border p-3 m-2"
        value={category}
        onChange={(e)=>setCategory(e.target.value)}
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
        onChange={(e)=>setPrice(e.target.value)}
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


      {menuItems.map((item)=>(

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
            onClick={()=>deleteItem(item.id)}
            className="bg-red-500 text-white px-3 rounded"
          >
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}