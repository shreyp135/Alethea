"use client";

import { useState } from "react";
import ChatMessage from "./chatMessage";
import ChatInput from "./chatInput";

export default function ChatContainer() {

  const [messages, setMessages] = useState([
    {
      role: "assistant" ,
      content: "Hello Shrey! How can I help you debug today?",
      id: 1,
    },
  ]);

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0">
      {/* Header */}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
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
