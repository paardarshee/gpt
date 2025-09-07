"use client";
import DynamicTextArea from "./DynamicTextArea";
import { useState, ChangeEvent, KeyboardEventHandler, useRef } from "react";
import { Plus, UpArrow } from "../SVG";
import { Attachment } from "@/store/chatStore";

type NewChatProps = {
	value: string;
	onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	handleSubmit: () => Promise<void>;
	attachments: Attachment[];
	setAttachments: (attachments: Attachment[]) => void;
};

export default function NewChat({
	value,
	onChange,
	handleSubmit,
	attachments,
	setAttachments,
}: NewChatProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isMultiline, setIsMultiline] = useState(false);

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e);
		if (!e.target.value.trim()) setIsMultiline(false);
	};

	const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;
		if (!files) return;

		const validFiles: File[] = [];
		const maxSize = 5 * 1024 * 1024; // 5MB
		const allowedTypes = [
			"image/png",
			"image/jpeg",
			"image/jpg",
			"application/pdf",
			"application/msword", // .doc
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
			"text/plain",
		];

		for (const file of files) {
			if (!allowedTypes.includes(file.type)) {
				alert(`File type not allowed: ${file.name}`);
				continue;
			}
			if (file.size > maxSize) {
				alert(`File too large (max 5MB): ${file.name}`);
				continue;
			}
			validFiles.push(file);
		}

		if (validFiles.length > 0) {
			const formData = new FormData();
			for (const file of validFiles) {
				formData.append("file", file);
			}
			// Example: send files to /api/upload endpoint
			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});
			const data: {
				attachments: Attachment[];
			} = await res.json();
			setAttachments([...attachments, ...data.attachments]);
		}

		// Reset the input so the same file can be selected again if needed
		event.target.value = "";
	};

	return (
		<div className="w-full max-w-3xl mx-auto">
			<div
				className={`relative flex w-full bg-[#343537] rounded-[18px] p-2.5 transition-all duration-300 flex-col `}
			>
				{isMultiline && (
					<div className={`w-full`}>
						<DynamicTextArea
							value={value}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							isMultiline={isMultiline}
						/>
					</div>
				)}
				<div className={`flex flex-row ${isMultiline && "justify-between"}`}>
					<div className={`flex items-center gap-2 ml-2`}>
						<input
							type="file"
							ref={fileInputRef}
							className="hidden"
							onChange={handleFileChange}
							multiple
							accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.txt"
						/>
						<button
							className="p-2 mr-2 text-white rounded-full hover:bg-gray-500 focus:outline-none cursor-pointer"
							onClick={handleButtonClick}
						>
							<Plus />
						</button>
					</div>

					{/* Textarea */}
					{!isMultiline && (
						<div className={`grow`}>
							<DynamicTextArea
								value={value}
								onChange={handleChange}
								onLineCountChange={(lineCount) =>
									setIsMultiline((preState) => {
										if (preState) return true;
										return lineCount > 1;
									})
								}
								onKeyDown={handleKeyDown}
								placeholder="Ask Anything"
								isMultiline={isMultiline}
							/>
						</div>
					)}
					<div className={`flex items-center gap-2 ml-2`}>
						{/* Right Submit Button */}
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!value.trim()}
							className="flex items-center justify-center w-10 h-10 rounded-full disabled:bg-[#8a8585] bg-white transition-colors text-gray-800 cursor-pointer disabled:cursor-default"
						>
							<UpArrow />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
