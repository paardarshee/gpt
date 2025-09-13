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
import { bulkUploadToCloudinary } from "@/lib/uploads/cloudinary";
import { Attachment } from "@/lib/models/Attachment";

export const maxDuration = 30;

interface DBMEssageType {
  _id: string;
  role: "assistant" | "user" | "system";
  content: string;
  createdAt: Date;
  conversationId: mongoose.Types.ObjectId;
  msgId: string;
}

export interface AttachmentType {
  url: string;
  filename: string;
  fileType: string;
  size: number;
}
interface ChatRequestBody {
  msgId: string;
  message: string;
  conversationId: string;
  attachments: AttachmentType[];
}

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const body: ChatRequestBody = await req.json();
    const { msgId, conversationId, message, attachments } = body;

    // Sanity check
    if (!message || message.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 },
      );
    }
    const userId = "anonymous";

    await connectDB();
    let conversation = await Conversation.findOne({
      conversationId: conversationId,
    });

    if (!conversation) {
      const firstUserText = message ?? "New Chat";
      conversation = await Conversation.create(
        [
          {
            userId: userId,
            title: firstUserText.substring(0, 50),
            conversationId: conversationId,
          },
        ],
        { session },
      ).then((res) => res[0]);
    }

    const msg: DBMEssageType = await Message.create(
      [
        {
          conversationId: conversation._id,
          role: "user",
          content: message,
          msgId: msgId,
          attachments: attachments || [],
        },
      ],
      { session },
    ).then((res) => res[0]);

    await session.commitTransaction();
    if (attachments.length > 0) {
      (async () => {
        const msgId = msg._id;
        console.log(attachments);

        const uploadResults = await bulkUploadToCloudinary(attachments, msgId);

        const attachmentsData = uploadResults
          .filter((r) => r.success)
          .map((r) => {
            return {
              url: r.result.secure_url,
              filename: r.result.original_filename + "." + r.result.format,
              fileType: r.result.resource_type,
              size: r.result.bytes,
              msgId: msgId,
            };
          });
        console.log("Attachments Data:", attachmentsData);

        await Attachment.insertMany(attachmentsData);
      })();
    }
    const result = await generateText(msg);
    return result.toUIMessageStreamResponse();
  } catch (err: unknown) {
    await session.abortTransaction();
    if (err instanceof Error) {
      console.error("Chat route error:", err.message, err.stack);
    } else {
      console.error("Chat route error:", err);
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    await session.endSession();
  }
}

export async function PATCH(req: NextRequest) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { msgId, message }: { msgId: string; message: string } =
      await req.json();

    const messageToEdit = await Message.findOne({
      msgId: msgId,
    });

    if (!messageToEdit) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const oldMessageCreationTime = messageToEdit.createdAt;
    messageToEdit.content = message;
    await messageToEdit.save({ session });

    // Delete all messages updated after this message creation time

    await Message.deleteMany(
      {
        conversationId: messageToEdit.conversationId,
        createdAt: { $gt: oldMessageCreationTime },
      },
      { session },
    );
    await session.commitTransaction();
    const result = await generateText(messageToEdit as DBMEssageType);
    return result.toUIMessageStreamResponse();
  } catch (err: unknown) {
    await session.abortTransaction();
    if (err instanceof Error) {
      console.error("Chat route error:", err.message, err.stack);
    } else {
      console.error("Chat route error:", err);
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    await session.endSession();
  }
}

async function generateText(message: DBMEssageType) {
  try {
    const model = getModel();
    if (!model) {
      throw new Error("AI model not configured");
    }
    let contextMessages = "";
    await connectDB();
    const conversation = await Conversation.findById(message.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    if (process.env.NODE_ENV === "production") {
      contextMessages = await getContextForModel(conversation._id.toString());
    }
    const olderMessages = await getMessages(conversation._id);
    const msgfromUI = trimmingContext(
      contextMessages + "\n prefer answering in markdown format.",
      olderMessages as {
        _id: string;
        role: "assistant";
        content: string;
      }[],
      message.content,
      message._id,
      MAX_TOKENS,
    );

    const result = streamText({
      model,
      messages: convertToModelMessages(msgfromUI),
      onFinish: async ({ text }) => {
        // save assistant reply
        try {
          if (process.env.NODE_ENV === "production") {
            await storeMessage(conversation._id.toString(), [
              { role: "user", content: message.content },
              { role: "assistant", content: text },
            ]);
          }
          await Message.create({
            msgId: `reply_to_${message.msgId}`,
            conversationId: conversation._id,
            role: "assistant",
            content: text,
          });
        } catch (err) {
          console.error("Error storing assistant message:", err);
        }
      },
    });
    return result;
  } catch (err) {
    throw err;
  }
}
