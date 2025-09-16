// import { google } from "@ai-sdk/google";

// const aiProvider = {
//   model: google("gemini-2.5-flash"),
// };

// export function getModel() {
//   return aiProvider.model;
// }
// export const MAX_TOKENS = 10000;

import { openai } from "@ai-sdk/openai";

const aiProvider = {
  model: openai("gpt-4o"),
};

export function getModel() {
  return aiProvider.model;
}
export const MAX_TOKENS = 48000;
