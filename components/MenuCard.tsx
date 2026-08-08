"use client";

import { useEffect, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
};

type MenuCardProps = {
  onSelect: (item: MenuItem) => void;
};

export default function MenuCard({ onSelect }: MenuCardProps) {

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const loadMenu = () => {

      const data = localStorage.getItem("menuItems");

      if (data) {
        setMenuItems(JSON.parse(data));
      }

    };

    loadMenu();

  }, []);


  const filteredItems = menuItems.filter((item) =>
    item.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  return (
    <div>

      <h2 className="text-2xl font-bold mb-4">
        🍽️ Menu Card
      </h2>


      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search Menu Item..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="w-full border rounded-lg p-3 mb-5"
      />


      {
        filteredItems.length === 0 ? (

          <p className="text-gray-500">
            No menu items found
          </p>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {
              filteredItems.map((item)=>(

                <div
                  key={item.id}

                  onClick={()=>{

                    localStorage.setItem(
                      "selectedMenuItem",
                      JSON.stringify(item)
                    );

                    onSelect(item);

                    window.dispatchEvent(
                      new Event("menuSelected")
                    );

                  }}

                  className="
                  cursor-pointer
                  rounded-xl
                  border
                  p-4
                  hover:bg-blue-50
                  hover:border-blue-500
                  transition
                  "
                >

                  <h3 className="font-bold text-lg">
                    {item.name}
                  </h3>

                  <p>
                    {item.category}
                  </p>

                  <p className="text-green-600 font-bold mt-2">
                    ₹{item.price}
                  </p>


                </div>


              ))
            }

          </div>

        )
      }


    </div>
  );
}