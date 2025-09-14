// src/lib/models/Conversation.ts
import { Document, Schema, model, models } from "mongoose";

const ConversationSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String },
    conversationId: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Conversation =
  models.Conversation || model("Conversation", ConversationSchema);

interface DBConversationType extends Document {
  userId: string;
  title: string;
  conversationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { DBConversationType };
