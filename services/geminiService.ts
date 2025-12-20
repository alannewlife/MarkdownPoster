import { GoogleGenAI } from "@google/genai";
import { AiAction } from "../types";

// Initialize the client.
// Note: process.env.API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processMarkdownWithAi = async (
  currentText: string,
  action: AiAction
): Promise<string> => {
  if (!currentText.trim()) return "";

  let prompt = "";
  
  switch (action) {
    case AiAction.POLISH:
      prompt = "Please polish the following Markdown text, fixing grammar, improving clarity, and ensuring professional tone while preserving the Markdown formatting. Output ONLY the improved Markdown code.";
      break;
    case AiAction.SUMMARIZE:
      prompt = "Please summarize the following Markdown text into a concise bulleted list using Markdown. Output ONLY the summary.";
      break;
    case AiAction.EXPAND:
      prompt = "Please expand on the ideas in the following Markdown text, adding more detail and depth while maintaining the original style. Output ONLY the result in Markdown.";
      break;
    case AiAction.TRANSLATE_EN:
      prompt = "Please translate the following text to English, preserving all Markdown formatting structure strictly. Output ONLY the translated Markdown.";
      break;
    case AiAction.TRANSLATE_CN:
      prompt = "Please translate the following text to Simplified Chinese, preserving all Markdown formatting structure strictly. Output ONLY the translated Markdown.";
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: `${prompt}\n\n---\n\n${currentText}` }] }
      ],
      config: {
        // We want a direct response, relatively low temperature for deterministic formatting
        temperature: 0.3, 
      }
    });

    const result = response.text;
    return result || currentText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};