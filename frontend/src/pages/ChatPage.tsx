import ChatWindow from "@/components/chat/ChatWindow";
import MessageInput from "@/components/chat/MessageInput";
import Header from "@/components/layout/Header";

import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const {
    messages,
    loading,
    sendMessage,
  } = useChat();

  return (
    <div className="h-screen bg-slate-100">
      <div className="flex h-full">


        <div className="flex flex-1 flex-col">
          <Header />

          <ChatWindow
            messages={messages}
            loading={loading}
          />

          <MessageInput
            onSend={sendMessage}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}