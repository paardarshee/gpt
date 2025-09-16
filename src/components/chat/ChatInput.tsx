"use client";

import { createUUID } from "@/lib/utils";
import { useChatInputStore } from "@/store/chatInputStore";
import { useChatStore } from "@/store/chatStore";
import NewChat from "@/components/ui/NewChat";
import { ChatInputProps } from "@/types/chat";

/**
 * Chat input component: handles sending user messages, starting streaming, and rendering input UI.
 */
export default function ChatInput({
  chatId,
  setStreaming,
  streaming,
  startStreaming,
}: ChatInputProps) {
  const chatInput = useChatInputStore();
  const addMessage = useChatStore((s) => s.addMessage);

  const handleSend = async () => {
    if (!chatInput.input.trim()) return;
    const userMsgId = createUUID();
    addMessage(chatId, {
      role: "user",
      msgId: userMsgId,
      content: chatInput.input,
      attachments: chatInput.attachments,
    });

    setStreaming(true);
    const chatInputSnapshot = {
      input: chatInput.input,
      attachments: [...chatInput.attachments],
    };
    chatInput.setInput("");
    chatInput.setAttachments([]);

    const aiText = await startStreaming({
      msgId: userMsgId,
      content: chatInputSnapshot.input,
      conversationId: chatId,
      attachments: chatInputSnapshot.attachments,
    });

    setStreaming(false);
    if (aiText) {
      addMessage(chatId, {
        role: "assistant",
        content: aiText,
      });
    }
  };

  return (
    <div
      className="relative -top-10 bottom-0 w-full md:-top-8"
      role="form"
      aria-label="Chat input area"
    >
      {/* Decorative gradient overlay */}
      <div
        aria-hidden="true"
        className="to-bg-primary absolute -top-5 h-15 w-full bg-gradient-to-b from-transparent md:-top-7"
      ></div>

      <div className="relative mx-auto flex items-center px-4 sm:max-w-2xl sm:px-6 xl:max-w-4xl xl:px-8">
        <NewChat
          value={chatInput.input}
          onChange={(e) => chatInput.setInput(e.target.value)}
          handleSubmit={handleSend}
          setAttachments={chatInput.setAttachments}
          attachments={chatInput.attachments}
          streaming={streaming}
        />
      </div>

      {/* Info note */}
      <div className="absolute -bottom-9 w-full md:-bottom-6">
        <p role="note" className="text-center text-xs">
          CloneGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
