import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Member roles enum
export const memberRoleEnum = pgEnum('member_role', ['president', 'secretary', 'treasurer', 'member']);

// Members schema
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nim: text("nim").notNull().unique(),
  email: text("email").notNull(),
  role: memberRoleEnum("role").notNull().default('member'),
  photoUrl: text("photo_url"),
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
});

export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;

// Announcement category enum
export const announcementCategoryEnum = pgEnum('announcement_category', ['academic', 'event', 'deadline', 'financial']);

// Announcements schema
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  category: announcementCategoryEnum("category").notNull(),
  author: text("author").notNull(),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
});

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

// Events schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  description: text("description"),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

// Transaction type enum
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);

// Transaction category enum
export const transactionCategoryEnum = pgEnum('transaction_category', ['dues', 'donation', 'event', 'supplies', 'study', 'other']);

// Transactions schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  type: transactionTypeEnum("type").notNull(),
  category: transactionCategoryEnum("category").notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Contact messages schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  date: true,
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
