// src/store/chatInputStore.ts
import { create } from "zustand";
import { AttachmentType } from "@/types";

export interface ChatInputState {
  input: string;
  attachments: AttachmentType[];

  setInput: (val: string) => void;
  clearInput: () => void;

  setAttachments: (attachments: AttachmentType[]) => void;
  addAttachment: (attachment: AttachmentType) => void;
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
