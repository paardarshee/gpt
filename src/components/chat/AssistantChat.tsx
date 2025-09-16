"use client";
import { Copy, Tick } from "../ui/SVG";
import React, { useState } from "react";
import Markdown from "@/components/ui/Markdown";
import { handleCopy } from "@/lib/utils";

type AssistantChatProps = {
  msg: string; // Assistant message content
  last?: boolean;
};

/**
 * Renders assistant message with Markdown and a copy-to-clipboard button.
 * Accessible for screen readers.
 */
export default function AssistantChat({
  msg,
  last = false,
}: AssistantChatProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className="group flex w-full flex-col"
      role="article"
      aria-label="Assistant message"
    >
      {/* Chat bubble */}
      <div className="flex">
        <div
          className="relative rounded-2xl break-words whitespace-pre-wrap"
          role="document"
          aria-live="polite"
        >
          <Markdown content={msg} />
        </div>
      </div>
      {/* Copy button */}
      <div className="mt-1 flex gap-1 pr-1 text-sm transition-opacity">
        <button
          type="button"
          className="hover:bg-icon-secondary cursor-pointer rounded-lg p-1.5"
          aria-label={copied ? "Message copied to clipboard" : "Copy message"}
          aria-pressed={copied}
          title="Copy message"
          onClick={() => handleCopy(setCopied, msg)}
        >
          {copied ? <Tick aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </button>
      </div>
      {last && <div className="h-8" />} {/* Extra margin for last message */}
    </div>
  );
}
