import { streamText, convertToModelMessages } from "ai";
import { getModel, MAX_TOKENS } from "@/lib/ai/provider";
import { getContextForModel } from "@/lib/ai/memory";
import { trimmingContext } from "@/lib/ai/contextWindow";
import { Conversation } from "@/lib/models/Conversation.model";
import { Message } from "@/lib/models/Message.model";
import { storeMessage } from "@/lib/ai/memory";
import { connectDB } from "@/lib/server/db";
import { DBMessageType } from "@/lib/models/Message.model";

export async function generateTextForMessage(
  message: DBMessageType,
  userId: string = "anonymous",
) {
  const model = getModel();

  if (!model) throw new Error("AI model not configured");

  await connectDB();

  const conversation = await Conversation.findById(message.conversationId);
  if (!conversation) throw new Error("Conversation not found");
  let contextMessages = "";
  // if (process.env.NODE_ENV === "production") {
  if (userId !== "anonymous") {
    contextMessages = await getContextForModel(userId);
  }
  // }

  const olderMessages = await Message.find({
    conversationId: conversation._id,
  }).sort({ createdAt: 1 });

  const msgfromUI = trimmingContext(
    contextMessages + "\n prefer answering in markdown format.",
    olderMessages,
    message.content,
    message.id.toString(),
    MAX_TOKENS,
  );

  const result = streamText({
    model,
    messages: convertToModelMessages(msgfromUI),
    onFinish: async ({ text }) => {
      try {
        // if (process.env.NODE_ENV === "production") {
        if (userId !== "anonymous") {
          await storeMessage(userId, [
            { role: "user", content: message.content },
            { role: "assistant", content: text },
          ]);
        }
        // }
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
}
