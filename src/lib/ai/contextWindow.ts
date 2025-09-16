import { AttachmentType } from "@/types";
import {
  SystemModelMessage,
  UserModelMessage,
  AssistantModelMessage,
  ToolModelMessage,
  FilePart,
  TextPart,
} from "ai";
/**
 * Approximate token counter (without external libs).
 * Rule of thumb:
 * - 1 token ≈ 4 characters
 * - Punctuation & emojis count as separate tokens
 * - Numbers treated as separate tokens
 */
export function countTokens(text: string): number {
  if (!text) return 0;

  // Normalize spaces
  const normalized = text.trim().replace(/\s+/g, " ");

  // Split into chunks: words, numbers, punctuation, emojis
  const chunks = normalized.match(/[\p{L}]+|\d+|[^\s\p{L}\d]/gu) || [];

  let tokens = 0;

  for (const chunk of chunks) {
    if (/^\d+$/.test(chunk)) {
      // Numbers → 1 token
      tokens += 1;
    } else if (/^[\p{L}]+$/u.test(chunk)) {
      // Words → ~1 token per 4 chars
      tokens += Math.ceil(chunk.length / 4);
    } else {
      // Symbols, punctuation, emojis → 1 token
      tokens += 1;
    }
  }

  return tokens;
}

export function trimmingContext(
  memory: string,
  history: {
    _id: string;
    role: "user" | "assistant" | "system";
    content: string;
  }[],
  lastMessage: string,
  attachments: AttachmentType[] = [],
  MAX_TOKENS: number = 10000,
): Array<
  | SystemModelMessage
  | UserModelMessage
  | AssistantModelMessage
  | ToolModelMessage
> {
  const memoryTokens = countTokens(memory);
  const lastMessageTokens = countTokens(lastMessage);

  const availableTokens = MAX_TOKENS - memoryTokens - lastMessageTokens;
  let historyTokens = 0;
  const trimmedHistory: Array<
    SystemModelMessage | UserModelMessage | AssistantModelMessage
  > = [];

  for (const msg of history) {
    const msgTokens = countTokens(msg.content);
    if (historyTokens + msgTokens > availableTokens) {
      break;
    }
    historyTokens += msgTokens;
    trimmedHistory.push({
      role: msg.role,
      content: msg.content,
    });
  }

  const attachmentParts: Array<FilePart> = attachments.map((att) => {
    return {
      type: "file",
      data: new URL(att.url),
      mediaType: att.fileType,
    };
  });
  const userText: TextPart = {
    type: "text",
    text: lastMessage,
  };
  return [
    {
      role: "system",
      content: `This is your conversation memory : \n${memory}`,
    },
    ...trimmedHistory.reverse(),
    {
      role: "user",
      content: [userText, ...attachmentParts],
    },
  ];
}
