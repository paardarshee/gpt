"use client";
import { AttachmentType } from "@/types";
import { Copy, Edit, Tick } from "@/components/ui/SVG";
import { useState } from "react";
import Attachments from "@/components/chat/Attachments";
import { handleCopy } from "@/lib/utils";

type UserChatProps = {
  msg: string;
  onEditClick: () => void;
  attachments: AttachmentType[];
};

export default function UserChat({
  msg,
  onEditClick,
  attachments,
}: UserChatProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className="group mt-4 flex w-full flex-col gap-2"
      role="group"
      aria-label="User message"
    >
      {/* Chat bubble attachments */}
      <div className="flex w-full justify-end">
        <Attachments attachments={attachments || []} />
      </div>

      {/* Chat text */}
      <div className="flex w-full justify-end">
        <div
          className="bg-bg-secondary relative max-w-[70%] rounded-2xl px-4 py-2.5 break-words whitespace-pre-wrap"
          role="textbox"
          aria-readonly="true"
        >
          {msg}
        </div>
      </div>

      {/* Copy / Edit buttons */}
      <div
        className="mt-1 flex justify-end gap-1 pr-1 text-sm opacity-0 transition-opacity group-hover:opacity-100"
        role="toolbar"
        aria-label="Message actions"
      >
        <button
          type="button"
          aria-label={copied ? "Message copied" : "Copy message"}
          onClick={() => handleCopy(setCopied, msg)}
          className="hover:bg-icon-secondary cursor-pointer rounded-lg p-1.5"
        >
          {copied ? <Tick aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </button>

        {!(attachments.length > 0) && (
          <button
            type="button"
            aria-label="Edit message"
            onClick={onEditClick}
            className="hover:bg-icon-secondary cursor-pointer rounded-lg p-1.5"
          >
            <Edit aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
