import { pgTable, text, serial, integer, json, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  avatarUrl: true,
});

// AI Persona table
export const aiPersonaEnum = pgEnum("ai_persona_style", ["formal", "casual", "balanced"]);

export const aiPersonas = pgTable("ai_personas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  interests: text("interests").array().notNull(),
  communicationStyle: aiPersonaEnum("communication_style").notNull(),
  avatarUrl: text("avatar_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAiPersonaSchema = createInsertSchema(aiPersonas).pick({
  userId: true,
  name: true,
  age: true,
  interests: true,
  communicationStyle: true,
  avatarUrl: true,
});

// Session table
export const feynmanStepEnum = pgEnum("feynman_step", ["explain", "review", "simplify", "analogize"]);

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  aiPersonaId: integer("ai_persona_id").notNull().references(() => aiPersonas.id),
  title: text("title").notNull(),
  topic: text("topic"),
  currentStep: feynmanStepEnum("current_step").default("explain"),
  stepsCompleted: json("steps_completed").$type<string[]>(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  userId: true,
  aiPersonaId: true,
  title: true,
  topic: true,
  currentStep: true,
  stepsCompleted: true,
});

// Message table
export const messageRoleEnum = pgEnum("message_role", ["user", "ai"]);

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id),
  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),
  feynmanStep: feynmanStepEnum("feynman_step"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  sessionId: true,
  role: true,
  content: true,
  feynmanStep: true,
});

// Material table
export const materialTypeEnum = pgEnum("material_type", ["pdf", "text", "docx", "ppt"]);

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionId: integer("session_id").references(() => sessions.id),
  name: text("name").notNull(),
  type: materialTypeEnum("type").notNull(),
  content: text("content").notNull(),
  extractedConcepts: json("extracted_concepts").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMaterialSchema = createInsertSchema(materials).pick({
  userId: true,
  sessionId: true,
  name: true,
  type: true,
  content: true,
  extractedConcepts: true,
});

// Gap Report table
export const gapStatusEnum = pgEnum("gap_status", ["not_covered", "partially_covered", "covered"]);

export const gaps = pgTable("gaps", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id),
  concept: text("concept").notNull(),
  description: text("description"),
  status: gapStatusEnum("status").default("not_covered"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertGapSchema = createInsertSchema(gaps).pick({
  sessionId: true,
  concept: true,
  description: true,
  status: true,
});

// Quiz table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id),
  title: text("title").notNull(),
  questions: json("questions").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  sessionId: true,
  title: true,
  questions: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type AiPersona = typeof aiPersonas.$inferSelect;
export type InsertAiPersona = z.infer<typeof insertAiPersonaSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;

export type Gap = typeof gaps.$inferSelect;
export type InsertGap = z.infer<typeof insertGapSchema>;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
