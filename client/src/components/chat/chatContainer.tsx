"use client";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "./chatMessage";
import ChatInput from "./chatInput";
import axios from "axios";
import Loader from "../ui/loader/Loader";

export default function ChatContainer() {
  const [messages, setMessages] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const [loaderVisible, setLoaderVisible] = useState(false);

useEffect(() => {
  const initializeChat = async () => {
    setLoaderVisible(true);
    let currentName = ""; // Use a local variable to avoid waiting for state update

    try {
      const token = localStorage.getItem("alethea_access");
      if (token) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
          { headers: { Authorization: token } }
        );

        if (res.data?.user?.name) {
          currentName = res.data.user.name;
          setName(currentName); // Update state for other parts of the UI
        }
      }
    } catch (err) {
      console.error("User load error:", err);
    } finally {
      // Set the greeting using the variable we just fetched
      setMessages([
        {
          role: "assistant",
          content: `Hello ${currentName || "there"}! I'm Alethea. How can I help you today?`,
          id: Date.now(),
        },
      ]);
      setLoaderVisible(false);
      setLoading(false);
    }
  };

  initializeChat();
}, []); // Empty dependency array: only run once on mount

  // Auto-scroll whenever messages update
  useEffect(() => {
    if (!chatRef.current) return;
    setTimeout(() => {
      chatRef.current!.scrollTop = chatRef.current!.scrollHeight;
    }, 30);
  }, [messages]);

  // Send message to backend
  const sendMessage = async (text: string) => {
    // Add user's message
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
      console.error(err);
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
        ref={chatRef}
      >
        {loaderVisible && 
          <div className="ml-48 mt-12">
            <Loader />
          </div>
        }

        {!loaderVisible && (
          <>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
              />
            ))}
          </>
        )}
      </div>

      {loading ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          Alethea is typing...
        </div>
      ) : (
        <ChatInput isLoading={loading} onSend={sendMessage} />
      )}
    </div>
  );
}
