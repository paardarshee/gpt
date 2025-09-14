"use client";
import { use, useState, useRef } from "react";
import Conversations from "@/components/ui/Conversation";
import ChatInput from "@/components/chat/ChatInput";
import TopBar from "@/components/layout/TopBar";

type ChatProps = {
  params: Promise<{ chat_id: string }>;
};

export default function ChatPage({ params }: ChatProps) {
  const { chat_id } = use(params);
  const [streaming, setStreaming] = useState(false);
  const topBarRef = useRef<HTMLDivElement>(null);

  const handleAddBorder = (add: boolean) => {
    if (topBarRef.current) {
      if (add) {
        topBarRef.current.classList.add("bottom-border");
      } else {
        topBarRef.current.classList.remove("bottom-border");
      }
    }
  };

  return (
    <div
      className="relative flex h-full flex-col"
      role="main"
      aria-label={`Chat screen for conversation ${chat_id}`}
    >
      <div
        ref={topBarRef}
        className="relative"
        role="banner"
        aria-label="Chat top navigation bar"
      >
        <TopBar />
      </div>
      <Conversations
        chatId={chat_id}
        streaming={streaming}
        setStreaming={setStreaming}
        handleAddBorder={handleAddBorder}
      />
      <ChatInput chatId={chat_id} setStreaming={setStreaming} />
    </div>
  );
}
