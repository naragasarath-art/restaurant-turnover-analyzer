"use client";

import { useState } from "react";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [chat, setChat] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hello 👋 I am your AI Restaurant Assistant. Ask me anything!",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setChat((previous) => [
      ...previous,
      { sender: "user", text: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setChat((previous) => [
        ...previous,
        {
          sender: "bot",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setChat((previous) => [
        ...previous,
        {
          sender: "bot",
          text: "Sorry, I couldn't connect to the AI right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-blue-600 px-5 py-3 text-white shadow-lg hover:bg-blue-700"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex w-80 flex-col overflow-hidden rounded-xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
            <h3 className="font-bold">
              🤖 AI Restaurant Assistant
            </h3>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xl"
            >
              ×
            </button>
          </div>

          <div className="h-80 space-y-3 overflow-y-auto p-4">
            {chat.map((item, index) => (
              <div
                key={index}
                className={
                  item.sender === "user"
                    ? "text-right"
                    : "text-left"
                }
              >
                <span
                  className={
                    item.sender === "user"
                      ? "inline-block max-w-[85%] rounded-lg bg-blue-100 p-2 text-blue-900"
                      : "inline-block max-w-[85%] rounded-lg bg-gray-100 p-2 text-gray-800"
                  }
                >
                  {item.text}
                </span>
              </div>
            ))}

            {loading && (
              <div className="text-left">
                <span className="inline-block rounded-lg bg-gray-100 p-2 text-gray-600">
                  🤖 Thinking...
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t p-3">
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              disabled={loading}
              className="flex-1 rounded-lg border p-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}