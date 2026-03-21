import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wellnessTipsTable = pgTable("wellness_tips", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  titleEn: text("title_en").notNull(),
  titleHi: text("title_hi").notNull(),
  titleGu: text("title_gu").notNull(),
  contentEn: text("content_en").notNull(),
  contentHi: text("content_hi").notNull(),
  contentGu: text("content_gu").notNull(),
  icon: text("icon").notNull().default("💡"),
});

export const insertWellnessTipSchema = createInsertSchema(wellnessTipsTable).omit({ id: true });
export type InsertWellnessTip = z.infer<typeof insertWellnessTipSchema>;
export type WellnessTip = typeof wellnessTipsTable.$inferSelect;
