import { useState, useRef, useCallback } from "react";
import { Attachment } from "@/store/chatStore";

// Hook for streaming AI
export function useStreamingAI() {
	const [streamingText, setStreamingText] = useState<string | null>(null);
	const accumulatedTextRef = useRef("");
	const bufferRef = useRef("");

	const startStreaming = useCallback(
		async (
			msgId: string,
			input: string,
			conversationId: string,
			isEdit = false,
			attachments: Attachment[] = []
		) => {
			// Reset all state
			setStreamingText("");
			accumulatedTextRef.current = "";
			bufferRef.current = "";

			const attachmentIds = attachments
				.map((att) => att._id)
				.filter((id): id is string => !!id);
			try {
				const res = await fetch("/api/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						msgId,
						message: input,
						conversationId,
						isEdit,
						attachments: attachmentIds,
					}),
				});

				if (!res.body) {
					setStreamingText(null);
					return "";
				}

				const reader = res.body.getReader();
				const decoder = new TextDecoder("utf-8");

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					// Decode the chunk
					const chunk = decoder.decode(value, { stream: true });

					// Add to buffer (handles partial lines)
					bufferRef.current += chunk;

					// Process complete lines
					const lines = bufferRef.current.split("\n");

					// Keep the last potentially incomplete line in buffer
					bufferRef.current = lines.pop() || "";

					// Process each complete line
					for (const line of lines) {
						const trimmedLine = line.trim();
						if (!trimmedLine.startsWith("data:")) continue;

						const jsonStr = trimmedLine.replace(/^data:\s*/, "");
						if (jsonStr === "[DONE]") continue;

						try {
							const event = JSON.parse(jsonStr);
							if (event.type === "text-delta" && event.delta) {
								// Accumulate the text
								accumulatedTextRef.current += event.delta;
								// Update the streaming text with the full accumulated text
								setStreamingText(accumulatedTextRef.current);
							}
						} catch (parseError) {
							console.warn(
								"Failed to parse streaming JSON:",
								jsonStr,
								parseError
							);
						}
					}
				}

				// Process any remaining buffer content
				if (bufferRef.current.trim()) {
					const trimmedLine = bufferRef.current.trim();
					if (trimmedLine.startsWith("data:")) {
						const jsonStr = trimmedLine.replace(/^data:\s*/, "");
						if (jsonStr !== "[DONE]") {
							try {
								const event = JSON.parse(jsonStr);
								if (event.type === "text-delta" && event.delta) {
									accumulatedTextRef.current += event.delta;
									setStreamingText(accumulatedTextRef.current);
								}
							} catch (parseError) {
								console.warn(
									"Failed to parse final streaming JSON:",
									jsonStr,
									parseError
								);
							}
						}
					}
				}

				const finalMessage = accumulatedTextRef.current;
				setStreamingText(null);
				return finalMessage;
			} catch (error) {
				console.error("Streaming error:", error);
				setStreamingText(null);
				return "";
			}
		},
		[]
	);

	return { streamingText, startStreaming };
}
