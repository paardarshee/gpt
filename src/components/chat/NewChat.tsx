"use client";
import DynamicTextArea from "./DynamicTextArea";
import {
  useState,
  ChangeEvent,
  KeyboardEventHandler,
  useRef,
  useEffect,
} from "react";
import { Plus, UpArrow } from "../SVG";
import { Attachment as AttachmentType } from "@/store/chatStore";
import Attachments from "@/components/Attachments";
import {
  OutputCollectionStatus,
  UploadCtxProvider,
  OutputCollectionState,
} from "@uploadcare/react-uploader";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";

import "@uploadcare/react-uploader/core.css";
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
  const fileInputRef = useRef<InstanceType<typeof UploadCtxProvider> | null>(
    null,
  );
  const [isMultiline, setIsMultiline] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const handleMultiLineChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    if (!e.target.value.trim()) setIsMultiline(false);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = async (
    e,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (disabled) return;
      await handleSubmit().finally(() => setDisabled(false));
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      const api = fileInputRef.current.getAPI();
      api.initFlow();
    }
  };

  const handleFileChange = (
    event: OutputCollectionState<OutputCollectionStatus, "maybe-has-group">,
  ) => {
    const attachmentsArray: AttachmentType[] = event.allEntries
      .filter((file) => file.status === "success")
      .map((file) => {
        const uuid = file.uuid || "";
        const filename = file.fileInfo?.name || "unknown";
        const url = file.cdnUrl || "";
        const size = file.fileInfo?.size || 0;
        const fileType = file.fileInfo?.mimeType?.startsWith("image/")
          ? "image"
          : "document";
        return {
          _id: uuid,
          url: url,
          filename: filename,
          fileType: fileType,
          size: size,
        };
      });
    setAttachments([...attachments, ...attachmentsArray]);
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

        {isMultiline && (
          <div className={`w-full`}>
            <DynamicTextArea
              value={value}
              onChange={handleMultiLineChange}
              onKeyDown={handleKeyDown}
              isMultiline={isMultiline}
            />
          </div>
        )}
        <div className={`flex flex-row ${isMultiline && "justify-between"}`}>
          <div className={`flex items-center`}>
            <FileUploaderRegular
              pubkey="a207cf9454fc76110b33"
              apiRef={fileInputRef}
              headless={true}
              onChange={handleFileChange}
              maxLocalFileSizeBytes={5 * 1024 * 1024}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
              store={false}
              multiple
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
                onChange={handleMultiLineChange}
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
