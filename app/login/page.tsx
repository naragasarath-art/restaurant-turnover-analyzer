"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

        <h1 className="text-2xl font-bold text-center">
          Restaurant Monthly Turnover Analyzer
        </h1>

        <input
          className="w-full mt-6 p-3 border rounded"
          type="email"
          placeholder="Email"
        />

        <input
          className="w-full mt-4 p-3 border rounded"
          type="password"
          placeholder="Password"
        />

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full mt-5 bg-blue-600 text-white p-3 rounded"
        >
          Login
        </button>

      </div>
    </div>
  );
}