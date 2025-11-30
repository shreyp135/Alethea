"use client";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "./chatMessage";
import ChatInput from "./chatInput";
import axios from "axios";

export default function ChatContainer() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! How can I help you debug today?",
      id: 1,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll whenever messages update
  useEffect(() => {
    if (!chatRef.current) return;
    setTimeout(() => {
      chatRef.current!.scrollTop = chatRef.current!.scrollHeight;
    }, 50);
  }, [messages]);

  // Handle sending new user messages
  const sendMessage = async (text: string) => {
    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, id: Date.now() },
    ]);

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chatbot/`,
        { question: text }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.answer,
          id: Date.now(),
        },
      ]);
    } catch (err) {
      console.error("Chat fetch error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong on my end.",
          id: Date.now(),
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex-1">
      <div
        className="h-[77vh] overflow-auto [&::-webkit-scrollbar]:hidden p-8"
        id="chatbox"
        ref={chatRef}
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role as "assistant" | "user"}
            content={msg.content}
          />
        ))}
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          Alethea is typing...
        </div>
      ) : (
        <ChatInput
          isLoading={loading}
          onSend={sendMessage}
        />
      )}
    </div>
  );
}
