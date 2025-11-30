interface Props {
  role: "assistant" | "user";
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full mb-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] px-4 py-3 rounded-xl shadow-sm ${
          isUser
            ? "bg-blue-800 text-white dark:bg-blue-800 rounded-br-none"
            : "bg-white text-black border dark:border-gray-700 dark:bg-gray-600 dark:text-white rounded-bl-none"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
