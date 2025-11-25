"use client";

import { useState, useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import ChatMessage from "@/components/chat/chat-message";
import ChatInput from "@/components/chat/chat-input";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isTyping?: boolean;
}

const mockResponses = [
  "That's an interesting question! Based on what you've shared, I think we could explore a few different approaches.",
  "I understand what you're looking for. Let me help you with that.",
  "Great point! Here's what I would suggest considering your requirements.",
  "Absolutely! I can help with that. Let me break it down for you.",
  "That makes sense. From my perspective, the best approach would be to focus on the core functionality first.",
  "I see where you're coming from. Have you considered looking at it from this angle?",
];

const Chat = () => {
    const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("alethea_access");
    setToken(t);

    // redirect only after token is known
    if (!t) {
      router.push("/signin?error=auth");
    }
  }, [router]);

  // don't render layout until token check runs
  if (token === null) return null;
  

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI assistant. I'm here to help answer your questions and have a conversation. How can I assist you today?",
      isUser: false,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const typingMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "",
        isUser: false,
        isTyping: true,
      };
      setMessages((prev) => [...prev, typingMessage]);

      // Simulate typing complete
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.isTyping
              ? {
                  ...msg,
                  text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
                  isTyping: false,
                }
              : msg
          )
        );
        setIsTyping(false);
      }, 1500);
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AI Chat Assistant</h1>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              isTyping={message.isTyping}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
};

export default Chat;
