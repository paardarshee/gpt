import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { Conversation } from "@/lib/models/Conversation.model";
import { connectDB } from "@/lib/server/db";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id: conversationUUID } = await params;
  await connectDB();
  const conversation = await Conversation.findOne({
    conversationId: conversationUUID,
    userId: session.userId,
  });
  if (!conversation) {
    return NextResponse.json(
      { message: "Conversation not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(conversation);
}
