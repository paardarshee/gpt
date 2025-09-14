import { DBMessageType } from "@/lib/models/Message.model";

export interface MessageResponse {
  success: boolean;
  result?: DBMessageType;
  error?: string;
}
