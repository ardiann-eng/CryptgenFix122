import { pgTable, text, serial, integer, boolean, date, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Member schema for class members
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  studentId: text("student_id").notNull().unique(),
  role: text("role").default("member"),
  photoUrl: text("photo_url").notNull(),
});

export const insertMemberSchema = createInsertSchema(members).pick({
  name: true,
  studentId: true,
  role: true,
  photoUrl: true,
});

// Announcement schema for class announcements
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  postedBy: text("posted_by").notNull(),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).pick({
  date: true,
  title: true,
  description: true,
  category: true,
  postedBy: true,
});

// Transaction schema for financial transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // "income" or "expense"
  notes: text("notes"),
  status: text("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  date: true,
  description: true,
  category: true,
  amount: true,
  type: true,
  notes: true,
  status: true,
});

// Define the types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
