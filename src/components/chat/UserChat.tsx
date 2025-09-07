"use client";
import { Attachment } from "@/store/chatStore";
import { Copy, Edit, Tick } from "../SVG";
import { useState } from "react";
import Attachments from "@/components/Attachments";
type UserChatProps = {
	msg: string;
	onEditClick: () => void;
	attachments: Attachment[];
};

export default function UserChat({
	msg,
	onEditClick,
	attachments,
}: UserChatProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(msg);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text:", err);
		}
	};
	return (
		<div className="flex w-full flex-col group">
			{/* Chat bubble */}
			<div className="flex justify-end w-full">
				<Attachments attachments={attachments || []} />
			</div>
			<div className="flex justify-end w-full">
				<div className="relative max-w-[70%] rounded-2xl px-4 py-2.5 bg-[rgba(50,50,50,0.85)] text-gray-100 whitespace-pre-wrap break-words">
					{msg}
				</div>
			</div>

			{/* Copy / Edit buttons */}
			<div className="flex justify-end gap-1 pr-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-sm text-gray-300">
				<button
					className="p-1.5 rounded-lg hover:bg-[rgba(50,50,50,0.6)] cursor-pointer"
					title="Copy"
					onClick={handleCopy}
				>
					{copied ? <Tick /> : <Copy />}
				</button>
				{!(attachments.length > 0) && (
					<button
						className="p-1.5 rounded-lg hover:bg-[rgba(50,50,50,0.6)] cursor-pointer"
						title="Edit"
						onClick={onEditClick}
					>
						<Edit />
					</button>
				)}
			</div>
		</div>
	);
}
