// src/lib/models/Message.ts
import { Schema, model, models, Types } from "mongoose";

const MessageSchema = new Schema(
	{
		msgId: { type: String, required: true, unique: true },
		conversationId: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		role: {
			type: String,
			enum: ["user", "assistant", "system"],
			required: true,
		},
		content: { type: String, required: true },
		attachments: [{ type: Schema.Types.ObjectId, ref: "Attachment" }],
	},
	{ timestamps: true }
);

export const Message = models.Message || model("Message", MessageSchema);

export async function getMessages(conversationId: string) {
	return await Message.aggregate([
		{ $match: { conversationId: new Types.ObjectId(conversationId) } },
		{ $sort: { updatedAt: -1 } },
	]);
}
