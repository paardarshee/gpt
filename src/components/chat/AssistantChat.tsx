"use client";
import { Copy, Tick } from "../SVG";
import { useState } from "react";
import Markdown from "react-markdown";
type AssistantChatProps = {
	msg: string;
	markdown?: boolean;
};

export default function AssistantChat({
	msg,
	markdown = true,
}: AssistantChatProps) {
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
			<div className="flex ">
				<div className="relative rounded-2xl py-2.5 text-gray-100 whitespace-pre-wrap break-words">
					{markdown ? <Markdown>{msg}</Markdown> : <>{msg}</>}
				</div>
			</div>

			{/* Copy / Edit buttons */}
			<div className="flex gap-1 pr-1 mt-1  transition-opacity text-sm text-gray-300">
				<button
					className="p-1.5 rounded-lg hover:bg-[rgba(50,50,50,0.6)] cursor-pointer"
					title="Copy"
					onClick={handleCopy}
				>
					{copied ? <Tick /> : <Copy />}
				</button>
			</div>
		</div>
	);
}
