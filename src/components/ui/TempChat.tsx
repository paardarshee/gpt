//root_page.tsx
"use client";

import { useChatStore } from "@/store/chatStore";
import { useChatInputStore } from "@/store/chatInputStore";
import NewChat from "@/components/ui/NewChat";
import TemporaryChat from "@/components/ui/TemporaryConversation";
import { useState } from "react";

export default function TempChatPage() {
  const setNewChatInput = useChatStore((s) => s.setNewChatInput);
  const setRedirected = useChatStore((s) => s.setRedirected);
  const chatInput = useChatInputStore();
  const [temporaryMode, setTemporaryMode] = useState(false);
  const handleSubmit = async () => {
    if (!chatInput.input.trim()) return;

    // 2. Save input + redirect flag in store
    setNewChatInput({
      input: chatInput.input,
      attachments: chatInput.attachments,
    });

    // Optionally clear the composer
    chatInput.clearInput();
    chatInput.clearAttachments();
    setRedirected(true);
    setTemporaryMode(true);
  };

  if (temporaryMode) {
    return <TemporaryChat />;
  }
  return (
    <div
      className="relative flex h-full w-full flex-col"
      role="document"
      aria-label="CloneGPT home page"
    >
      {/* Input */}

      <div className="h-[calc(50%-69px)]"></div>
      <div className="flex w-full items-center justify-center px-4 py-4">
        <div className="relative mx-auto w-full">
          <section
            aria-label="Chat input section"
            className="relative mx-auto flex items-center px-4 sm:max-w-2xl sm:px-6 xl:max-w-4xl xl:px-8"
          >
            <NewChat
              value={chatInput.input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                chatInput.setInput(e.target.value)
              }
              handleSubmit={handleSubmit} // wrap for button
              setAttachments={chatInput.setAttachments}
              attachments={chatInput.attachments}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
