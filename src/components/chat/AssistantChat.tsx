"use client";
import { Copy, Tick } from "../ui/SVG";
import React, { useState } from "react";
import Markdown from "@/components/ui/Markdown";
import { handleCopy } from "@/lib/utils";

type AssistantChatProps = {
  msg: string; // Assistant message content
};

/**
 * Renders assistant message with Markdown and a copy-to-clipboard button.
 * @param msg - The assistant's message content.
 */
export default function AssistantChat({ msg }: AssistantChatProps) {
  const [copied, setCopied] = useState(false);
  /**
   * Handles copying the assistant's message to the clipboard.
   */
  return (
    <div className="group flex w-full flex-col">
      {/* Chat bubble */}
      <div className="flex">
        <div className="relative rounded-2xl py-2.5 break-words whitespace-pre-wrap text-gray-100">
          <Markdown content={msg} />
          {/* <ReactMarkdown>{msg}</ReactMarkdown> */}
        </div>
      </div>

      {/* Copy button */}
      <div className="mt-1 flex gap-1 pr-1 text-sm text-gray-300 transition-opacity">
        <button
          className="hover:bg-bg-secondary cursor-pointer rounded-lg p-1.5"
          title="Copy"
          onClick={() => handleCopy(setCopied, msg)}
        >
          {copied ? <Tick /> : <Copy />}
        </button>
      </div>
    </div>
  );
}
