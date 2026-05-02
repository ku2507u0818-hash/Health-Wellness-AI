import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const REPLIT_API_KEY = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
const REPLIT_BASE_URL = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

if (!GEMINI_API_KEY && (!REPLIT_API_KEY || !REPLIT_BASE_URL)) {
  throw new Error(
    "Gemini AI not configured. " +
    "For production: set GEMINI_API_KEY. " +
    "For Replit: set AI_INTEGRATIONS_GEMINI_API_KEY + AI_INTEGRATIONS_GEMINI_BASE_URL."
  );
}

export const ai = GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: GEMINI_API_KEY })
  : new GoogleGenAI({
      apiKey: REPLIT_API_KEY!,
      httpOptions: {
        apiVersion: "",
        baseUrl: REPLIT_BASE_URL!,
      },
    });
