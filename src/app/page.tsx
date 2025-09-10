"use client";

import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { createUUID } from "@/lib/utils";
import { useChatInputStore } from "@/store/chatInputStore";
import NewChat from "@/components/chat/NewChat";

export default function NewChatPage() {
  const router = useRouter();
  const setNewChatInput = useChatStore((s) => s.setNewChatInput);
  const setRedirected = useChatStore((s) => s.setRedirected);
  const chatInput = useChatInputStore();

  const handleSubmit = async () => {
    if (!chatInput.input.trim()) return;

    // 1. Create a new chat ID
    const chatId = createUUID();

    // 2. Save input + redirect flag in store
    setNewChatInput({
      input: chatInput.input,
      attachments: chatInput.attachments,
    });
    setRedirected(true);

    // Optionally clear the composer
    chatInput.clearInput();
    chatInput.clearAttachments();

    // 3. Go to chat page
    router.push(`/chats/${chatId}`);
  };

  return (
    <div className="relative flex h-full flex-col bg-white text-gray-900 dark:bg-[#343541] dark:text-gray-100">
      {/* Input */}

      <div className="flex w-full flex-1 items-center justify-center px-4 py-4">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mx-auto flex w-full justify-center p-2 text-4xl text-white">
            Ready when You Are!
          </div>
          <div className="relative flex items-center">
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
