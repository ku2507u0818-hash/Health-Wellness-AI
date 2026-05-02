import { GoogleGenAI, Modality } from "@google/genai";

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

export async function generateImage(
  prompt: string
): Promise<{ b64_json: string; mimeType: string }> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find(
    (part: { inlineData?: { data?: string; mimeType?: string } }) => part.inlineData
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image data in response");
  }

  return {
    b64_json: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || "image/png",
  };
}
