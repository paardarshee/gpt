"use client";
import { useStreamingAI } from "@/hooks/useStreamingAI";
import { createUUID } from "@/lib/utils";
import { useChatInputStore } from "@/store/chatInputStore";
import { useChatStore } from "@/store/chatStore";
import NewChat from "./NewChat";

export default function ChatInput({ chatId }: { chatId: string }) {
	const { startStreaming } = useStreamingAI();
	const chatInput = useChatInputStore();
	const addMessage = useChatStore((s) => s.addMessage);

	const handleSend = async () => {
		if (!chatInput.input.trim()) return;

		const userMsgId = createUUID();
		addMessage(chatId, {
			role: "user",
			msgId: userMsgId,
			content: chatInput.input,
			attachments: chatInput.attachments,
		});

		const aiMsgId = createUUID();
		const aiText = await startStreaming(
			aiMsgId,
			chatInput.input,
			chatId,
			false,
			chatInput.attachments
		);
		if (aiText) {
			addMessage(chatId, {
				role: "assistant",
				content: aiText,
				attachments: chatInput.attachments,
			});
		}
		chatInput.clearInput();
		chatInput.clearAttachments();
	};

	return (
		<div className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#343541] px-4 py-4">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSend();
				}}
				className="max-w-3xl mx-auto"
			>
				<div className="max-w-3xl mx-auto relative flex items-center">
					<NewChat
						value={chatInput.input}
						onChange={(e) => chatInput.setInput(e.target.value)}
						handleSubmit={handleSend}
						setAttachments={chatInput.setAttachments}
						attachments={chatInput.attachments}
					/>
				</div>
			</form>
			<p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
				ChatGPT can make mistakes. Consider checking important information.
			</p>
		</div>
	);
}
