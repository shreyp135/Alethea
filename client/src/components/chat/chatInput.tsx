"use client";

import { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (t: string) => void }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (<>
    <div className="border-t dark:border-gray-800 px-6 pt-6 flex gap-3">
      <input
        className="flex-1 justify-center items-center align-middle border rounded-lg px-4 py-2 outline-none bg-white dark:bg-gray-800 dark:text-white"
        placeholder="Ask Alethea anything about logs, PRs, or incidents…"
        value={text}
        type="text"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <button
        onClick={handleSend}
        className="bg-blue-800 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
                <p className=" px-8 py-2.5 text-xs text-gray-500 dark:text-gray-500">*This data is not saved with us due to privacy reasons, on refreshing the page it will be lost.</p>

  </>
  );
}
