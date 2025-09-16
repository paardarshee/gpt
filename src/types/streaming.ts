import { AttachmentType } from "@/types/attachment";

type StreamEvent = { type: string; delta?: string };

type BaseArgs = {
  msgId: string;
  content: string;
};

type EditArgs = BaseArgs & {
  isEdit: true;
};

type NewMessageArgs = BaseArgs & {
  isEdit?: false;
  conversationId: string;
  attachments?: AttachmentType[];
  temporary?: boolean;
};

type StartStreamingArgs = EditArgs | NewMessageArgs;

type StreamingRequestBody =
  | {
      msgId: string;
      message: string;
      conversationId: string;
      attachments?: AttachmentType[];
      temporary?: boolean;
    }
  | {
      msgId: string;
      message: string;
    };

export type { StartStreamingArgs, StreamingRequestBody, StreamEvent };
