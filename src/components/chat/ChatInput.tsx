"use client";
import { useStreamingAI } from "@/hooks/useStreamingAI";
import { createUUID } from "@/lib/utils";
import { useChatInputStore } from "@/store/chatInputStore";
import { useChatStore } from "@/store/chatStore";
import NewChat from "./NewChat";

type ChatInputProps = {
  chatId: string; // Unique identifier for the chat session
  setStreaming: (streaming: boolean) => void; // Function to update streaming state
};
/**
 * Chat input component: handles sending user messages, starting streaming, and rendering input UI.
 * @param chatId - Unique identifier for the chat session
 * @param setStreaming - Function to update streaming state
 */
export default function ChatInput({ chatId, setStreaming }: ChatInputProps) {
  const { startStreaming } = useStreamingAI();
  const chatInput = useChatInputStore();
  const addMessage = useChatStore((s) => s.addMessage);

  /**
   * Handles sending a user message:
   * 1. Adds user message to store
   * 2. Clears input and attachments
   * 3. Starts AI streaming
   * 4. Appends assistant's response when streaming completes
   *
   * @returns  Resolves when message handling and streaming are complete
   */
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
    console.log(
      "Before streaming:",
      useChatStore.getState().getMessages(chatId),
    );

    const aiText = await startStreaming(
      userMsgId,
      chatInputSnapshot.input,
      chatId,
      false,
      chatInputSnapshot.attachments,
    );
    console.log(
      "After streaming:",
      useChatStore.getState().getMessages(chatId),
    );

    setStreaming(false);
    if (aiText) {
      addMessage(chatId, {
        role: "assistant",
        content: aiText,
      });
    }
  };

  return (
    <div className="relative -top-7 bottom-0 w-full border-gray-200 dark:border-gray-700">
      {/* Gradient overlay */}
      <div className="to-bg-primary absolute -top-8 h-15 w-full bg-gradient-to-b from-transparent"></div>

      <div className="relative mx-auto flex items-center px-4 sm:max-w-2xl sm:px-6 xl:max-w-4xl xl:px-8">
        <NewChat
          value={chatInput.input}
          onChange={(e) => chatInput.setInput(e.target.value)}
          handleSubmit={handleSend}
          setAttachments={chatInput.setAttachments}
          attachments={chatInput.attachments}
        />
      </div>
      <div className="absolute -bottom-6 w-full">
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          CloneGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
