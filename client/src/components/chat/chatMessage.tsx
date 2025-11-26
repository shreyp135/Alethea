interface Props {
  role: "assistant" | "user";
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] px-4 py-3 rounded-xl shadow-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white text-black border rounded-bl-none"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
