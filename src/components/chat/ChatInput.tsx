"use client";

import { useStreamingAI } from "@/hooks/useStreamingAI";
import { createUUID } from "@/lib/utils";
import { useChatInputStore } from "@/store/chatInputStore";
import { useChatStore } from "@/store/chatStore";
import NewChat from "@/components/ui/NewChat";

type ChatInputProps = {
  chatId: string; // Unique identifier for the chat session
  setStreaming: (streaming: boolean) => void; // Function to update streaming state
};

/**
 * Chat input component: handles sending user messages, starting streaming, and rendering input UI.
 */
export default function ChatInput({ chatId, setStreaming }: ChatInputProps) {
  const { startStreaming } = useStreamingAI();
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
      className="relative -top-7 bottom-0 w-full"
      role="form"
      aria-label="Chat input area"
    >
      {/* Decorative gradient overlay */}
      <div
        aria-hidden="true"
        className="to-bg-primary absolute -top-8 h-15 w-full bg-gradient-to-b from-transparent"
      ></div>

      <div className="relative mx-auto flex items-center px-4 sm:max-w-2xl sm:px-6 xl:max-w-4xl xl:px-8">
        <NewChat
          value={chatInput.input}
          onChange={(e) => chatInput.setInput(e.target.value)}
          handleSubmit={handleSend}
          setAttachments={chatInput.setAttachments}
          attachments={chatInput.attachments}
        />
      </div>

      {/* Info note */}
      <div className="absolute -bottom-6 w-full">
        <p role="note" className="text-center text-xs">
          CloneGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
