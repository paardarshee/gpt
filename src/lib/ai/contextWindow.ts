import { UIMessage } from "ai";

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
	msgId: string,
	MAX_TOKENS: number = 10000
): UIMessage[] {
	const memoryTokens = countTokens(memory);
	const lastMessageTokens = countTokens(lastMessage);

	const availableTokens = MAX_TOKENS - memoryTokens - lastMessageTokens;
	let historyTokens = 0;
	const trimmedHistory: UIMessage[] = [];
	for (const msg of history) {
		const msgTokens = countTokens(msg.content);
		if (historyTokens + msgTokens > availableTokens) {
			break;
		}
		historyTokens += msgTokens;
		trimmedHistory.push({
			id: msg._id.toString(),
			role: msg.role,
			parts: [{ type: "text", text: msg.content }],
		});
	}

	return [
		{
			id: "memory",
			role: "system",
			parts: [
				{
					type: "text",
					text: `This is your conversation memory : \n${memory}`,
				},
			],
		},
		...trimmedHistory.reverse(),
		{
			id: msgId.toString(),
			role: "user",
			parts: [{ type: "text", text: lastMessage }],
		},
	];
}
