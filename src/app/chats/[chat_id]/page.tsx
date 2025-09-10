"use client";
import { use, useState } from "react";
import Conversations from "@/components/chat/Conversations";
import ChatInput from "@/components/chat/ChatInput";

type ChatProps = {
  params: Promise<{ chat_id: string }>;
};

export default function ChatPage({ params }: ChatProps) {
  const { chat_id } = use(params);
  const [streaming, setStreaming] = useState(false);

  return (
    <div className="relative flex h-full flex-col bg-white text-gray-900 dark:bg-[#343541] dark:text-gray-100">
      <Conversations
        chatId={chat_id}
        streaming={streaming}
        setStreaming={setStreaming}
      />
      <ChatInput chatId={chat_id} setStreaming={setStreaming} />
    </div>
  );
}
