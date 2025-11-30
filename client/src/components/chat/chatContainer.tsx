"use client";
import { useState, useEffect } from "react";
import ChatMessage from "./chatMessage";
import ChatInput from "./chatInput";
import axios from "axios";

export default function ChatContainer() {
    const [messages, setMessages] = useState([
    {
      role: "assistant" ,
      content: "Hello! How can I help you debug today?",
      id: 1,
    },
  ]);
  const [mes,setMes] = useState("");


  useEffect(() => {
    const scrollToBottom = (timeout: number = 0) => {
      const container = document.getElementById("chatbox");
      if (container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, timeout);
      }
    };

    const message = messages[messages.length - 1];
    setMes(message.content);

    if (message.role === "user") {
      const fetchResponse = async () => {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ question: message.content }),
            }
          );
          const data = await res.data;
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.answer, id: Date.now() },
          ]);
          scrollToBottom(100);
        } catch (err) {
          console.error("Chat fetch error:", err);
        }
    }
    fetchResponse();
  }
    scrollToBottom();
    setMes("");

  }, [messages]);
  


  return (
    <div className="flex-1 ">
      {/* Header */}

      {/* Messages area */}
      <div className="h-[77vh] overflow-auto [&::-webkit-scrollbar]:hidden p-8" id="chatbox">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role as "assistant" | "user"} content={msg.content} />
        ))}
      </div>

      {/* Input */}
      <ChatInput
        onSend={(text) =>
          setMessages((prev) => [
            ...prev,
            { role: "user", content: text, id: Date.now() },
          ])
        }
      />
    </div>
  );
}
