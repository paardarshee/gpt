import MemoryClient, { Message } from "mem0ai";
const client = new MemoryClient({ apiKey: process.env.MEM0_API_KEY! });

export const mem = client;

// Type for chat messages

// Store a message in a chat conversation
export async function storeMessage(
  userId: string,
  messages: Message[],
): Promise<void> {
  await mem.add(messages, {
    run_id: userId,
  });
}

// Get last N messages for a user conversation

export async function getConversationContext(
  userId: string,
  limit: number = 20,
): Promise<Message[]> {
  const response = await mem.getAll({ run_id: `user_${userId}`, limit });
  const allMessages: Message[] = [];
  response.forEach((e) => {
    e.messages?.forEach((msg) => {
      allMessages.push({ role: msg.role, content: msg.content as string });
    });
  });
  return allMessages;
}

// Get context with token limit (context window handling)
export async function getContextForModel(
  userId: string,
  limit: number = 20,
): Promise<string> {
  const response = await mem.getAll({ run_id: userId, limit });
  const context: string[] = [];
  response.forEach((e) => {
    context.push(e.memory as string);
  });
  return context.join("\n\n");
}
