import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // low latency
export const MIN_CONF = Number(process.env.INTENT_MIN_CONFIDENCE ?? 0.55);
