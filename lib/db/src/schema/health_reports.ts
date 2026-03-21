import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const healthReportsTable = pgTable("health_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  symptoms: text("symptoms").notNull(),
  lifestyle: text("lifestyle"),
  severity: text("severity").notNull(),
  analysis: text("analysis").notNull(),
  arogyaScore: integer("arogya_score").notNull().default(0),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertHealthReportSchema = createInsertSchema(healthReportsTable).omit({ id: true, createdAt: true });
export type InsertHealthReport = z.infer<typeof insertHealthReportSchema>;
export type HealthReport = typeof healthReportsTable.$inferSelect;
