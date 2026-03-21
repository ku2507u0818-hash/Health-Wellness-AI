import { Router, type IRouter, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SignupBody, LoginBody } from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router: IRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || "arogya-secret-key-2024";

router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const parse = SignupBody.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Validation error", message: parse.error.message });
    return;
  }
  const { email, password, name } = parse.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "Conflict", message: "User already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(usersTable).values({ email, passwordHash, name }).returning();

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt } });
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const parse = LoginBody.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Validation error", message: parse.error.message });
    return;
  }
  const { email, password } = parse.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt } });
});

router.get("/me", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  if (!user) {
    res.status(404).json({ error: "Not found", message: "User not found" });
    return;
  }
  res.json({ id: user.id, email: user.email, name: user.name, createdAt: user.createdAt });
});

export default router;
