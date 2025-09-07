"use client";

import Image from "next/image";
import { Plus } from "./SVG";
import { Attachment as AttachmentType } from "@/store/chatStore";

type AttachmentsProps = {
	attachments: AttachmentType[];
	setAttachments?: (attachments: AttachmentType[]) => void;
	isEditable?: boolean;
};

export default function Attachments({
	attachments,
	setAttachments,
	isEditable = false,
}: AttachmentsProps) {
	const handleRemove = (index: number) => {
		if (!setAttachments) return;
		const updated = attachments.filter((_, i) => i !== index);
		setAttachments(updated);
	};

	return (
		<div
			className={`flex flex-wrap gap-2 mt-2 ${
				!isEditable && "flex-col items-end"
			}`}
		>
			{attachments.map((attachment, index) => (
				<div
					key={index}
					className="relative inline-flex items-center gap-4 rounded-xl bg-[#393939] p-2 text-white shadow-lg w-fit"
				>
					{isEditable && (
						<button
							onClick={() => handleRemove(index)}
							className="absolute top-1 right-1 z-10 rounded-full bg-white p-1 shadow-sm hover:bg-gray-300"
						>
							<div className="rotate-45 w-3 h-3 flex items-center justify-center text-black">
								<Plus />
							</div>
						</button>
					)}

					{attachment.fileType === "image" ? (
						<div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
							<Image
								src={attachment.url}
								alt={attachment.filename}
								fill
								className="object-cover"
							/>
						</div>
					) : (
						<div className="flex items-center gap-3 mr-4">
							<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-500 text-white">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="h-5 w-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>

							<div className="flex min-w-0 flex-col">
								<span className="truncate text-sm font-medium text-white">
									{attachment.filename}
								</span>
								<span className="text-xs capitalize text-zinc-400">
									{attachment.fileType}
								</span>
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
