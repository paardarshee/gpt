"use client";

import Image from "next/image";
import { Plus, Document } from "@/components/ui/SVG";
import { AttachmentType } from "@/types";

type AttachmentsProps = {
  attachments: AttachmentType[];
  setAttachments?: (attachments: AttachmentType[]) => void;
  isEditable?: boolean;
};

export default function Attachments({
  attachments,
  setAttachments,
  isEditable = false,
}: AttachmentsProps) {
  const handleRemove = (index: number) => {
    if (!setAttachments) return;
    const updated = attachments.filter((_, i) => i !== index);
    setAttachments(updated);
  };

  return (
    <div
      className={`flex w-full gap-2 ${
        isEditable
          ? "hide-scrollbar overflow-x-scroll py-2"
          : "flex-col items-end"
      }`}
      role="list"
      aria-label="Attachments"
    >
      {attachments.map((attachment, index) => (
        <div
          key={index}
          role="listitem"
          aria-label={`Attachment: ${attachment.filename}`}
          className="relative inline-flex w-fit items-center"
        >
          {attachment.fileType === "image" ? (
            <div
              className={`relative ${
                isEditable
                  ? "bg-bg-tertiary h-16 w-16"
                  : "bg-bg-secondary h-64 w-64"
              } flex-shrink-0 overflow-hidden rounded-lg`}
            >
              <Image
                src={attachment.url}
                alt={`Image attachment: ${attachment.filename}`}
                fill
                className="object-cover"
              />

              {isEditable && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 z-10 rounded-full bg-white p-1 shadow-sm hover:bg-gray-300"
                  aria-label={`Remove image attachment: ${attachment.filename}`}
                >
                  <div
                    className="flex h-3 w-3 rotate-45 items-center justify-center text-black"
                    aria-hidden="true"
                  >
                    <Plus />
                  </div>
                </button>
              )}
            </div>
          ) : (
            <div
              className="border-border-default relative box-border flex items-center gap-3 rounded-lg border p-2"
              role="group"
              aria-label={`Document attachment: ${attachment.filename}`}
            >
              {isEditable && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 z-10 rounded-full bg-white p-1 shadow-sm hover:bg-gray-300"
                  aria-label={`Remove document attachment: ${attachment.filename}`}
                >
                  <div
                    className="flex h-3 w-3 rotate-45 items-center justify-center text-black"
                    aria-hidden="true"
                  >
                    <Plus />
                  </div>
                </button>
              )}

              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-500 text-white"
                aria-hidden="true"
              >
                <Document className="h-5 w-5" />
              </div>

              <div className="flex w-40 flex-col sm:w-52">
                <span className="truncate text-sm font-medium text-ellipsis text-white">
                  {attachment.filename}
                </span>
                <span className="text-xs text-zinc-400 capitalize">
                  {attachment.filename.split(".").pop()?.toUpperCase() ||
                    attachment.fileType.charAt(0).toUpperCase() +
                      attachment.fileType.slice(1)}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
