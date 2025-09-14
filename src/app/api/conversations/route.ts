import { NextResponse } from "next/server";
import { Conversation } from "@/lib/models/Conversation.model";
import { connectDB } from "@/lib/server/db";
import { auth } from "@clerk/nextjs/server";
export async function GET() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const conversations = await Conversation.find({
    userId: session.userId,
  }).sort({
    updatedAt: -1,
  });

  return NextResponse.json({ conversations });
}
