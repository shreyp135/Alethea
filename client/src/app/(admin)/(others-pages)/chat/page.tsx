import ChatContainer from "@/components/chat/chatContainer";
import ComponentCard from "@/components/common/ComponentCard";

export default function ChatPage() {
  return (
    <div className=" flex ">
      {/* <ComponentCard title="You are now chatting with Alethea AI Assistant"> */}
      <ChatContainer />
      {/* </ComponentCard> */}
    </div>
  );
}
