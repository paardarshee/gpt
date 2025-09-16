"use client";
import { useState, ChangeEvent, KeyboardEventHandler, useRef } from "react";
import {
  OutputCollectionStatus,
  UploadCtxProvider,
  OutputCollectionState,
} from "@uploadcare/react-uploader";

import { AttachmentType } from "@/types";
import { NewChatProps as UseNewChatProps } from "@/types";

export const useNewChat = ({
  value,
  onChange,
  handleSubmit,
  attachments,
  setAttachments,
  streaming = false,
}: UseNewChatProps) => {
  const fileInputRef = useRef<InstanceType<typeof UploadCtxProvider> | null>(
    null,
  );
  const [isMultiline, setIsMultiline] = useState(false);

  const submitChat = async () => {
    if (streaming || !value.trim()) return;
    setIsMultiline(false);
    await handleSubmit();
  };

  const handleMultiLineChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    if (!e.target.value.trim()) setIsMultiline(false);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = async (
    e,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await submitChat();
    }
  };

  const handleAddFileClick = () => {
    fileInputRef.current?.getAPI().initFlow();
  };

  const handleFileChange = (
    event: OutputCollectionState<OutputCollectionStatus, "maybe-has-group">,
  ) => {
    const attachmentsArray: AttachmentType[] = event.allEntries
      .filter((file) => file.status === "success")
      .map((file) => ({
        _id: file.uuid ?? "",
        url: file.cdnUrl ?? "",
        filename: file.fileInfo?.name ?? "unknown",
        fileType: file.fileInfo?.mimeType ?? "unknown",
        size: file.fileInfo?.size ?? 0,
      }));
    setAttachments([...attachments, ...attachmentsArray]);
  };
  return {
    isMultiline,
    setIsMultiline,
    submitChat,
    handleMultiLineChange,
    handleKeyDown,
    handleAddFileClick,
    handleFileChange,
    fileInputRef,
  };
};
