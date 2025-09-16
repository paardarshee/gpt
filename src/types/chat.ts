import { AttachmentType } from "./attachment";
import { ChangeEvent } from "react";
import { StartStreamingArgs } from "./streaming";

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
  streaming?: boolean;
};

export type ChatInputProps = {
  chatId: string; // Unique identifier for the chat session
  setStreaming: (streaming: boolean) => void; // Function to update streaming state
  streaming: boolean;
  streamingText: string | null;
  startStreaming: (args: StartStreamingArgs) => Promise<string>;
};
