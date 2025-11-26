"use client";

import { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (t: string) => void }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="border-t p-4 flex gap-3">
      <input
        className="flex-1 border rounded-lg px-4 py-2 outline-none bg-white"
        placeholder="Ask Alethea anything about logs, PRs, or incidents…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}
