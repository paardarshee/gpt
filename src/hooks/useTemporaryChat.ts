// hooks/useTemporaryChatVM.ts
"use client";

import { useState, useRef, useCallback } from "react";
import { useChatInputStore } from "@/store/chatInputStore";
import { useChatStore } from "@/store/chatStore";
import { createUUID } from "@/lib/utils";
import { useStreamingAI } from "./useStreamingAI";

export function useTemporaryChat() {
  const { streamingText, startStreaming } = useStreamingAI();
  const [chatId] = useState(() => createUUID());
  const [status, setStatus] = useState<"initial" | "anonymous">("initial");
  const [streaming, setStreaming] = useState(false);

  const topBarRef = useRef<HTMLDivElement>(null);

  const chatInput = useChatInputStore();
  const { setNewChatInput, setRedirected } = useChatStore();
  const handleAddBorder = useCallback((add: boolean) => {
    const bar = topBarRef.current;
    if (!bar) return;
    bar.classList.toggle("bottom-border", add);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!chatInput.input.trim()) return;

    setNewChatInput({
      input: chatInput.input,
      attachments: chatInput.attachments,
    });
    setRedirected(true);

    chatInput.clearInput();
    chatInput.clearAttachments();

    setStatus("anonymous");
  }, [chatInput, setNewChatInput, setRedirected]);

  return {
    // Model
    chatId,
    status,
    streaming,
    topBarRef,
    streamingText,
    startStreaming,
    // State Setters

    // Handlers
    handleAddBorder,
    handleSubmit,
    setStreaming,
    setStatus,
    chatInput,
  };
}
