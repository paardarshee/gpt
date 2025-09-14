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
    <div className="group flex w-full flex-col gap-2">
      {/* Chat bubble */}
      <div className="flex w-full justify-end">
        <Attachments attachments={attachments || []} />
      </div>
      <div className="flex w-full justify-end">
        <div className="bg-bg-secondary relative max-w-[70%] rounded-2xl px-4 py-2.5 break-words whitespace-pre-wrap">
          {msg}
        </div>
      </div>

      {/* Copy / Edit buttons */}
      <div className="mt-1 flex justify-end gap-1 pr-1 text-sm opacity-0 transition-opacity group-hover:opacity-100">
        <button
          className="hover:bg-bg-secondary cursor-pointer rounded-lg p-1.5"
          title="Copy"
          onClick={() => handleCopy(setCopied, msg)}
        >
          {copied ? <Tick /> : <Copy />}
        </button>
        {!(attachments.length > 0) && (
          <button
            className="hover:bg-bg-secondary cursor-pointer rounded-lg p-1.5"
            title="Edit"
            onClick={onEditClick}
          >
            <Edit />
          </button>
        )}
      </div>
    </div>
  );
}
