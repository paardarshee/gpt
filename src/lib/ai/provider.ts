import { google } from "@ai-sdk/google";

const aiProvider = {
	model: google("gemini-2.5-flash"),
};

export function getModel() {
	return aiProvider.model;
}
export const MAX_TOKENS = 10000;
