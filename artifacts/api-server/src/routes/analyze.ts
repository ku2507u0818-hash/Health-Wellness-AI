import { Router, type IRouter, Response } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { db, usersTable, healthReportsTable, rateLimitsTable } from "@workspace/db";
import { eq, and, gt, sql } from "drizzle-orm";
import { AnalyzeHealthBody } from "@workspace/api-zod";
import { anthropic } from "@workspace/integrations-anthropic-ai";

const router: IRouter = Router();

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

async function checkRateLimit(userId: number): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const limits = await db
    .select()
    .from(rateLimitsTable)
    .where(
      and(
        eq(rateLimitsTable.userId, userId),
        eq(rateLimitsTable.action, "ai_analysis"),
        gt(rateLimitsTable.windowStart, windowStart)
      )
    )
    .limit(1);

  if (limits.length > 0 && limits[0].requestCount >= RATE_LIMIT_MAX) {
    return false;
  }
  return true;
}

async function incrementRateLimit(userId: number): Promise<void> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const existing = await db
    .select()
    .from(rateLimitsTable)
    .where(
      and(
        eq(rateLimitsTable.userId, userId),
        eq(rateLimitsTable.action, "ai_analysis"),
        gt(rateLimitsTable.windowStart, windowStart)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(rateLimitsTable)
      .set({ requestCount: sql`${rateLimitsTable.requestCount} + 1` })
      .where(eq(rateLimitsTable.id, existing[0].id));
  } else {
    await db.insert(rateLimitsTable).values({
      userId,
      action: "ai_analysis",
      windowStart: new Date(),
      requestCount: 1,
    });
  }
}

function buildPrompt(symptoms: string, lifestyle: string | undefined, severity: string, age: number | undefined | null, language: string): string {
  const langMap: Record<string, string> = { en: "English", hi: "Hindi", gu: "Gujarati" };
  const lang = langMap[language] || "English";

  return `You are ArogyaAI, a compassionate AI health assistant. Analyze the following health information and provide structured wellness guidance.

Patient Information:
- Symptoms: ${symptoms}
- Lifestyle: ${lifestyle || "Not provided"}
- Severity: ${severity}
- Age: ${age || "Not provided"}

Please respond in ${lang} with the following EXACT sections (use these exact emoji headers):

🔍 Symptom Analysis
[Analyze the symptoms, potential causes, and what they might indicate]

💡 Wellness Suggestions
[Practical wellness tips and self-care recommendations]

🥗 Diet & Lifestyle
[Specific dietary changes and lifestyle modifications]

😴 Sleep & Stress
[Sleep hygiene and stress management recommendations]

⚠️ Warning Signs
[Signs that would require immediate medical attention]

🏥 Medical Disclaimer
[Important disclaimer about seeking professional medical advice]

Also provide an ArogyaScore (0-100) based on the severity and symptoms. Format: "ArogyaScore: [number]" at the very end.`;
}

function parseAnalysis(analysis: string): { sections: Record<string, string>; arogyaScore: number } {
  const sectionMap: Record<string, string> = {
    "🔍": "symptomAnalysis",
    "💡": "wellnessSuggestions",
    "🥗": "dietLifestyle",
    "😴": "sleepStress",
    "⚠️": "warningSigns",
    "🏥": "medicalDisclaimer",
  };

  const sections: Record<string, string> = {
    symptomAnalysis: "",
    wellnessSuggestions: "",
    dietLifestyle: "",
    sleepStress: "",
    warningSigns: "",
    medicalDisclaimer: "",
  };

  const emojis = Object.keys(sectionMap);
  let arogyaScore = 70;

  const scoreMatch = analysis.match(/ArogyaScore:\s*(\d+)/i);
  if (scoreMatch) {
    arogyaScore = Math.min(100, Math.max(0, parseInt(scoreMatch[1])));
  }

  for (let i = 0; i < emojis.length; i++) {
    const emoji = emojis[i];
    const nextEmoji = emojis[i + 1];
    const key = sectionMap[emoji];

    const start = analysis.indexOf(emoji);
    if (start === -1) continue;

    const end = nextEmoji ? analysis.indexOf(nextEmoji) : analysis.indexOf("ArogyaScore:");
    const sectionText = end > start
      ? analysis.substring(start, end).trim()
      : analysis.substring(start).replace(/ArogyaScore:.*$/i, "").trim();

    sections[key] = sectionText.replace(new RegExp(`^${emoji}[^\\n]*\\n?`), "").trim();
  }

  return { sections, arogyaScore };
}

router.post("/", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId!;

  const allowed = await checkRateLimit(userId);
  if (!allowed) {
    res.status(429).json({
      error: "Rate limit exceeded",
      message: "Maximum 5 AI health analyses per hour. Please try again later.",
    });
    return;
  }

  const parse = AnalyzeHealthBody.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Validation error", message: parse.error.message });
    return;
  }

  const { symptoms, lifestyle, severity, age, language = "en" } = parse.data;

  const prompt = buildPrompt(symptoms, lifestyle, severity, age, language);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  const analysis = block.type === "text" ? block.text : "";
  const { sections, arogyaScore } = parseAnalysis(analysis);

  await incrementRateLimit(userId);

  const [report] = await db.insert(healthReportsTable).values({
    userId,
    symptoms,
    lifestyle: lifestyle || null,
    severity,
    analysis,
    arogyaScore,
    language,
  }).returning();

  const today = new Date().toISOString().split("T")[0];
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

  if (user) {
    const lastCheck = user.lastCheckDate;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const newStreak = lastCheck === yesterday ? user.healthStreak + 1 : lastCheck === today ? user.healthStreak : 1;
    const newScore = Math.round((user.arogyaScore * 0.7 + arogyaScore * 0.3));

    await db.update(usersTable).set({
      lastCheckDate: today,
      healthStreak: newStreak,
      arogyaScore: newScore,
    }).where(eq(usersTable.id, userId));
  }

  res.json({ analysis, sections, arogyaScore, reportId: report.id });
});

export default router;
