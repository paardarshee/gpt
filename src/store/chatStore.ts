import { create } from "zustand";
import { AttachmentType } from "@/types";

export interface NewChatPayload {
  input: string;
  attachments: AttachmentType[];
}
export interface Message {
  msgId?: string;
  role: "user" | "assistant";
  content: string;
  attachments?: AttachmentType[];
}

export interface ChatState {
  // Pending new chat input
  newChatInput: NewChatPayload | null;
  isRedirected: boolean;
  attachments: AttachmentType[];
  // Conversations keyed by chatId
  conversations: Record<string, Message[]>;

  // Actions
  setNewChatInput: (msg: NewChatPayload) => void;

  getNewChatInput: () => NewChatPayload | null;
  setRedirected: (value: boolean) => void;
  addMessage: (chatId: string, msg: Message) => void;
  getMessages: (chatId: string) => Message[];
  deleteMessagesAfterIndex: (chatId: string, index: number) => void;
  addNewConversation: (chatId: string, messages: Message[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  newChatInput: null,
  isRedirected: false,
  conversations: {},
  attachments: [],

  setNewChatInput: (payload) =>
    set({
      newChatInput: payload,
    }),
  getNewChatInput: (): NewChatPayload | null => {
    const input = useChatStore.getState().newChatInput;
    set({
      newChatInput: null,
    });
    return input;
  },
  setRedirected: (value) => set({ isRedirected: value }),

  addMessage: (chatId, msg) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [chatId]: [...(state.conversations[chatId] || []), msg],
      },
    })),
  getMessages: (chatId: string): Message[] => {
    const state: ChatState = useChatStore.getState();
    return state.conversations[chatId] || [];
  },
  deleteMessagesAfterIndex: (chatId, index) =>
    set((state) => {
      const msgs = state.conversations[chatId] || [];
      if (index < 0 || index >= msgs.length) return state;

      return {
        conversations: {
          ...state.conversations,
          [chatId]: msgs.slice(0, index + 1),
        },
      };
    }),
  addNewConversation: (chatId, messages) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [chatId]: messages,
      },
    })),
}));
