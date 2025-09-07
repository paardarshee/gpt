// src/store/chatInputStore.ts
import { create } from "zustand";
import { Attachment } from "./chatStore";

export interface ChatInputState {
	input: string;
	attachments: Attachment[];

	setInput: (val: string) => void;
	clearInput: () => void;

	setAttachments: (attachments: Attachment[]) => void;
	addAttachment: (attachment: Attachment) => void;
	removeAttachment: (id: number) => void;
	clearAttachments: () => void;
}

export const useChatInputStore = create<ChatInputState>((set) => ({
	input: "",
	attachments: [],

	setInput: (val) => set({ input: val }),
	clearInput: () => set({ input: "" }),

	setAttachments: (attachments) => set({ attachments }),
	addAttachment: (attachment) =>
		set((state) => ({ attachments: [...state.attachments, attachment] })),
	removeAttachment: (index) =>
		set((state) => ({
			attachments: state.attachments.filter((_, i) => i !== index),
		})),
	clearAttachments: () => set({ attachments: [] }),
}));
