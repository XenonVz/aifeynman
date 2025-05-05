import { 
  users, type User, type InsertUser,
  aiPersonas, type AiPersona, type InsertAiPersona,
  sessions, type Session, type InsertSession,
  messages, type Message, type InsertMessage,
  materials, type Material, type InsertMaterial,
  gaps, type Gap, type InsertGap,
  quizzes, type Quiz, type InsertQuiz
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // AI Persona operations
  getAiPersona(id: number): Promise<AiPersona | undefined>;
  getAiPersonasByUserId(userId: number): Promise<AiPersona[]>;
  createAiPersona(persona: InsertAiPersona): Promise<AiPersona>;
  updateAiPersona(id: number, updates: Partial<AiPersona>): Promise<AiPersona>;

  // Session operations
  getSession(id: number): Promise<Session | undefined>;
  getSessionsByUserId(userId: number): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: number, updates: Partial<Session>): Promise<Session>;

  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesBySessionId(sessionId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Material operations
  getMaterial(id: number): Promise<Material | undefined>;
  getMaterialsByUserId(userId: number): Promise<Material[]>;
  getMaterialsBySessionId(sessionId: number): Promise<Material[]>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  updateMaterial(id: number, updates: Partial<Material>): Promise<Material>;

  // Gap operations
  getGap(id: number): Promise<Gap | undefined>;
  getGapsBySessionId(sessionId: number): Promise<Gap[]>;
  createGap(gap: InsertGap): Promise<Gap>;
  updateGap(id: number, updates: Partial<Gap>): Promise<Gap>;

  // Quiz operations
  getQuiz(id: number): Promise<Quiz | undefined>;
  getQuizzesBySessionId(sessionId: number): Promise<Quiz[]>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private aiPersonas: Map<number, AiPersona>;
  private sessions: Map<number, Session>;
  private messages: Map<number, Message>;
  private materials: Map<number, Material>;
  private gaps: Map<number, Gap>;
  private quizzes: Map<number, Quiz>;

  private userIdCounter: number;
  private personaIdCounter: number;
  private sessionIdCounter: number;
  private messageIdCounter: number;
  private materialIdCounter: number;
  private gapIdCounter: number;
  private quizIdCounter: number;

  constructor() {
    this.users = new Map();
    this.aiPersonas = new Map();
    this.sessions = new Map();
    this.messages = new Map();
    this.materials = new Map();
    this.gaps = new Map();
    this.quizzes = new Map();

    this.userIdCounter = 1;
    this.personaIdCounter = 1;
    this.sessionIdCounter = 1;
    this.messageIdCounter = 1;
    this.materialIdCounter = 1;
    this.gapIdCounter = 1;
    this.quizIdCounter = 1;

    // Initialize with a demo user
    this.users.set(1, {
      id: 1,
      username: 'johndoe',
      password: 'password',
      displayName: 'John Doe',
      email: 'john@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=256&h=256&fit=crop',
      createdAt: new Date()
    });
    this.userIdCounter = 2;

    // Initialize with a demo AI persona
    this.aiPersonas.set(1, {
      id: 1,
      userId: 1,
      name: 'Alex',
      age: 16,
      interests: ['Science', 'Gaming'],
      communicationStyle: 'balanced',
      avatarUrl: 'https://images.unsplash.com/photo-1529111290557-82f6d5c6cf85?w=256&h=256&fit=crop',
      active: true,
      createdAt: new Date()
    });
    this.personaIdCounter = 2;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      id,
      ...userData,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // AI Persona operations
  async getAiPersona(id: number): Promise<AiPersona | undefined> {
    return this.aiPersonas.get(id);
  }

  async getAiPersonasByUserId(userId: number): Promise<AiPersona[]> {
    const result: AiPersona[] = [];
    for (const persona of this.aiPersonas.values()) {
      if (persona.userId === userId) {
        result.push(persona);
      }
    }
    return result;
  }

  async createAiPersona(personaData: InsertAiPersona): Promise<AiPersona> {
    const id = this.personaIdCounter++;
    const now = new Date();
    const persona: AiPersona = {
      id,
      ...personaData,
      createdAt: now
    };
    this.aiPersonas.set(id, persona);
    return persona;
  }

  async updateAiPersona(id: number, updates: Partial<AiPersona>): Promise<AiPersona> {
    const persona = await this.getAiPersona(id);
    if (!persona) {
      throw new Error(`AI Persona with id ${id} not found`);
    }

    const updatedPersona = { ...persona, ...updates };
    this.aiPersonas.set(id, updatedPersona);
    return updatedPersona;
  }

  // Session operations
  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getSessionsByUserId(userId: number): Promise<Session[]> {
    const result: Session[] = [];
    for (const session of this.sessions.values()) {
      if (session.userId === userId) {
        result.push(session);
      }
    }
    return result;
  }

  async createSession(sessionData: InsertSession): Promise<Session> {
    const id = this.sessionIdCounter++;
    const now = new Date();
    const session: Session = {
      id,
      ...sessionData,
      createdAt: now,
      updatedAt: now
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: number, updates: Partial<Session>): Promise<Session> {
    const session = await this.getSession(id);
    if (!session) {
      throw new Error(`Session with id ${id} not found`);
    }

    const now = new Date();
    const updatedSession = { ...session, ...updates, updatedAt: now };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesBySessionId(sessionId: number): Promise<Message[]> {
    const result: Message[] = [];
    for (const message of this.messages.values()) {
      if (message.sessionId === sessionId) {
        result.push(message);
      }
    }
    return result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const message: Message = {
      id,
      ...messageData,
      createdAt: now
    };
    this.messages.set(id, message);
    return message;
  }

  // Material operations
  async getMaterial(id: number): Promise<Material | undefined> {
    return this.materials.get(id);
  }

  async getMaterialsByUserId(userId: number): Promise<Material[]> {
    const result: Material[] = [];
    for (const material of this.materials.values()) {
      if (material.userId === userId) {
        result.push(material);
      }
    }
    return result;
  }

  async getMaterialsBySessionId(sessionId: number): Promise<Material[]> {
    const result: Material[] = [];
    for (const material of this.materials.values()) {
      if (material.sessionId === sessionId) {
        result.push(material);
      }
    }
    return result;
  }

  async createMaterial(materialData: InsertMaterial): Promise<Material> {
    const id = this.materialIdCounter++;
    const now = new Date();
    const material: Material = {
      id,
      ...materialData,
      createdAt: now
    };
    this.materials.set(id, material);
    return material;
  }

  async updateMaterial(id: number, updates: Partial<Material>): Promise<Material> {
    const material = await this.getMaterial(id);
    if (!material) {
      throw new Error(`Material with id ${id} not found`);
    }

    const updatedMaterial = { ...material, ...updates };
    this.materials.set(id, updatedMaterial);
    return updatedMaterial;
  }

  // Gap operations
  async getGap(id: number): Promise<Gap | undefined> {
    return this.gaps.get(id);
  }

  async getGapsBySessionId(sessionId: number): Promise<Gap[]> {
    const result: Gap[] = [];
    for (const gap of this.gaps.values()) {
      if (gap.sessionId === sessionId) {
        result.push(gap);
      }
    }
    return result;
  }

  async createGap(gapData: InsertGap): Promise<Gap> {
    const id = this.gapIdCounter++;
    const now = new Date();
    const gap: Gap = {
      id,
      ...gapData,
      createdAt: now,
      updatedAt: now
    };
    this.gaps.set(id, gap);
    return gap;
  }

  async updateGap(id: number, updates: Partial<Gap>): Promise<Gap> {
    const gap = await this.getGap(id);
    if (!gap) {
      throw new Error(`Gap with id ${id} not found`);
    }

    const now = new Date();
    const updatedGap = { ...gap, ...updates, updatedAt: now };
    this.gaps.set(id, updatedGap);
    return updatedGap;
  }

  // Quiz operations
  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async getQuizzesBySessionId(sessionId: number): Promise<Quiz[]> {
    const result: Quiz[] = [];
    for (const quiz of this.quizzes.values()) {
      if (quiz.sessionId === sessionId) {
        result.push(quiz);
      }
    }
    return result;
  }

  async createQuiz(quizData: InsertQuiz): Promise<Quiz> {
    const id = this.quizIdCounter++;
    const now = new Date();
    const quiz: Quiz = {
      id,
      ...quizData,
      createdAt: now
    };
    this.quizzes.set(id, quiz);
    return quiz;
  }
}

export const storage = new MemStorage();
