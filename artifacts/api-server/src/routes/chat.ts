import { Router, type IRouter, Response } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { ai } from "@workspace/integrations-gemini-ai";

const router: IRouter = Router();

router.post("/", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { message, context } = req.body as { message: string; context?: Record<string, unknown> };

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const contextStr = context
    ? `\nUser Context:\n${Object.entries(context)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join("\n")}`
    : "";

  const prompt = `You are ArogyaAI, a friendly and knowledgeable AI health assistant. You provide helpful, accurate health information in a warm, empathetic tone. Always be concise (2-4 sentences max per response unless a list is needed). Never diagnose — always recommend consulting a doctor for serious concerns.
${contextStr}

User question: ${message.trim()}

Respond helpfully and concisely. End every response with a brief reminder if it's medical advice: "Always consult a healthcare professional for personalized advice."`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { maxOutputTokens: 1024, temperature: 0.7 },
  });

  const reply = response.text?.trim() ?? "I'm sorry, I couldn't process that. Please try again.";
  res.json({ reply });
});

export default router;
