"use client";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

import { Plus, UpArrow } from "./SVG";
import { NewChatProps } from "@/types";
import Attachments from "@/components/chat/Attachments";
import DynamicTextArea from "./DynamicTextArea";
import { useNewChat } from "@/hooks/useNewChat";

export default function NewChat(props: NewChatProps) {
  const {
    isMultiline,
    setIsMultiline,
    submitChat,
    handleMultiLineChange,
    handleKeyDown,
    handleAddFileClick,
    handleFileChange,
    fileInputRef,
  } = useNewChat(props);
  const { attachments, value, setAttachments, streaming } = props;

  return (
    <div className="mx-auto w-full">
      <div
        className="bg-bg-secondary shadow-border-default relative flex w-full flex-col justify-center rounded-[30px] p-2 shadow-[0_0_0_0.5px__var(--color-border-default)] transition-all duration-300"
        role="form"
        aria-label="New chat input form"
      >
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <Attachments
            attachments={attachments}
            setAttachments={setAttachments}
            isEditable={true}
          />
        )}

        {/* Multiline Text Input */}
        {isMultiline && (
          <div className="flex h-full w-full items-center">
            <DynamicTextArea
              value={value}
              onChange={handleMultiLineChange}
              onKeyDown={handleKeyDown}
              isMultiline={isMultiline}
              aria-label="Chat message input"
            />
          </div>
        )}

        <div className={`flex flex-row ${isMultiline && "justify-between"}`}>
          <div className="flex items-center">
            {/* File Uploader */}
            <FileUploaderRegular
              pubkey="a207cf9454fc76110b33"
              apiRef={fileInputRef}
              headless={true}
              onChange={handleFileChange}
              maxLocalFileSizeBytes={5 * 1024 * 1024}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
              store={false}
              multiple
              aria-label="Upload a file"
            />

            {/* File Upload Button */}
            <button
              type="button"
              aria-label="Add file"
              className="hover:bg-icon-tertiary mr-2 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none"
              onClick={handleAddFileClick}
            >
              <Plus aria-hidden="true" />
            </button>
          </div>

          {/* Single-line Text Input */}
          {!isMultiline && (
            <div className="grow">
              <DynamicTextArea
                value={value}
                onChange={handleMultiLineChange}
                onLineCountChange={(lineCount) => setIsMultiline(lineCount > 1)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Anything"
                isMultiline={isMultiline}
                aria-label="Chat message input"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Submit Button */}
            <button
              type="button"
              onClick={submitChat}
              disabled={!value.trim() || streaming || value.length > 1_00_00}
              aria-label="Send message"
              className="disabled:bg-icon-tertiary disabled:text-text-primary bg-bg-primary-inverted text-text-inverted flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none disabled:cursor-default"
            >
              <UpArrow aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
