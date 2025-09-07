"use client";
import DynamicTextArea from "./DynamicTextArea";

export default function EditMessage({
	value,
	onChange,
	onCancel,
	onSend,
}: {
	value: string;
	onChange: (val: string) => void;
	onCancel: () => void;
	onSend: () => void;
}) {
	return (
		<div className="w-full flex flex-col gap-2 mt-1 rounded-2xl bg-[#3a3a3a] p-3">
			<DynamicTextArea
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
			<div className="flex gap-2 justify-end">
				<button
					className="bg-gray-600 hover:bg-gray-500 text-white rounded-full px-4 py-1 text-sm"
					onClick={onCancel}
				>
					Cancel
				</button>
				<button
					className="bg-white hover:bg-gray-200 text-black rounded-full px-4 py-1 text-sm"
					onClick={onSend}
				>
					Send
				</button>
			</div>
		</div>
	);
}
