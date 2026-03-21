import { Router, type IRouter, Request, Response } from "express";
import { db, wellnessTipsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const { category } = req.query;
  let tips;
  if (category && typeof category === "string") {
    tips = await db.select().from(wellnessTipsTable).where(eq(wellnessTipsTable.category, category));
  } else {
    tips = await db.select().from(wellnessTipsTable);
  }
  res.json(tips);
});

export default router;
