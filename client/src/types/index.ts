import { AiPersona, User, Message, Session, Material, Gap, Quiz } from "@shared/schema";

// OpenAI Response Types
export interface AIMessage {
  content: string;
  role: "assistant" | "user" | "system";
}

export interface AICompletionChoice {
  message: AIMessage;
  finish_reason: string;
  index: number;
}

export interface AICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: AICompletionChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Chat Types
export interface ChatMessage {
  id?: number;
  role: "user" | "ai";
  content: string;
  timestamp?: Date;
  feynmanStep?: "explain" | "review" | "simplify" | "analogize";
}

// Material Upload Types
export interface ParsedMaterial {
  name: string;
  type: "pdf" | "text" | "docx" | "ppt";
  content: string;
  extractedConcepts: string[];
}

// Feynman Technique Types
export interface FeynmanStep {
  id: "explain" | "review" | "simplify" | "analogize";
  label: string;
  complete: boolean;
  description: string;
}

export interface FeynmanProgress {
  steps: FeynmanStep[];
  currentStep: FeynmanStep["id"];
  sessionId?: number;
}

// Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
}

export interface QuizState {
  id?: number;
  title: string;
  questions: QuizQuestion[];
  currentQuestion: number;
  userAnswers: number[];
}

// Gap Report Types
export interface GapItem {
  id?: number;
  concept: string;
  description: string;
  status: "not_covered" | "partially_covered" | "covered";
}

// Avatar Selection Types
export interface AvatarOption {
  id: string;
  url: string;
  alt: string;
}

// AI Persona Creation Types
export interface InterestOption {
  id: string;
  label: string;
}

export interface PersonaFormData {
  name: string;
  age: number;
  interests: string[];
  communicationStyle: "formal" | "casual" | "balanced";
  avatarUrl: string;
}
