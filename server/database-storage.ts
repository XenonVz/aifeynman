import { 
  users, type User, type InsertUser,
  aiPersonas, type AiPersona, type InsertAiPersona,
  sessions, type Session, type InsertSession,
  messages, type Message, type InsertMessage,
  materials, type Material, type InsertMaterial,
  gaps, type Gap, type InsertGap,
  quizzes, type Quiz, type InsertQuiz
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // AI Persona operations
  async getAiPersona(id: number): Promise<AiPersona | undefined> {
    const [persona] = await db.select().from(aiPersonas).where(eq(aiPersonas.id, id));
    return persona || undefined;
  }

  async getAiPersonasByUserId(userId: number): Promise<AiPersona[]> {
    return db.select().from(aiPersonas).where(eq(aiPersonas.userId, userId));
  }

  async createAiPersona(personaData: InsertAiPersona): Promise<AiPersona> {
    const [persona] = await db
      .insert(aiPersonas)
      .values(personaData)
      .returning();
    return persona;
  }

  async updateAiPersona(id: number, updates: Partial<AiPersona>): Promise<AiPersona> {
    const [persona] = await db
      .update(aiPersonas)
      .set(updates)
      .where(eq(aiPersonas.id, id))
      .returning();
    
    if (!persona) {
      throw new Error(`AI Persona with id ${id} not found`);
    }
    
    return persona;
  }

  // Session operations
  async getSession(id: number): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session || undefined;
  }

  async getSessionsByUserId(userId: number): Promise<Session[]> {
    return db.select().from(sessions).where(eq(sessions.userId, userId));
  }

  async createSession(sessionData: InsertSession): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async updateSession(id: number, updates: Partial<Session>): Promise<Session> {
    const [session] = await db
      .update(sessions)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(sessions.id, id))
      .returning();
    
    if (!session) {
      throw new Error(`Session with id ${id} not found`);
    }
    
    return session;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }

  async getMessagesBySessionId(sessionId: number): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(messages.createdAt);
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(messageData)
      .returning();
    return message;
  }

  // Material operations
  async getMaterial(id: number): Promise<Material | undefined> {
    const [material] = await db.select().from(materials).where(eq(materials.id, id));
    return material || undefined;
  }

  async getMaterialsByUserId(userId: number): Promise<Material[]> {
    return db.select().from(materials).where(eq(materials.userId, userId));
  }

  async getMaterialsBySessionId(sessionId: number): Promise<Material[]> {
    return db.select().from(materials).where(eq(materials.sessionId, sessionId));
  }

  async createMaterial(materialData: InsertMaterial): Promise<Material> {
    const [material] = await db
      .insert(materials)
      .values(materialData)
      .returning();
    return material;
  }

  async updateMaterial(id: number, updates: Partial<Material>): Promise<Material> {
    const [material] = await db
      .update(materials)
      .set(updates)
      .where(eq(materials.id, id))
      .returning();
    
    if (!material) {
      throw new Error(`Material with id ${id} not found`);
    }
    
    return material;
  }

  // Gap operations
  async getGap(id: number): Promise<Gap | undefined> {
    const [gap] = await db.select().from(gaps).where(eq(gaps.id, id));
    return gap || undefined;
  }

  async getGapsBySessionId(sessionId: number): Promise<Gap[]> {
    return db.select().from(gaps).where(eq(gaps.sessionId, sessionId));
  }

  async createGap(gapData: InsertGap): Promise<Gap> {
    const [gap] = await db
      .insert(gaps)
      .values(gapData)
      .returning();
    return gap;
  }

  async updateGap(id: number, updates: Partial<Gap>): Promise<Gap> {
    const [gap] = await db
      .update(gaps)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(gaps.id, id))
      .returning();
    
    if (!gap) {
      throw new Error(`Gap with id ${id} not found`);
    }
    
    return gap;
  }

  // Quiz operations
  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || undefined;
  }

  async getQuizzesBySessionId(sessionId: number): Promise<Quiz[]> {
    return db.select().from(quizzes).where(eq(quizzes.sessionId, sessionId));
  }

  async createQuiz(quizData: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db
      .insert(quizzes)
      .values(quizData)
      .returning();
    return quiz;
  }
}