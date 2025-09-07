"use client";

import { useEffect, useState } from "react";
import { Plus, Menu, Logo } from "./SVG";
import Link from "next/link";

type Conversation = {
	userId: string;
	title: string;
	conversationId: string;
};

export default function Sidebar() {
	const [open, setOpen] = useState(true);
	const [conversations, setConversations] = useState<Conversation[]>([]);

	useEffect(() => {
		const fetchConversations = async () => {
			const response = await fetch("/api/conversations");
			const data: {
				conversations: Conversation[];
			} = await response.json();
			setConversations(data.conversations);
			console.log(data.conversations);
		};

		fetchConversations();
	}, []);

	return (
		<div
			className={`${
				open ? "w-64" : "w-16"
			} bg-[#202123] text-white flex flex-col transition-all duration-300 text-md`}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-3 border-b border-gray-700">
				{open && (
					<span className="text-lg font-semibold">
						<Logo />
					</span>
				)}
				<button
					onClick={() => setOpen(!open)}
					className="p-1 rounded hover:bg-gray-700 group relative"
				>
					{/* Logo (default) */}
					{!open && (
						<span className="block group-hover:hidden">
							<Logo />
						</span>
					)}

					{/* Menu (on hover) */}
					<span
						className={`${
							!open ? "hidden" : "flex"
						} group-hover:flex items-center justify-center`}
					>
						<Menu />
					</span>
				</button>
			</div>

			{/* New Chat */}
			<button className="flex items-center gap-2 p-3 m-2 bg-gray-700 rounded hover:bg-gray-600">
				<Plus />
				{open && <span>New Chat</span>}
			</button>

			{/* Chats list */}
			{open && (
				<span className="px-3 mx-2 text-gray-400 font-semibold">Chats</span>
			)}
			{open && (
				<div className="flex-1 overflow-y-auto">
					{conversations.map((conv, i) => (
						<Link href={`/chats/${conv.conversationId}`} key={i}>
							<div className="px-3 py-2 mx-2 my-1 rounded hover:bg-gray-700 cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden">
								{conv.title}
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
