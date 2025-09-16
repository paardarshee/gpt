"use client";

import { useUser } from "@clerk/nextjs";
import TopBar from "@/components/layout/TopBar";
import NewChat from "./NewChat";
import Conversations from "./Conversation";
import ChatInput from "@/components/chat/ChatInput";
import { useTemporaryChat } from "@/hooks/useTemporaryChat";

/**
 * TemporaryChat
 * Renders a temporary chat interface for anonymous or signed-in users.
 * Includes TopBar, Conversations, and ChatInput.
 */
export default function TemporaryChat() {
  const {
    chatId,
    streaming,
    topBarRef,
    handleAddBorder,
    setStreaming,
    streamingText,
    startStreaming,
  } = useTemporaryChat();

  const { isSignedIn } = useUser();
  return (
    <div
      className="relative flex h-full flex-col"
      role="region"
      aria-label="Anonymous temporary chat"
    >
      <div ref={topBarRef} className="relative">
        {isSignedIn && <TopBar />}
      </div>

      <Conversations
        chatId={chatId}
        streaming={streaming}
        setStreaming={setStreaming}
        handleAddBorder={handleAddBorder}
        startStreaming={startStreaming}
        streamingText={streamingText}
        temporary
        aria-label="Conversation messages"
      />

      <ChatInput
        chatId={chatId}
        setStreaming={setStreaming}
        streaming={streaming}
        startStreaming={startStreaming}
        streamingText={streamingText}
        aria-label="Chat input"
      />
    </div>
  );
}
