import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "@workspace/db";
import app from "./app";
import { logger } from "./lib/logger";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rawPort = process.env["PORT"];
if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Run migrations only in production (Railway has a fresh DB).
// In local dev the tables already exist so we skip to avoid conflicts.
if (process.env.NODE_ENV === "production") {
  try {
    const migrationsFolder = path.resolve(__dirname, "../../../lib/db/drizzle");
    await migrate(db, { migrationsFolder });
    logger.info("Database migrations applied");
  } catch (err) {
    logger.error({ err }, "Failed to apply database migrations");
    await pool.end();
    process.exit(1);
  }
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});
