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
    status,
    streaming,
    topBarRef,
    handleAddBorder,
    handleSubmit,
    setStreaming,
    chatInput,
    streamingText,
    startStreaming,
  } = useTemporaryChat();

  const { isSignedIn } = useUser();

  if (status === "anonymous") {
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

  return (
    <div
      className="relative flex h-full w-full flex-col"
      role="region"
      aria-label="Temporary chat"
    >
      {isSignedIn && <TopBar />}

      <div className="flex w-full flex-1 items-center justify-center px-4 py-4">
        <div className="mx-auto w-full max-w-3xl">
          <div
            className="p-2 text-center text-2xl"
            role="heading"
            aria-level={2}
          >
            Temporary Chat
          </div>

          <div
            className="relative mx-auto flex items-center px-4 sm:max-w-2xl sm:px-6 xl:max-w-4xl xl:px-8"
            role="form"
            aria-label="Temporary chat input"
          >
            <NewChat
              value={chatInput.input}
              onChange={(e) => chatInput.setInput(e.target.value)}
              handleSubmit={handleSubmit}
              setAttachments={chatInput.setAttachments}
              attachments={chatInput.attachments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
