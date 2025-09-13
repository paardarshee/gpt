// temporarychat.tsx
"use client";
import TopBar from "./TopBar";
import NewChat from "./NewChat";
import { useChatInputStore } from "@/store/chatInputStore";
import { useChatStore } from "@/store/chatStore";
import { useState, useRef } from "react";
import Conversations from "./Conversations";
import ChatInput from "./ChatInput";
import { createUUID } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

const chatId = createUUID();

export default function TemporaryChat() {
  const chatInput = useChatInputStore();
  const { conversations, setNewChatInput, setRedirected } = useChatStore();
  const [streaming, setStreaming] = useState(false);
  const [status, setStatus] = useState<"initial" | "anonymous">("initial");
  const topBarRef = useRef<HTMLDivElement>(null);
  const { isSignedIn } = useUser();
  const handleAddBorder = (add: boolean) => {
    if (topBarRef.current) {
      if (add) {
        topBarRef.current.classList.add("bottom-border");
      } else {
        topBarRef.current.classList.remove("bottom-border");
      }
    }
  };
  const handleSubmit = async () => {
    if (!chatInput.input.trim()) return;

    // 2. Save input + redirect flag in store
    setNewChatInput({
      input: chatInput.input,
      attachments: chatInput.attachments,
    });
    setRedirected(true);

    // Optionally clear the composer
    chatInput.clearInput();
    chatInput.clearAttachments();
    setStatus("anonymous");
  };

  if (status === "anonymous") {
    return (
      <div className="relative flex h-full flex-col">
        <div ref={topBarRef} className="relative">
          {isSignedIn && <TopBar />}
        </div>
        <Conversations
          chatId={chatId}
          streaming={streaming}
          setStreaming={setStreaming}
          handleAddBorder={handleAddBorder}
          temporary={true}
        />
        <ChatInput chatId={chatId} setStreaming={setStreaming} />
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Input */}
      {isSignedIn && <TopBar />}
      <div className="flex w-full flex-1 items-center justify-center px-4 py-4">
        <div className="mx-auto w-full max-w-3xl">
          <div className="text- mx-auto flex w-full justify-center p-2 text-2xl">
            Temporary Chat
          </div>
          <div className="relative mx-auto flex items-center px-4 sm:max-w-2xl sm:px-6 xl:max-w-4xl xl:px-8">
            <NewChat
              value={chatInput.input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                chatInput.setInput(e.target.value)
              }
              handleSubmit={handleSubmit} // wrap for button
              setAttachments={chatInput.setAttachments}
              attachments={chatInput.attachments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
