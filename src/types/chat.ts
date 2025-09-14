import { AttachmentType } from "./attachment";
import { ChangeEvent } from "react";

export interface ChatRequestBody {
  msgId: string;
  message: string;
  conversationId: string;
  attachments: AttachmentType[];
}

export interface ChatResponse {
  success: boolean;
  result?: string; // AI response text
  error?: string;
}

export type NewChatProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => Promise<void>;
  attachments: AttachmentType[];
  setAttachments: (attachments: AttachmentType[]) => void;
};
