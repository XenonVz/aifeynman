import OpenAI from "openai";
import { AiPersona, Message, Material, Gap } from "@shared/schema";
import { QuizQuestion } from "@/types";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = "gpt-4o";

class OpenAIClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-development"
    });
  }

  /**
   * Generate an AI response based on the user's message and the AI persona
   */
  async getAIResponse(message: string, persona: AiPersona, feynmanStep?: string): Promise<string> {
    try {
      // Construct the system message based on the persona
      const systemPrompt = this.buildPersonaPrompt(persona, feynmanStep);

      const response = await this.client.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
      });

      return response.choices[0].message.content || "I'm not sure how to respond to that.";
    } catch (error: any) {
      console.error("OpenAI API error:", error.message);
      return "Sorry, I'm having trouble responding right now. Let's continue in a moment.";
    }
  }

  /**
   * Extract concepts from uploaded material content
   */
  async extractConcepts(materialContent: string): Promise<string[]> {
    try {
      const prompt = `
        Extract and list the key concepts from the following educational material.
        For each concept, provide just the name/title of the concept without explanation.
        Format your response as a JSON array of strings containing only the concept names.
        
        Material Content:
        ${materialContent.substring(0, 8000)} // Truncate to avoid token limit issues
      `;

      const response = await this.client.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const responseText = response.choices[0].message.content;
      if (!responseText) return [];

      try {
        const parsedResponse = JSON.parse(responseText);
        if (Array.isArray(parsedResponse.concepts)) {
          return parsedResponse.concepts;
        }
        // Try to find any array in the response
        for (const key in parsedResponse) {
          if (Array.isArray(parsedResponse[key])) {
            return parsedResponse[key];
          }
        }
        return [];
      } catch (parseError) {
        console.error("Failed to parse concepts:", parseError);
        return [];
      }
    } catch (error: any) {
      console.error("Concept extraction error:", error.message);
      return [];
    }
  }

  /**
   * Analyze gaps between what's been taught and the source materials
   */
  async analyzeGaps(
    messages: Message[],
    materials: Material[]
  ): Promise<{ concept: string; description: string; status: "not_covered" | "partially_covered" | "covered" }[]> {
    try {
      // Combine all material content
      const combinedMaterialContent = materials
        .map(material => material.content)
        .join("\n\n")
        .substring(0, 10000); // Truncate to avoid token limit issues

      // Combine message content into a conversation transcript
      const transcript = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join("\n\n")
        .substring(0, 10000); // Truncate to avoid token limit issues

      const prompt = `
        Analyze the learning materials and the teaching conversation to identify concepts that haven't been fully covered.
        
        MATERIALS CONTENT:
        ${combinedMaterialContent}
        
        TEACHING CONVERSATION:
        ${transcript}
        
        For each concept in the materials, determine if it has been:
        - "not_covered": Not mentioned at all in the teaching
        - "partially_covered": Briefly mentioned but not fully explained
        - "covered": Thoroughly explained
        
        Provide your analysis in JSON format with this structure:
        {
          "gaps": [
            {
              "concept": "Name of the concept",
              "description": "Brief description of the concept",
              "status": "not_covered|partially_covered|covered"
            }
          ]
        }
        
        Focus on the most important concepts (maximum 10).
      `;

      const response = await this.client.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const responseText = response.choices[0].message.content;
      if (!responseText) return [];

      try {
        const parsedResponse = JSON.parse(responseText);
        if (Array.isArray(parsedResponse.gaps)) {
          return parsedResponse.gaps;
        }
        return [];
      } catch (parseError) {
        console.error("Failed to parse gaps:", parseError);
        return [];
      }
    } catch (error: any) {
      console.error("Gap analysis error:", error.message);
      return [];
    }
  }

  /**
   * Generate quiz questions based on the teaching session
   */
  async generateQuiz(messages: Message[], topic?: string): Promise<QuizQuestion[]> {
    try {
      // Combine message content into a conversation transcript
      const transcript = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join("\n\n")
        .substring(0, 10000); // Truncate to avoid token limit issues

      let topicPrompt = "";
      if (topic) {
        topicPrompt = `Focus on the topic "${topic}".`;
      }

      const prompt = `
        Generate a quiz based on the following teaching conversation.
        ${topicPrompt}
        
        TEACHING CONVERSATION:
        ${transcript}
        
        Create 5 multiple-choice questions that test understanding of the key concepts taught.
        Each question should have 4 options with only one correct answer.
        
        Return your response as a JSON object with this structure:
        {
          "questions": [
            {
              "id": "q1",
              "question": "Question text",
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
              "correctOption": 0 // Index of the correct option (0-based)
            }
          ]
        }
      `;

      const response = await this.client.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const responseText = response.choices[0].message.content;
      if (!responseText) return [];

      try {
        const parsedResponse = JSON.parse(responseText);
        if (Array.isArray(parsedResponse.questions)) {
          return parsedResponse.questions;
        }
        return [];
      } catch (parseError) {
        console.error("Failed to parse quiz questions:", parseError);
        return [];
      }
    } catch (error: any) {
      console.error("Quiz generation error:", error.message);
      return [];
    }
  }

  /**
   * Build the system prompt for the AI persona
   */
  private buildPersonaPrompt(persona: AiPersona, feynmanStep?: string): string {
    // Determine language style based on communication style
    let languageStyle = "";
    switch (persona.communicationStyle) {
      case "formal":
        languageStyle = "Use proper grammar, avoid slang, and be respectful. Speak like an academically-inclined teenager.";
        break;
      case "casual":
        languageStyle = "Use casual language with occasional slang and informal expressions. Speak like a laid-back teenager.";
        break;
      default: // balanced
        languageStyle = "Use a mix of proper grammar with occasional casual expressions. Speak like a typical teenager.";
    }

    // Build interest-based context
    const interestsContext = persona.interests.length > 0
      ? `You're particularly interested in ${persona.interests.join(", ")}. Try to relate new concepts to these interests when possible.`
      : "You have varied interests and are curious about learning new things.";

    // Build Feynman-specific instructions
    let feynmanInstructions = "";
    if (feynmanStep) {
      switch (feynmanStep) {
        case "explain":
          feynmanInstructions = `
            You're in the EXPLAIN phase of the Feynman technique.
            Try to understand the concept the human is teaching you.
            Ask clarifying questions if needed.
            Show your understanding by restating the concept in your own words.
          `;
          break;
        case "review":
          feynmanInstructions = `
            You're in the REVIEW phase of the Feynman technique.
            Identify gaps or confusions in your understanding.
            Be honest about parts you don't fully grasp.
            Ask specific questions about unclear aspects.
          `;
          break;
        case "simplify":
          feynmanInstructions = `
            You're in the SIMPLIFY phase of the Feynman technique.
            Restate the concept using simple, plain language.
            Avoid jargon and technical terms unless absolutely necessary.
            Explain the concept as if you're teaching it to a younger student.
          `;
          break;
        case "analogize":
          feynmanInstructions = `
            You're in the ANALOGIZE phase of the Feynman technique.
            Create analogies, metaphors, or examples that relate to everyday experiences.
            Draw connections to things you're already familiar with.
            Use concrete examples that make the abstract concept more tangible.
          `;
          break;
      }
    }

    return `
      You are a ${persona.age}-year-old teenager named ${persona.name}.
      ${interestsContext}
      ${languageStyle}
      
      You're participating in a learning exercise where a human is teaching you a concept.
      Your goal is to understand and retain the information through the Feynman technique.
      
      ${feynmanInstructions}
      
      Remember to stay in character as a teenager. You're smart but still learning.
      Don't pretend to know things you haven't been taught.
      If something is confusing, say so and ask for clarification.
      
      Respond in a conversational, engaging manner while maintaining your teenage persona.
    `;
  }
}

export const openAIClient = new OpenAIClient();
