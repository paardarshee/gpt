import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { Message } from "@/lib/models/Message.model";
import { Conversation } from "@/lib/models/Conversation.model";
import { connectDB } from "@/lib/server/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: conversationUUID } = await params;
  await connectDB();
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const conversation = await Conversation.findOne({
    conversationId: conversationUUID,
  });
  if (!conversation) {
    return NextResponse.json(
      { message: "Conversation not found" },
      { status: 404 },
    );
  }
  const id = conversation._id;

  const messages = await Message.aggregate([
    { $match: { conversationId: id } },
    { $sort: { createdAt: 1 } },
    {
      $lookup: {
        from: "attachments",
        let: { msgId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$msgId", "$$msgId"] } } },
          { $sort: { createdAt: 1 } },
        ],
        as: "attachments",
      },
    },
  ]);

  return NextResponse.json(messages);
}
