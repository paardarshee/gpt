"use client";

import UserChat from "@/components/chat/UserChat";
import AssistantChat from "@/components/chat/AssistantChat";
import EditMessage from "@/components/ui/EditMessage";

import { ConversationProps } from "@/types/conversation";
import { useConversations } from "@/hooks/useConversations";

export default function ConversationPage(props: ConversationProps) {
  const {
    scrollRef,
    messagesEndRef,
    messages,
    streamingText,
    editingIndex,
    editText,
    setEditingIndex,
    setEditText,
    handleEditSend,
    streaming,
  } = useConversations(props);

  return (
    <div
      ref={scrollRef}
      className="scrolled custom-scrollbar relative flex-1 overflow-y-auto [scrollbar-gutter:stable_both-edges]"
    >
      <div className="mx-auto mb-6 flex items-center px-4 sm:max-w-2xl sm:px-6 xl:max-w-4xl xl:px-8">
        <div className="flex grow flex-col gap-6">
          {messages.map((m, i) => (
            <div key={i} className="flex items-start gap-4 leading-relaxed">
              {m.role === "user" &&
                (editingIndex === i ? (
                  <EditMessage
                    value={editText}
                    onChange={setEditText}
                    onCancel={() => setEditingIndex(null)}
                    onSend={() => handleEditSend(i)}
                  />
                ) : (
                  <UserChat
                    msg={m.content}
                    onEditClick={() => {
                      setEditingIndex(i);
                      setEditText(m.content);
                    }}
                    attachments={m.attachments || []}
                  />
                ))}
              {m.role === "assistant" && <AssistantChat msg={m.content} />}
            </div>
          ))}
          {streaming && !streamingText && (
            <div className="animate-pulse text-gray-300">
              Generating response ...
            </div>
          )}
          {streamingText && <AssistantChat msg={streamingText} />}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
