"use client";

import { useState, useEffect } from "react";

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
    const savedMenu = localStorage.getItem("menuItems");

    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem(
      "menuItems",
      JSON.stringify(menuItems)
    );
  }, [menuItems]);


  const addMenuItem = () => {

    if (!name || !category || !price) {
      alert("Please fill all fields");
      return;
    }


    const newItem: MenuItem = {
      id: Date.now(),
      name: name,
      category: category,
      price: Number(price),
    };


    setMenuItems([
      ...menuItems,
      newItem
    ]);


    setName("");
    setCategory("");
    setPrice("");
  };


  const deleteMenuItem = (id:number) => {

    const updatedMenu = menuItems.filter(
      (item)=> item.id !== id
    );

    setMenuItems(updatedMenu);
  };


  return (

    <div className="min-h-screen bg-gray-100 p-8">


      <h1 className="text-3xl font-bold mb-6">
        🍔 Menu Management
      </h1>


      <div className="bg-white p-6 rounded-lg shadow">


        <h2 className="text-xl font-bold mb-4">
          Add New Menu Item
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


          <input
            type="text"
            placeholder="Food Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="border p-3 rounded"
          />


          <select
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
            className="border p-3 rounded"
          >

            <option value="">
              Select Category
            </option>

            <option>
              Starter
            </option>

            <option>
              Main Course
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
            placeholder="Price"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
            className="border p-3 rounded"
          />


        </div>


        <button
          onClick={addMenuItem}
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Add Menu Item
        </button>


      </div>



      <div className="bg-white mt-6 p-6 rounded-lg shadow">


        <h2 className="text-xl font-bold mb-4">
          Menu List
        </h2>



        {
          menuItems.length === 0 ? (

            <p>
              No menu items added
            </p>

          ) : (

            menuItems.map((item)=>(

              <div
                key={item.id}
                className="flex justify-between border-b py-3"
              >

                <div>

                  <p className="font-bold">
                    {item.name}
                  </p>

                  <p>
                    {item.category}
                  </p>

                  <p>
                    ₹ {item.price}
                  </p>

                </div>


                <button
                  onClick={()=>deleteMenuItem(item.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>


              </div>

            ))

          )
        }


      </div>


    </div>

  );
}