"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = () => {

    if (
      email === "admin@gmail.com" &&
      password === "admin123"
    ) {

      router.push("/dashboard");

    } else {

      alert("Invalid Email or Password");

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">


      <div className="bg-white p-8 rounded-xl shadow-lg w-96">


        <h1 className="text-2xl font-bold text-center mb-6">
          🍽 Restaurant Monthly Turnover Analyzer
        </h1>


        <input
          className="w-full p-3 border rounded mb-4"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />


        <input
          className="w-full p-3 border rounded mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
        >
          Login
        </button>


      </div>


    </div>

  );

}