import { DBConversationType } from "@/lib/models/Conversation.model";

export interface ConversationResponse {
  success: boolean;
  result?: DBConversationType;
  error?: string;
}

export interface ConversationListResponse {
  success: boolean;
  result: DBConversationType[];
  error?: string;
}

export type ConversationProps = {
  chatId: string;
  streaming: boolean;
  setStreaming: (streaming: boolean) => void;
  handleAddBorder: (add: boolean) => void;
  temporary?: boolean;
};
