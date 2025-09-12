"use client";
import DynamicTextArea from "./DynamicTextArea";
import { useState, ChangeEvent, KeyboardEventHandler, useRef } from "react";
import { Plus, UpArrow } from "../SVG";
import { Attachment as AttachmentType } from "@/store/chatStore";
import Attachments from "@/components/Attachments";
type NewChatProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => Promise<void>;
  attachments: AttachmentType[];
  setAttachments: (attachments: AttachmentType[]) => void;
};

export default function NewChat({
  value,
  onChange,
  handleSubmit,
  attachments,
  setAttachments,
}: NewChatProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMultiline, setIsMultiline] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    if (!e.target.value.trim()) setIsMultiline(false);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (disabled) return;
      handleSubmit().finally(() => setDisabled(false));
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "application/pdf", // PDF
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-powerpoint", // .ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "text/plain", // .txt
      "text/csv", // .csv
    ];

    for (const file of files) {
      if (
        !allowedTypes.includes(file.type) &&
        !file.type.startsWith("image/")
      ) {
        alert(`File type not allowed: ${file.name}`);
        continue;
      }
      if (file.size > maxSize) {
        alert(`File too large (max 5MB): ${file.name}`);
        continue;
      }
      validFiles.push(file);
    }

    console.log("logged");

    if (validFiles.length > 0) {
      const formData = new FormData();
      for (const file of validFiles) {
        formData.append("file", file);
      }
      // Example: send files to /api/upload endpoint
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data: {
        attachments: AttachmentType[];
      } = await res.json();
      setAttachments([...attachments, ...data.attachments]);
    }

    // Reset the input so the same file can be selected again if needed
    event.target.value = "";
  };

  return (
    <div className="mx-auto w-full">
      <div
        className={`bg-bg-secondary shadow-border-default relative flex w-full flex-col rounded-4xl p-2 shadow-[0_0_0_0.2px] transition-all duration-300`}
      >
        {attachments.length > 0 && (
          <Attachments
            attachments={attachments}
            setAttachments={setAttachments}
            isEditable={true}
          />
        )}
        {/* Textarea for multiline input */}
        {isMultiline && (
          <div className={`w-full`}>
            <DynamicTextArea
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              isMultiline={isMultiline}
            />
          </div>
        )}
        <div className={`flex flex-row ${isMultiline && "justify-between"}`}>
          <div className={`flex items-center`}>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              multiple
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv"
            />
            <button
              className="hover:bg-bg-tertiary mr-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full focus:outline-none"
              onClick={handleButtonClick}
            >
              <Plus />
            </button>
          </div>

          {/* Textarea */}
          {!isMultiline && (
            <div className={`grow`}>
              <DynamicTextArea
                value={value}
                onChange={handleChange}
                onLineCountChange={(lineCount) =>
                  setIsMultiline((preState) => {
                    if (preState) return true;
                    return lineCount > 1;
                  })
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask Anything"
                isMultiline={isMultiline}
              />
            </div>
          )}
          <div className={`flex items-center gap-2`}>
            {/* Right Submit Button */}
            <button
              type="button"
              onClick={() => {
                if (disabled) return;
                setDisabled(true);
                handleSubmit().finally(() => setDisabled(false));
              }}
              disabled={!value.trim() || disabled}
              className="disabled:bg-bg-tertiary disabled:text-text-primary bg-bg-primary-inverted text-text-inverted flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-default"
            >
              <UpArrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
