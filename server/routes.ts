import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertAiPersonaSchema, 
  insertSessionSchema, 
  insertMessageSchema,
  insertMaterialSchema,
  insertGapSchema,
  insertQuizSchema
} from "@shared/schema";
import { openAIClient } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Persona Routes
  app.post("/api/personas", async (req, res) => {
    try {
      const personaData = insertAiPersonaSchema.parse(req.body);
      const persona = await storage.createAiPersona(personaData);
      res.status(201).json(persona);
    } catch (error) {
      res.status(400).json({ message: "Invalid persona data" });
    }
  });

  app.get("/api/personas", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const personas = await storage.getAiPersonasByUserId(userId);
    res.json(personas);
  });

  app.get("/api/personas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid persona ID" });
    }
    
    const persona = await storage.getAiPersona(id);
    if (!persona) {
      return res.status(404).json({ message: "Persona not found" });
    }
    
    res.json(persona);
  });

  app.patch("/api/personas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid persona ID" });
      }
      
      const persona = await storage.getAiPersona(id);
      if (!persona) {
        return res.status(404).json({ message: "Persona not found" });
      }
      
      // Validate update data
      const updateSchema = z.object({
        name: z.string().min(1).optional(),
        age: z.number().int().min(10).max(120).optional(),
        interests: z.array(z.string()).min(1).optional(),
        communicationStyle: z.enum(["formal", "casual", "balanced"]).optional(),
        avatarUrl: z.string().optional().nullable()
      });
      
      const updateData = updateSchema.parse(req.body);
      const updatedPersona = await storage.updateAiPersona(id, updateData);
      res.json(updatedPersona);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Session Routes
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  app.get("/api/sessions", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const sessions = await storage.getSessionsByUserId(userId);
    res.json(sessions);
  });

  app.get("/api/sessions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    
    const session = await storage.getSession(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    
    res.json(session);
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }
      
      const session = await storage.getSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Validate update data
      const updateSchema = z.object({
        title: z.string().optional(),
        topic: z.string().nullable().optional(),
        currentStep: z.enum(["explain", "review", "simplify", "analogize"]).nullable().optional(),
        stepsCompleted: z.array(z.string()).nullable().optional(),
        completed: z.boolean().optional()
      });
      
      const updateData = updateSchema.parse(req.body);
      const updatedSession = await storage.updateSession(id, updateData);
      res.json(updatedSession);
    } catch (error) {
      console.error("Session update error:", error);
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Message Routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.get("/api/messages", async (req, res) => {
    const sessionId = parseInt(req.query.sessionId as string);
    if (isNaN(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    
    const messages = await storage.getMessagesBySessionId(sessionId);
    res.json(messages);
  });

  // Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, personaId, sessionId, feynmanStep } = req.body;
      
      if (!message || !personaId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const persona = await storage.getAiPersona(personaId);
      if (!persona) {
        return res.status(404).json({ message: "Persona not found" });
      }
      
      // Get AI response
      const response = await openAIClient.getAIResponse(message, persona, feynmanStep);
      
      // If a session is provided, save the messages
      if (sessionId) {
        // Save user message
        await storage.createMessage({
          sessionId,
          role: "user",
          content: message,
          feynmanStep
        });
        
        // Save AI response
        await storage.createMessage({
          sessionId,
          role: "ai",
          content: response,
          feynmanStep
        });
      }
      
      res.json({ message: response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  // Material Routes
  app.post("/api/materials", async (req, res) => {
    try {
      const materialData = insertMaterialSchema.parse(req.body);
      const material = await storage.createMaterial(materialData);
      
      // Extract concepts
      const concepts = await openAIClient.extractConcepts(material.content);
      
      // Update material with extracted concepts
      const updatedMaterial = await storage.updateMaterial(material.id, {
        extractedConcepts: concepts
      });
      
      res.status(201).json(updatedMaterial);
    } catch (error) {
      res.status(400).json({ message: "Invalid material data" });
    }
  });

  app.get("/api/materials", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const materials = await storage.getMaterialsByUserId(userId);
    res.json(materials);
  });

  // Gap Analysis
  app.post("/api/gaps", async (req, res) => {
    try {
      const { sessionId, materialIds } = req.body;
      
      if (!sessionId || !materialIds || !Array.isArray(materialIds)) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      
      // Get session messages and materials
      const messages = await storage.getMessagesBySessionId(sessionId);
      const materials = await Promise.all(
        materialIds.map((id: number) => storage.getMaterial(id))
      );
      
      // Perform gap analysis
      const gaps = await openAIClient.analyzeGaps(
        messages,
        materials.filter(Boolean)
      );
      
      // Save gaps to database
      const savedGaps = await Promise.all(
        gaps.map((gap) =>
          storage.createGap({
            sessionId,
            concept: gap.concept,
            description: gap.description,
            status: gap.status
          })
        )
      );
      
      res.json(savedGaps);
    } catch (error) {
      console.error("Gap analysis error:", error);
      res.status(500).json({ message: "Failed to perform gap analysis" });
    }
  });

  app.get("/api/gaps", async (req, res) => {
    const sessionId = parseInt(req.query.sessionId as string);
    if (isNaN(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    
    const gaps = await storage.getGapsBySessionId(sessionId);
    res.json(gaps);
  });

  // Quiz Generation
  app.post("/api/quizzes", async (req, res) => {
    try {
      const { sessionId, topic } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      // Get session messages
      const messages = await storage.getMessagesBySessionId(sessionId);
      
      // Generate quiz questions
      const quizQuestions = await openAIClient.generateQuiz(messages, topic);
      
      // Save quiz to database
      const quiz = await storage.createQuiz({
        sessionId,
        title: topic || "Quiz on Current Topic",
        questions: quizQuestions
      });
      
      res.status(201).json(quiz);
    } catch (error) {
      console.error("Quiz generation error:", error);
      res.status(500).json({ message: "Failed to generate quiz" });
    }
  });

  app.get("/api/quizzes", async (req, res) => {
    const sessionId = parseInt(req.query.sessionId as string);
    if (isNaN(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    
    const quizzes = await storage.getQuizzesBySessionId(sessionId);
    res.json(quizzes);
  });

  const httpServer = createServer(app);

  return httpServer;
}
