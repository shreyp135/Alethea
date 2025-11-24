"use client"

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <div className="flex gap-2 max-w-4xl mx-auto" onKeyDown={handleKeyDown}>
        <TextArea
          value={message}
          onChange={(e:any) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="resize-none min-h-[60px] max-h-[200px] bg-background"
          disabled={disabled}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="md"
          className="h-[60px] w-[60px] rounded-xl bg-gradient-to-br from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
