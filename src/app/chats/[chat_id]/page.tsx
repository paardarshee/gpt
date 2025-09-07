"use client";
import { use } from "react";
import Conversations from "@/components/chat/Conversations";
import ChatInput from "@/components/chat/ChatInput";

type ChatProps = {
	params: Promise<{ chat_id: string }>;
};

export default function ChatPage({ params }: ChatProps) {
	const { chat_id } = use(params);

	return (
		<div className="flex flex-col h-screen bg-white dark:bg-[#343541] text-gray-900 dark:text-gray-100">
			<Conversations chatId={chat_id} />
			<ChatInput chatId={chat_id} />
		</div>
	);
}
