import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isTyping?: boolean;
}

const ChatMessage = ({ message, isUser, isTyping }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-3 mb-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-chat-user-bg text-chat-user-fg rounded-tr-sm"
            : "bg-chat-bot-bg text-chat-bot-fg rounded-tl-sm border border-border"
        )}
      >
        {isTyping ? (
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-chat-user-bg flex items-center justify-center shadow-sm">
          <User className="w-5 h-5 text-chat-user-fg" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;