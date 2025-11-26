import ChatContainer from "@/components/chat/chatContainer";
import ComponentCard from "@/components/common/ComponentCard";

export default function ChatPage() {
  return (
    <div className=" grid grid-rows-12">
      <ComponentCard title="">
      <ChatContainer />
      </ComponentCard>
    </div>
  );
}
