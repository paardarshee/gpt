import { NextResponse, NextRequest } from "next/server";
import { Message } from "@/lib/models/Message";
import { Conversation } from "@/lib/models/Conversation";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id: conversationUUID } = await params;

	const conversation = await Conversation.findOne({
		conversationId: conversationUUID,
	});
	if (!conversation) {
		return NextResponse.json(
			{ message: "Conversation not found" },
			{ status: 404 }
		);
	}
	const id = conversation._id;
	const messages = await Message.aggregate([
		{ $match: { conversationId: id } },
		{ $sort: { createdAt: 1 } },
		{
			$lookup: {
				from: "attachments",
				localField: "attachments",
				foreignField: "_id",
				as: "attachments",
			},
		},
	]);
	console.log(
		`Fetched ${messages.length} messages for conversation ${conversationUUID}`
	);

	return NextResponse.json(messages);
}
