import { pgTable, serial, integer, timestamp, text } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const rateLimitsTable = pgTable("rate_limits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  action: text("action").notNull().default("ai_analysis"),
  windowStart: timestamp("window_start").notNull().defaultNow(),
  requestCount: integer("request_count").notNull().default(1),
});

export type RateLimit = typeof rateLimitsTable.$inferSelect;
