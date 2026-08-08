"use client";

import { useState } from "react";

export default function ChatBot() {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Hello 👋 I am Restaurant Assistant. How can I help you?"
    }
  ]);

  const sendMessage = () => {

    if (!message.trim()) return;

    let reply = "";

    const text = message.toLowerCase();

    if (text.includes("revenue")) {
      reply = "You can check total revenue in the Dashboard Cards 📊";
    }
    else if (text.includes("expense")) {
      reply = "Go to Expenses section to manage monthly expenses 💰";
    }
    else if (text.includes("menu")) {
      reply = "You can add and manage food items in Menu Management 🍔";
    }
    else if (text.includes("profit")) {
      reply = "Profit is calculated as Revenue - Expenses 📈";
    }
    else {
      reply = "Sorry, I didn't understand. Try asking about menu, revenue, expenses or profit.";
    }


    setChat([
      ...chat,
      {
        sender:"user",
        text:message
      },
      {
        sender:"bot",
        text:reply
      }
    ]);

    setMessage("");

  };


  return (
    <>

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg"
      >
        💬
      </button>


      {open && (

        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-xl rounded-xl border p-4">

          <h3 className="font-bold text-lg mb-3">
            🤖 Restaurant Chatbot
          </h3>


          <div className="h-60 overflow-y-auto mb-3">

            {chat.map((item,index)=>(

              <p key={index}
              className={`mb-2 ${
                item.sender==="user"
                ? "text-right text-blue-600"
                : "text-left text-gray-700"
              }`}
              >
                {item.text}
              </p>

            ))}

          </div>


          <div className="flex gap-2">

            <input
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
              placeholder="Ask something..."
              className="border rounded p-2 flex-1"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Send
            </button>

          </div>


        </div>

      )}

    </>
  );
}