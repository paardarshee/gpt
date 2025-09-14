import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { Conversation } from "@/lib/models/Conversation.model";
import { connectDB } from "@/lib/server/db";

// This API route handles fetching metadata for a specific conversation by its ID.
// It uses Clerk for authentication and ensures the user is authorized to access the conversation.
// The Conversation model is used to query the database for the conversation document.
// If the conversation is not found or the user is unauthorized, appropriate error responses are returned.
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
