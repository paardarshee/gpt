import { NextResponse } from "next/server";
import { Conversation } from "@/lib/models/Conversation";

export async function GET() {
	const conversations = await Conversation.find().sort({ updatedAt: -1 });
	console.log(conversations);

	return NextResponse.json({ conversations });
}
