import { Router, type IRouter, Response } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { db, usersTable, healthReportsTable, wellnessTipsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  if (!user) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    age: user.age,
    gender: user.gender,
    language: user.language,
    healthStreak: user.healthStreak,
    arogyaScore: user.arogyaScore,
    createdAt: user.createdAt,
  });
});

router.put("/", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, age, gender, language } = req.body;
  const updates: Partial<{ name: string; age: number | null; gender: string | null; language: string }> = {};
  if (name !== undefined) updates.name = name;
  if (age !== undefined) updates.age = age;
  if (gender !== undefined) updates.gender = gender;
  if (language !== undefined) updates.language = language;

  const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, req.userId!)).returning();
  if (!user) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    age: user.age,
    gender: user.gender,
    language: user.language,
    healthStreak: user.healthStreak,
    arogyaScore: user.arogyaScore,
    createdAt: user.createdAt,
  });
});

router.get("/dashboard", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  if (!user) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const reports = await db
    .select()
    .from(healthReportsTable)
    .where(eq(healthReportsTable.userId, req.userId!))
    .orderBy(desc(healthReportsTable.createdAt));

  const tips = await db.select().from(wellnessTipsTable).limit(3);

  res.json({
    arogyaScore: user.arogyaScore,
    healthStreak: user.healthStreak,
    totalReports: reports.length,
    recentReports: reports.slice(0, 5),
    recentTips: tips,
  });
});

export default router;
