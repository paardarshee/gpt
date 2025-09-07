import { NextResponse, NextRequest } from "next/server";
import { Conversation } from "@/lib/models/Conversation";
import { connectDB } from "@/lib/db";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id: conversationUUID } = await params;
	await connectDB();
	const conversation = await Conversation.findOne({
		conversationId: conversationUUID,
	});
	if (!conversation) {
		return NextResponse.json(
			{ message: "Conversation not found" },
			{ status: 404 }
		);
	}

	return NextResponse.json(conversation);
}
