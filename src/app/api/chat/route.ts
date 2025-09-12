export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { connectDB } from "@/lib/db";
import { getModel, MAX_TOKENS } from "@/lib/ai/provider";
import { storeMessage, getContextForModel } from "@/lib/ai/memory";
import { Conversation } from "@/lib/models/Conversation";
import { Message, getMessages } from "@/lib/models/Message";
import { trimmingContext } from "@/lib/ai/contextWindow";
import mongoose from "mongoose";

export const maxDuration = 30;

interface ChatRequestBody {
  isEdit?: boolean;
  msgId: string;
  message: string;
  conversationId: string;
  attachments?: string[];
}

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const body: ChatRequestBody = await req.json();
    const {
      msgId,
      conversationId,
      message,
      isEdit = false,
      attachments,
    } = body;

    // Sanity check
    if (!message || message.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 },
      );
    }
    const userId = "anonymous";
    const model = getModel();
    if (!model) {
      return NextResponse.json(
        { error: "AI model not configured" },
        { status: 500 },
      );
    }

    let contextMessages: string = "";
    await connectDB();
    let conversation = await Conversation.findOne({
      conversationId: conversationId,
    });

    if (!conversation) {
      const firstUserText = message ?? "New Chat";
      conversation = await Conversation.create(
        {
          userId: userId,
          title: firstUserText.substring(0, 50),
          conversationId: conversationId,
        },
        { session },
      );
    } else {
      if (process.env.NODE_ENV === "production") {
        contextMessages = await getContextForModel(conversation._id.toString());
      }
    }

    const findOrCreate = async () => {
      if (isEdit && conversation) {
        // If editing, just update the message and return

        const messageToEdit = await Message.findOne({
          msgId: msgId,
        });

        if (messageToEdit && messageToEdit.createdAt) {
          const oldMessageCreationTime = messageToEdit.createdAt;
          messageToEdit.content = message;
          await messageToEdit.save({ session });

          // Delete all messages updated after this message creation time

          await Message.deleteMany(
            {
              conversationId: conversation._id,
              createdAt: { $gt: oldMessageCreationTime },
            },
            { session },
          );
          return messageToEdit;
        }
      } else {
        const newMsg = new Message({
          conversationId: conversation._id,
          role: "user",
          content: message,
          msgId: msgId,
          attachments: attachments || [],
        });

        newMsg.save({ session });
        return newMsg;
      }
    };

    const msg = await findOrCreate();

    const olderMessages = await getMessages(conversation._id as string);

    if (!msg) {
      return NextResponse.json(
        { error: "Failed to create or update message" },
        { status: 500 },
      );
    }

    const msgfromUI = trimmingContext(
      contextMessages + "\n prefer answering in markdown format.",
      olderMessages as {
        _id: string;
        role: "assistant";
        content: string;
      }[],
      message,
      msg._id,
      MAX_TOKENS,
    );

    // Stream AI response
    const result = streamText({
      model,
      messages: convertToModelMessages(msgfromUI),
      onFinish: async ({ text }) => {
        // save assistant reply
        if (process.env.NODE_ENV === "production") {
          await storeMessage(conversation._id.toString(), [
            { role: "user", content: message as string },
            { role: "assistant", content: text },
          ]);
        }
        const assistantMSg = new Message({
          msgId: `reply_to_${msgId}`,
          conversationId: conversation._id,
          role: "assistant",
          content: text,
        });
        await assistantMSg.save({ session });
        await session.commitTransaction();
        await session.endSession();
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err: unknown) {
    await session.endSession();
    if (err instanceof Error) {
      console.error("Chat route error:", err.message, err.stack);
    } else {
      console.error("Chat route error:", err);
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
