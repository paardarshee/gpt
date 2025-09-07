// src/lib/models/Message.ts
import { Schema, model, models } from "mongoose";

const AttachmentSchema = new Schema(
	{
		url: { type: String, required: true },
		filename: { type: String, required: true },
		fileType: { type: String, enum: ["image", "document"], required: true },
		size: { type: Number, required: true },
	},
	{ timestamps: true }
);

export const Attachment =
	models.Attachment || model("Attachment", AttachmentSchema);
