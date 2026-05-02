import { Router, type IRouter, Response } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { db, usersTable, healthReportsTable, wellnessTipsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.userId!))
    .limit(1);

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
