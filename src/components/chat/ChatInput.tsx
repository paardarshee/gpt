"use client";
import { useStreamingAI } from "@/hooks/useStreamingAI";
import { createUUID } from "@/lib/utils";
import { useChatInputStore } from "@/store/chatInputStore";
import { useChatStore } from "@/store/chatStore";
import NewChat from "./NewChat";

export default function ChatInput({
	chatId,
	setStreaming,
}: {
	chatId: string;
	setStreaming: (streaming: boolean) => void;
}) {
	const { startStreaming } = useStreamingAI();
	const chatInput = useChatInputStore();
	const addMessage = useChatStore((s) => s.addMessage);

	const handleSend = async () => {
		if (!chatInput.input.trim()) return;
		setStreaming(true);
		const userMsgId = createUUID();
		addMessage(chatId, {
			role: "user",
			msgId: userMsgId,
			content: chatInput.input,
			attachments: chatInput.attachments,
		});

		const chatInputText = chatInput.input;
		const chatInputAttachments = chatInput.attachments;

		// Clear input immediately for better UX
		chatInput.clearInput();
		chatInput.clearAttachments();

		const aiMsgId = createUUID();
		const aiText = await startStreaming(
			aiMsgId,
			chatInputText,
			chatId,
			false,
			chatInputAttachments
		);
		if (aiText) {
			addMessage(chatId, {
				role: "assistant",
				content: aiText,
				attachments: chatInputAttachments,
			});
		}
		setStreaming(false);
	};

	return (
		<div className="relative -top-7 w-full bottom-0 border-gray-200 dark:border-gray-700">
			{/* Gradient overlay */}
			<div className="absolute -top-8 w-full h-15 bg-gradient-to-b from-transparent to-[#343541]"></div>

			<div className="lg:max-w-3xl md:max-w-2xl mx-auto relative flex items-center px-4 sm:px-6 lg:px-8">
				<NewChat
					value={chatInput.input}
					onChange={(e) => chatInput.setInput(e.target.value)}
					handleSubmit={handleSend}
					setAttachments={chatInput.setAttachments}
					attachments={chatInput.attachments}
				/>
			</div>
			<div className="absolute -bottom-6 w-full ">
				<p className="text-xs text-center text-gray-500 dark:text-gray-400">
					CloneGPT can make mistakes. Consider checking important information.
				</p>
			</div>
		</div>
	);
}
