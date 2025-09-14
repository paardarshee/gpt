//root_page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { createUUID } from "@/lib/utils";
import { useChatInputStore } from "@/store/chatInputStore";
import NewChat from "@/components/ui/NewChat";
import TopBar from "@/components/layout/TopBar";
import TemporaryChat from "@/components/ui/TemporaryChat";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setNewChatInput = useChatStore((s) => s.setNewChatInput);
  const setRedirected = useChatStore((s) => s.setRedirected);
  const chatInput = useChatInputStore();

  const temporary = searchParams.get("temporary");
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

  if (temporary === "true") {
    return <TemporaryChat />;
  }
  return (
    <div
      className="relative flex h-full w-full flex-col"
      role="document"
      aria-label="CloneGPT home page"
    >
      {/* Input */}
      <div>
        <TopBar />
      </div>
      <div className="flex w-full flex-1 items-center justify-center px-4 py-4">
        <div className="mx-auto w-full max-w-3xl">
          <div className="text- mx-auto flex w-full justify-center p-2 text-2xl">
            Ready when You Are!
          </div>
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
