// src/lib/models/Message.ts
import { Schema, model, models } from "mongoose";

const AttachmentSchema = new Schema(
	{
		url: { type: String, required: true },
		filename: { type: String, required: true },
		mimeType: { type: String, required: true },
		size: { type: Number, required: true },
	},
	{ timestamps: true }
);

export const Attachment =
	models.Attachment || model("Attachment", AttachmentSchema);
