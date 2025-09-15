// src/lib/models/Conversation.ts
import { Document, Schema, model, models } from "mongoose";

interface DBConversationType extends Document {
  userId: string;
  title: string;
  conversationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<DBConversationType>(
  {
    userId: { type: String, required: true },
    title: { type: String },
    conversationId: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Conversation =
  models.Conversation ||
  model<DBConversationType>("Conversation", ConversationSchema);

export type { DBConversationType };
