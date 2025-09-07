import { NextResponse } from "next/server";
import { Conversation } from "@/lib/models/Conversation";
import { connectDB } from "@/lib/db";

export async function GET() {
	await connectDB();
	const conversations = await Conversation.find().sort({ updatedAt: -1 });
	console.log(conversations);

	return NextResponse.json({ conversations });
}
