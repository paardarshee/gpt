"use client";
import { use, useState } from "react";
import Conversations from "@/components/chat/Conversations";
import ChatInput from "@/components/chat/ChatInput";

type ChatProps = {
	params: Promise<{ chat_id: string }>;
};

export default function ChatPage({ params }: ChatProps) {
	const { chat_id } = use(params);
	const [streaming, setStreaming] = useState(false);

	return (
		<div className="flex flex-col bg-white dark:bg-[#343541] text-gray-900 dark:text-gray-100 relative h-full">
			<Conversations chatId={chat_id} streaming={streaming} />
			<ChatInput chatId={chat_id} setStreaming={setStreaming} />
		</div>
	);
}
