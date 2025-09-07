"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Plus, Menu, Logo, HamBurgerMenu, Create } from "./SVG";
import Link from "next/link";
import { useConversationStore, Conversation } from "@/store/conversationStore";
import { usePathname } from "next/navigation";

export default function Sidebar() {
	const [open, setOpen] = useState(false); // default closed on mobile
	const { conversations, setConversations } = useConversationStore();
	const pathname = usePathname();

	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const response = await fetch("/api/conversations");
				if (!response.ok) throw new Error("Failed to fetch conversations");

				const data: { conversations: Conversation[] } = await response.json();
				setConversations(data.conversations);
			} catch (error) {
				console.error(error);
			}
		};

		fetchConversations();
	}, [setConversations]);

	// ✅ safer parsing
	const activeConversationId = pathname.startsWith("/chats/")
		? pathname.split("/chats/")[1]?.split("/")[0]
		: null;

	return (
		<div>
			{/* Mobile Top Bar */}
			<div className="sm:hidden flex items-center justify-between px-3 py-2 text-white border-b border-gray-700">
				{/* Hamburger */}
				<button
					onClick={() => setOpen(true)}
					className="p-2 rounded-md hover:bg-gray-700 focus:outline-none"
				>
					<HamBurgerMenu />
				</button>

				{/* New Chat */}
				<Link
					href="/"
					className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-600"
				>
					<Create />
				</Link>
			</div>

			{/* Mobile Drawer */}
			<div className="sm:hidden">
				{/* Backdrop */}
				{open && (
					<div
						className="fixed inset-0 bg-gray-700/20 bg-opacity-50 z-40"
						onClick={() => setOpen(false)}
					/>
				)}

				{/* Sliding Sidebar */}
				<div
					className={`fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300 ease-in-out ${
						open ? "translate-x-0" : "-translate-x-full"
					}`}
				>
					{/* Close Button */}
					<button
						onClick={() => setOpen(false)}
						className="absolute top-3 right-3 z-60 rounded-full bg-gray-700 p-1 shadow-sm hover:bg-gray-600"
					>
						<div className="rotate-45 w-4 h-4 flex items-center justify-center text-white">
							<Plus />
						</div>
					</button>

					<SideBarComponent
						conversations={conversations}
						activeConversationId={activeConversationId}
						open={true} // always expanded on mobile drawer
						setOpen={setOpen}
					/>
				</div>
			</div>

			{/* Desktop Sidebar */}
			<div className="hidden sm:block">
				<SideBarComponent
					conversations={conversations}
					activeConversationId={activeConversationId}
					open={open}
					setOpen={setOpen}
				/>
			</div>
		</div>
	);
}

type SideBarProps = {
	conversations: Conversation[];
	activeConversationId: string | null;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

const SideBarComponent = ({
	conversations,
	activeConversationId,
	open,
	setOpen,
}: SideBarProps) => {
	return (
		<div
			className={`${
				open ? "w-64" : "w-16"
			} bg-[#202123] text-white flex flex-col transition-all duration-300 text-md h-screen`}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-3 border-b border-gray-700">
				{open && <Logo />}
				{/* Collapse only for desktop */}
				<div className="hidden sm:block">
					<button
						onClick={() => setOpen((prev) => !prev)}
						className="p-1 rounded hover:bg-gray-700 group relative"
					>
						{open ? <Menu /> : <Logo />}
					</button>
				</div>
			</div>

			{/* New Chat */}
			<Link
				href="/"
				className="flex items-center gap-2 p-3 m-2 rounded-lg hover:bg-gray-600"
			>
				<Create />
				{open && <span>New Chat</span>}
			</Link>

			{/* Chats */}
			{open && (
				<>
					<span className="px-3 mx-2 text-gray-400 font-semibold">Chats</span>
					<div className="flex-1 overflow-y-auto">
						{conversations.map((conv) => {
							const isActive = conv.conversationId === activeConversationId;
							return (
								<Link
									href={`/chats/${conv.conversationId}`}
									key={conv.conversationId}
								>
									<div
										className={`px-3 py-2 mx-2 my-1 rounded-lg cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden ${
											isActive ? "bg-gray-600 text-white" : "hover:bg-gray-700"
										}`}
									>
										{conv.title}
									</div>
								</Link>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
};
