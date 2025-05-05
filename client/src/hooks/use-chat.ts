import { useState, useEffect } from "react";
import { ChatMessage } from "@/types";
import { AiPersona } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function useChat(persona: AiPersona | null) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string, isInitial = false) => {
    if (!persona) return;

    // Add user message to chat if not initial message
    if (!isInitial && content) {
      const userMessage: ChatMessage = {
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
    }

    setIsLoading(true);

    try {
      // In a real implementation, we would call the API to get a response
      // const response = await apiRequest("POST", "/api/chat", {
      //   message: content,
      //   personaId: persona.id,
      //   isInitial
      // });
      // const data = await response.json();
      
      // Mock AI response for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const aiResponse = isInitial
        ? `Hey there! I'm ${persona.name}, a ${persona.age}-year-old who's into ${persona.interests.join(" and ")}. What do you want to teach me today?`
        : generateMockResponse(content, persona);
      
      const aiMessage: ChatMessage = {
        role: "ai",
        content: aiResponse,
        timestamp: new Date(),
        feynmanStep: determineFeynmanStep(messages.length)
      };
      
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading
  };
}

// Helper function to generate mock responses
function generateMockResponse(userMessage: string, persona: AiPersona): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("newton") && lowerMessage.includes("law")) {
    return "Oh cool, physics! So Newton's first law of motion is also called the law of inertia. Basically, it means that an object will stay at rest or keep moving at the same speed and direction unless a force acts on it.\n\nLike if you have a ball sitting on the ground, it'll just stay there until you kick it or something. And if you're cruising on a skateboard, you'll keep going until you hit a rock or push your foot down to stop.";
  } else if (lowerMessage.includes("forces") && lowerMessage.includes("balanced")) {
    return "Oh, you're right! I totally missed that part. So Newton's first law also talks about balanced forces.\n\nWhen an object is at rest, it means all the forces acting on it are balanced or cancel each other out. Like a book on a table - gravity pulls it down, but the table pushes up with an equal force.\n\nAnd when an object is moving with constant velocity (same speed and direction), the forces are also balanced. That's why if you're in a car moving at constant speed on a straight road, you don't feel like you're being pushed or pulled.";
  } else if (lowerMessage.includes("teach")) {
    return `I'd love to learn about that! Can you start by explaining the basic concept? I learn best when people start with the fundamentals and then build up to more complex ideas. I'm all ears!`;
  } else {
    return `Thanks for teaching me about that! Let me see if I understand: ${userMessage.substring(0, 30)}... That's really interesting. Could you explain more about how this works?`;
  }
}

// Helper function to determine the Feynman step based on message count
function determineFeynmanStep(messageCount: number): "explain" | "review" | "simplify" | "analogize" {
  if (messageCount < 2) return "explain";
  if (messageCount < 6) return "review";
  if (messageCount < 10) return "simplify";
  return "analogize";
}
