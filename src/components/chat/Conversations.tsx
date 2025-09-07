"use client";

import { useEffect, useState, useRef } from "react";
import { useStreamingAI } from "@/hooks/useStreamingAI";
import { useChatStore } from "@/store/chatStore";
import { createUUID } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";
import UserChat from "@/components/chat/UserChat";
import AssistantChat from "@/components/chat/AssistantChat";
import EditMessage from "./EditMEssage";
import { Conversation, useConversationStore } from "@/store/conversationStore";

export default function Connversations({
	chatId,
	streaming,
	setStreaming,
}: {
	chatId: string;
	streaming: boolean;
	setStreaming: (streaming: boolean) => void;
}) {
	const { streamingText, startStreaming } = useStreamingAI();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editText, setEditText] = useState("");

	const getNewChatInput = useChatStore((s) => s.getNewChatInput);
	const isRedirected = useChatStore((s) => s.isRedirected);
	const setRedirected = useChatStore((s) => s.setRedirected);
	const addMessage = useChatStore((s) => s.addMessage);
	const deleteMessagesAfterIndex = useChatStore(
		(s) => s.deleteMessagesAfterIndex
	);
	const messages = useChatStore(
		useShallow((s) => s.conversations[chatId] || [])
	);

	const addConversation = useConversationStore((s) => s.addConversation);

	// Scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [streamingText, messages]);

	// Handle redirect + fetch conversation
	useEffect(() => {
		const newChatInput = getNewChatInput();

		if (isRedirected && newChatInput) {
			const msgId = createUUID();
			addMessage(chatId, {
				role: "user",
				msgId,
				content: newChatInput.input,
				attachments: newChatInput.attachments,
			});
			setStreaming(true);

			(async () => {
				const aiText = await startStreaming(
					msgId,
					newChatInput.input,
					chatId,
					false,
					newChatInput.attachments
				);
				setStreaming(false);
				if (aiText) {
					addMessage(chatId, {
						role: "assistant",
						content: aiText,
						attachments: newChatInput.attachments,
					});
				}
				const conversation = await fetch(
					`/api/conversations/${chatId}/metadata`
				);
				const convoData: Conversation = await conversation.json();

				addConversation({
					userId: convoData.userId,
					title: convoData.title,
					conversationId: chatId,
				});
			})();

			setRedirected(false);
			return;
		}

		const loadConversation = async () => {
			try {
				const res = await fetch(`/api/conversations/${chatId}`);
				if (!res.ok) return;
				const data = await res.json();
				const msgs = Array.isArray(data) ? data : data.messages || [];
				useChatStore.getState().addNewConversation(chatId, msgs);
			} catch (err) {
				console.warn("Failed to load conversation", err);
			}
		};

		loadConversation();
	}, [chatId, isRedirected]);

	const handleEditSend = async (index: number) => {
		if (!editText.trim()) return;
		setStreaming(true);
		const msgId = messages[index]?.msgId || "";
		deleteMessagesAfterIndex(chatId, index - 1);
		addMessage(chatId, { role: "user", content: editText });

		setEditingIndex(null);
		setEditText("");

		const aiText = await startStreaming(msgId, editText, chatId, true);
		if (aiText) {
			addMessage(chatId, { role: "assistant", content: aiText });
		}
		setStreaming(false);
	};

	return (
		<div className="flex-1 overflow-y-auto [scrollbar-gutter:stable] ">
			{/* <div className="lg:max-w-3xl md:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-red-800 w-full"> */}
			<div className="lg:max-w-3xl md:max-w-2xl mx-auto pl-4 pr-[7px] sm:pl-6 sm:pr-[16px] md:pl-7 md:pr-[21px] lg:pl-9 lg:pr-[31px]  py-4 w-full">
				<div className="flex flex-col gap-6">
					{messages.map((m, i) => (
						<div key={i} className="flex items-start gap-4 leading-relaxed">
							{m.role === "user" &&
								(editingIndex === i ? (
									<EditMessage
										value={editText}
										onChange={setEditText}
										onCancel={() => setEditingIndex(null)}
										onSend={() => handleEditSend(i)}
									/>
								) : (
									<UserChat
										msg={m.content}
										onEditClick={() => {
											setEditingIndex(i);
											setEditText(m.content);
										}}
										attachments={m.attachments || []}
									/>
								))}
							{m.role === "assistant" && <AssistantChat msg={m.content} />}
						</div>
					))}
					{streaming && !streamingText && (
						<div className="animate-pulse text-gray-300">
							Generating response ...
						</div>
					)}
					{streamingText && <AssistantChat msg={streamingText} />}
					<div ref={messagesEndRef} />
				</div>
			</div>
		</div>
	);
}
