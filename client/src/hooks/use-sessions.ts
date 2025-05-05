import { useState, useCallback } from "react";
import { Session } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";

// Types for our frontend representation
export type SessionWithProgress = {
  id: number;
  title: string;
  date: string;
  progress: number;
  steps: string[];
  persona: {
    name: string;
    avatar: string;
  };
  topic: string | null;
};

export function useSessions(userId: number | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['/api/sessions', userId || 'anonymous'],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];
      
      // In a real implementation, we would fetch from the API
      const response = await apiRequest('GET', `/api/sessions?userId=${userId}`);
      return await response.json();
      
      // For now, return an empty array - we'll let users create their own sessions
      return [];
    }
  });

  const createSession = useMutation({
    mutationFn: async (newSession: { title: string; aiPersonaId: number; topic?: string }) => {
      if (!userId) throw new Error("User not authenticated");
      
      // Mock implementation
      // In a real implementation, we would use:
      // const response = await apiRequest('POST', '/api/sessions', {
      //   ...newSession,
      //   userId
      // });
      // return response.json();
      
      // Return mock data
      return {
        id: Math.floor(Math.random() * 1000),
        title: newSession.title,
        userId,
        aiPersonaId: newSession.aiPersonaId,
        topic: newSession.topic || null,
        currentStep: "explain",
        stepsCompleted: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', userId] });
      toast({
        title: "Session Created",
        description: "New teaching session has been created."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create session: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
    }
  });

  const exportSession = useCallback((sessionId: number) => {
    toast({
      title: "Session Exported",
      description: "Session has been exported successfully.",
    });
    
    // In a real implementation, we would trigger a download
    console.log(`Exporting session ${sessionId}`);
  }, [toast]);

  const continueSession = useCallback((sessionId: number) => {
    toast({
      title: "Session Continued",
      description: "Continuing from where you left off.",
    });
    
    // In a real implementation, we would redirect to the TeachingPage with this session
    console.log(`Continuing session ${sessionId}`);
  }, [toast]);

  const calculateProgress = useCallback((steps: string[]) => {
    const totalSteps = 4; // explain, review, simplify, analogize
    return Math.min(100, Math.round((steps.length / totalSteps) * 100));
  }, []);

  const formatSessionDate = useCallback((date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return formatDate(date);
    }
  }, []);

  return {
    sessions,
    isLoading,
    error,
    createSession,
    exportSession,
    continueSession,
    activeSession,
    setActiveSession,
    calculateProgress,
    formatSessionDate
  };
}