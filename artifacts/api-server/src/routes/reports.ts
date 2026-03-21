import { Router, type IRouter, Response } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { db, healthReportsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const reports = await db
    .select()
    .from(healthReportsTable)
    .where(eq(healthReportsTable.userId, req.userId!))
    .orderBy(desc(healthReportsTable.createdAt));
  res.json(reports);
});

router.post("/", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { symptoms, lifestyle, severity, analysis, arogyaScore, language } = req.body;
  if (!symptoms || !severity || !analysis || arogyaScore === undefined || !language) {
    res.status(400).json({ error: "Validation error", message: "Missing required fields" });
    return;
  }
  const [report] = await db.insert(healthReportsTable).values({
    userId: req.userId!,
    symptoms,
    lifestyle: lifestyle || null,
    severity,
    analysis,
    arogyaScore,
    language,
  }).returning();
  res.status(201).json(report);
});

router.get("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [report] = await db
    .select()
    .from(healthReportsTable)
    .where(and(eq(healthReportsTable.id, id), eq(healthReportsTable.userId, req.userId!)))
    .limit(1);
  if (!report) {
    res.status(404).json({ error: "Not found", message: "Report not found" });
    return;
  }
  res.json(report);
});

export default router;
