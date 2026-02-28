import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const createChatSession = () => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  return ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: "You are Gemini Nexus, a highly capable and friendly AI assistant. You provide clear, concise, and helpful responses. You can help with coding, writing, analysis, and creative tasks.",
    },
  });
};

export async function* streamMessage(chat: any, message: string) {
  const result = await chat.sendMessageStream({ message });
  for await (const chunk of result) {
    const response = chunk as GenerateContentResponse;
    yield response.text || "";
  }
}
