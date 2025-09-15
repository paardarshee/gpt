export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/server/db";
import {
  Conversation,
  DBConversationType,
} from "@/lib/models/Conversation.model";
import { Message } from "@/lib/models/Message.model";
import { withMongooseSession } from "@/lib/server/session";
import { processAttachmentsAndStore } from "@/lib/uploads/attachments";
import { generateTextForMessage } from "@/lib/ai/generate";
import { ChatRequestBody } from "@/types";

import { DBMessageType } from "@/lib/models/Message.model";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const body: ChatRequestBody = await req.json();
  const searchparams = req.nextUrl.searchParams;
  const { msgId, conversationId, message, attachments = [] } = body;
  const temporary = searchparams.get("temporary") === "true";
  let { userId } = await auth();
  if (!userId || temporary) {
    userId = "anonymous";
  }
  // Sanity check
  if (!message || message.length === 0) {
    return NextResponse.json(
      { error: "No messages provided" },
      { status: 400 },
    );
  }
  await connectDB();
  let createdMessage: DBMessageType | null = null;

  await withMongooseSession(async (session) => {
    let conversation = await Conversation.findOne({ conversationId }).session(
      session,
    );
    if (!conversation) {
      const firstUserText = message ?? "New Chat";
      conversation = (
        await Conversation.create(
          [{ userId, title: firstUserText.substring(0, 50), conversationId }],
          { session },
        )
      )[0];
    }
    const msgs = await Message.create(
      [
        {
          conversationId: conversation._id,
          role: "user",
          content: message,
          msgId,
          attachments,
        },
      ],
      { session },
    );
    createdMessage = msgs[0];
  });

  if (attachments.length > 0) {
    (async () => {
      try {
        await processAttachmentsAndStore(attachments, createdMessage!.id);
      } catch (err) {
        console.error("background attachment upload error", err);
      }
    })();
  }
  const result = await generateTextForMessage(createdMessage!, userId);
  return result.toUIMessageStreamResponse();
}

export async function PATCH(req: NextRequest) {
  const { msgId, message }: { msgId: string; message: string } =
    await req.json();

  await connectDB();

  let conversation: DBConversationType | null = null;
  let messageToEdit: DBMessageType | null = null;

  // Run inside session
  await withMongooseSession(async (session) => {
    messageToEdit = await Message.findOne({ msgId }).session(session);
    if (!messageToEdit) {
      throw new Error("Message not found");
    }

    conversation = await Conversation.findOne({
      _id: messageToEdit.conversationId,
    }).session(session);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const oldMessageCreationTime = messageToEdit.createdAt;

    // Update message content
    messageToEdit.content = message;
    await messageToEdit.save({ session });

    // Delete all future messages created after this one
    await Message.deleteMany(
      {
        conversationId: messageToEdit.conversationId,
        createdAt: { $gt: oldMessageCreationTime },
      },
      { session },
    );
  });

  // Generate new AI response
  const result = await generateTextForMessage(
    messageToEdit!,
    (conversation! as DBConversationType).userId,
  );

  return result.toUIMessageStreamResponse();
}
