"use client";

import { useEffect, useState } from "react";


type Sale = {
  billNumber: string;
  date: string;
  menuItem: string;
  category: string;
  quantity: number;
  price: number;
  revenue: number;
};


export default function ExportPage() {


  const [sales, setSales] = useState<Sale[]>([]);



  useEffect(() => {

    const savedSales =
      localStorage.getItem("sales");


    if(savedSales){
      setSales(JSON.parse(savedSales));
    }

  }, []);




  const exportCSV = () => {


    if(sales.length === 0){
      alert("No sales data available");
      return;
    }


    const headers =
      [
        "Bill Number",
        "Date",
        "Menu Item",
        "Category",
        "Quantity",
        "Price",
        "Revenue"
      ];


    const rows = sales.map((sale)=>[
      sale.billNumber,
      sale.date,
      sale.menuItem,
      sale.category,
      sale.quantity,
      sale.price,
      sale.revenue
    ]);



    const csvContent =
      [
        headers,
        ...rows
      ]
      .map(row=>row.join(","))
      .join("\n");



    const blob =
      new Blob(
        [csvContent],
        {type:"text/csv"}
      );



    const url =
      URL.createObjectURL(blob);



    const link =
      document.createElement("a");


    link.href=url;

    link.download="restaurant-sales-report.csv";


    link.click();


  };




  return (

    <div className="min-h-screen bg-gray-100 p-8">


      <h1 className="text-3xl font-bold mb-6">
        📄 Export Reports
      </h1>



      <div className="bg-white p-6 rounded-lg shadow">


        <h2 className="text-xl font-bold mb-4">
          Download Your Restaurant Data
        </h2>



        <button

          onClick={exportCSV}

          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"

        >

          ⬇ Export Sales CSV

        </button>



        <p className="mt-5">
          Total Records: {sales.length}
        </p>


      </div>


    </div>

  );

}