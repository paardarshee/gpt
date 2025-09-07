import { create } from "zustand";

export type Conversation = {
	userId: string;
	title: string;
	conversationId: string;
};

type ConversationStore = {
	conversations: Conversation[];
	setConversations: (convs: Conversation[]) => void;
	addConversation: (conv: Conversation) => void;
	removeConversation: (id: string) => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
	conversations: [],

	setConversations: (convs) => set({ conversations: convs }),

	addConversation: (conv) => {
		set((state) => ({
			conversations: [conv, ...state.conversations],
		}));
	},

	removeConversation: (id) =>
		set((state) => ({
			conversations: state.conversations.filter((c) => c.conversationId !== id),
			activeConversationIndex: null, // reset, or adjust if needed
		})),
}));
