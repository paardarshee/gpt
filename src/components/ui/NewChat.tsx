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
    disabled,
    submitChat,
    handleMultiLineChange,
    handleKeyDown,
    handleAddFileClick,
    handleFileChange,
    fileInputRef,
  } = useNewChat(props);
  const { attachments, value, setAttachments } = props;
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
              onClick={handleAddFileClick}
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
                onLineCountChange={(lineCount) => setIsMultiline(lineCount > 1)}
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
              onClick={submitChat}
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
