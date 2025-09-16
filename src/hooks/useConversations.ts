"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useChatStore } from "@/store/chatStore";
import { useConversationStore } from "@/store/conversationStore";
import { createUUID } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";
import type { Conversation } from "@/store/conversationStore";
import { ConversationProps } from "@/types/conversation";

export const useConversations = ({
  chatId,
  temporary = false,
  setStreaming,
  handleAddBorder,
  streaming,
  streamingText,
  startStreaming,
}: ConversationProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const getNewChatInput = useChatStore((s) => s.getNewChatInput);
  const isRedirected = useChatStore((s) => s.isRedirected);
  const setRedirected = useChatStore((s) => s.setRedirected);
  const addMessage = useChatStore((s) => s.addMessage);
  const deleteMessagesFromIndex = useChatStore(
    (s) => s.deleteMessagesFromIndex,
  );
  const messages = useChatStore(
    useShallow((s) => s.conversations[chatId] || []),
  );

  const addConversation = useConversationStore((s) => s.addConversation);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      if (el.scrollTop > 10) {
        handleAddBorder(true);
      } else {
        handleAddBorder(false);
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  });

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [streamingText, messages]);

  // Handle redirect + fetch conversation
  useEffect(() => {
    const handleRedirectedChat = async () => {
      const newChatInput = getNewChatInput();
      if (!isRedirected || !newChatInput) return;

      setStreaming(true);
      const msgId = createUUID();
      addMessage(chatId, {
        role: "user",
        msgId,
        content: newChatInput.input,
        attachments: newChatInput.attachments,
      });

      const aiText = await startStreaming({
        msgId,
        content: newChatInput.input,
        conversationId: chatId,
        attachments: newChatInput.attachments,
        temporary,
      });

      setStreaming(false);

      if (aiText) {
        addMessage(chatId, {
          role: "assistant",
          content: aiText,
          attachments: newChatInput.attachments,
        });
      }

      if (!temporary) {
        const res = await fetch(`/api/conversations/${chatId}/metadata`);
        const convoData: Conversation = await res.json();

        addConversation({
          userId: convoData.userId,
          title: convoData.title,
          conversationId: chatId,
        });
      }

      setRedirected(false);
    };

    const loadConversation = async () => {
      if (temporary) return;
      try {
        const res = await fetch(`/api/conversations/${chatId}`);
        if (!res.ok) return;

        const data = await res.json();
        const msgs = Array.isArray(data) ? data : data.messages || [];
        useChatStore.getState().addNewConversation(chatId, msgs);
      } catch (err) {
        console.warn("Failed to load conversation", err);
      }
    };
    if (isRedirected) {
      handleRedirectedChat();
      return;
    }
    loadConversation();

    if (!temporary) loadConversation();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, isRedirected]);
  const handleEditSend = async (index: number) => {
    if (!editText.trim()) return;
    setStreaming(true);
    const msgId = messages[index]?.msgId || "";

    deleteMessagesFromIndex(chatId, index);
    addMessage(chatId, { role: "user", content: editText });

    setEditingIndex(null);
    setEditText("");

    const aiText = await startStreaming({
      msgId,
      content: editText,
      isEdit: true,
    });
    if (aiText) {
      addMessage(chatId, { role: "assistant", content: aiText });
    }
    setStreaming(false);
  };

  return {
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
  };
};
