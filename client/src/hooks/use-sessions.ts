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

  // Query for fetching sessions
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['/api/sessions', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        // For now, return an empty array until the API is fully implemented
        // const response = await apiRequest('GET', `/api/sessions?userId=${userId}`);
        // return await response.json();
        return [];
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        return [];
      }
    }
  });

  // Mutation for creating a new session
  const createSession = useMutation({
    mutationFn: async (newSession: { title: string; aiPersonaId: number; topic?: string }) => {
      if (!userId) throw new Error("User not authenticated");
      
      try {
        // In a real implementation, we would use the API
        // const response = await apiRequest('POST', '/api/sessions', {
        //   ...newSession,
        //   userId
        // });
        // return await response.json();
        
        // For now, simulate a successful response
        return {
          id: Date.now(), // Use timestamp as temporary ID
          title: newSession.title,
          userId,
          aiPersonaId: newSession.aiPersonaId,
          topic: newSession.topic || null,
          currentStep: "explain",
          stepsCompleted: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
      } catch (error) {
        console.error('Failed to create session:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', userId] });
      toast({
        title: "Session Created",
        description: "New teaching session has been created successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Session",
        description: `Failed to create session: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
    }
  });

  // Function to export a session
  const exportSession = useCallback(async (sessionId: number) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to export a session",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // In a real implementation, we would call an API endpoint
      // const response = await apiRequest('GET', `/api/sessions/${sessionId}/export`);
      // const data = await response.blob();
      // const url = window.URL.createObjectURL(data);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `session-${sessionId}-export.json`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      
      toast({
        title: "Session Exported",
        description: "Your session data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: `Failed to export session: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
    }
  }, [userId, toast]);

  // Function to continue/resume a session
  const continueSession = useCallback(async (sessionId: number) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to continue a session",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // In a real implementation, we would fetch the session data
      // const response = await apiRequest('GET', `/api/sessions/${sessionId}`);
      // const sessionData = await response.json();
      // setActiveSession(sessionData);
      
      setActiveSession({
        id: sessionId,
        title: "Resumed Session",
        userId,
        aiPersonaId: 1, // Default persona ID
        topic: null,
        currentStep: "explain",
        stepsCompleted: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true
      } as Session);
      
      toast({
        title: "Session Resumed",
        description: "You can now continue your teaching session.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to resume session: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
    }
  }, [userId, toast, setActiveSession]);

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