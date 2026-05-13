import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, X } from "lucide-react";

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/ai/chat",
        { message }
      );

      const botMessage = {
        sender: "bot",
        text: data.reply,
      };

      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ AI is not responding. Try again." },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-black to-gray-800 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border">

          {/* Header */}
          <div className="bg-gradient-to-r from-black to-gray-800 text-white p-4 flex justify-between items-center">
            <h2 className="font-semibold">AI Shopping Assistant</h2>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">

            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow
                  ${
                    msg.sender === "user"
                      ? "bg-black text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500">AI is typing...</div>
            )}

            <div ref={chatRef}></div>
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2 bg-white">

            <input
              type="text"
              placeholder="Ask about products..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-black"
            />

            <button
              onClick={sendMessage}
              className="bg-black text-white px-4 rounded-xl hover:bg-gray-800 flex items-center gap-1"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;