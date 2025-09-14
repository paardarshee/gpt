// src/lib/models/Message.ts
import { Schema, model, models, Document } from "mongoose";

const AttachmentSchema = new Schema(
  {
    msgId: { type: Schema.Types.ObjectId, ref: "Message", required: true },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    fileType: { type: String, enum: ["image", "document"], required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Attachment =
  models.Attachment || model("Attachment", AttachmentSchema);

interface DBAttachmentType extends Document {
  msgId: Schema.Types.ObjectId;
  url: string;
  filename: string;
  fileType: "image" | "document";
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

export type { DBAttachmentType };
