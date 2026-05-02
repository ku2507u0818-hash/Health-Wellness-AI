import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import analyzeRouter from "./analyze.js";
import reportsRouter from "./reports.js";
import tipsRouter from "./tips.js";
import profileRouter from "./profile.js";
import dashboardRouter from "./dashboard.js";

const router = Router();

router.use("/", healthRouter);
router.use("/auth", authRouter);
router.use("/health", analyzeRouter);
router.use("/reports", reportsRouter);
router.use("/tips", tipsRouter);
router.use("/profile", profileRouter);
router.use("/dashboard", dashboardRouter);

export default router;
