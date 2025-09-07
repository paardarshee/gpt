"use client";

import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { createUUID } from "@/lib/utils";
import { useChatInputStore } from "@/store/chatInputStore";
import NewChat from "@/components/chat/NewChat";

export default function NewChatPage() {
	const router = useRouter();
	const setNewChatInput = useChatStore((s) => s.setNewChatInput);
	const setRedirected = useChatStore((s) => s.setRedirected);
	const chatInput = useChatInputStore();

	const handleSubmit = async () => {
		if (!chatInput.input.trim()) return;

		// 1. Create a new chat ID
		const chatId = createUUID();

		// 2. Save input + redirect flag in store
		setNewChatInput({
			input: chatInput.input,
			attachments: chatInput.attachments,
		});
		setRedirected(true);

		// Optionally clear the composer
		chatInput.clearInput();
		chatInput.clearAttachments();

		// 3. Go to chat page
		router.push(`/chats/${chatId}`);
	};

	return (
		<div className="flex flex-col bg-white dark:bg-[#343541] text-gray-900 dark:text-gray-100 relative h-full">
			{/* Input */}
			<div className="w-full border-t border-gray-200 dark:border-gray-700 px-4 py-4 flex-1 flex items-center justify-center">
				<div className="max-w-3xl mx-auto w-full">
					<div className="relative flex items-center">
						<NewChat
							value={chatInput.input}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
								chatInput.setInput(e.target.value)
							}
							handleSubmit={handleSubmit} // wrap for button
							setAttachments={chatInput.setAttachments}
							attachments={chatInput.attachments}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
