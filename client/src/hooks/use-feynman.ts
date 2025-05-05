import { useState, useEffect } from "react";
import { FeynmanProgress, FeynmanStep, ChatMessage } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseFeynmanProps {
  activeSessionId?: number | null;
  userId?: number | null;
  messages?: ChatMessage[];
}

export function useFeynman({ activeSessionId, userId, messages = [] }: UseFeynmanProps = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Initialize the Feynman steps
  const initialSteps: FeynmanStep[] = [
    {
      id: "explain",
      label: "Explain",
      complete: false,
      description: "Explain the concept as if you're teaching it to someone else"
    },
    {
      id: "review",
      label: "Review",
      complete: false,
      description: "Review your explanation and identify gaps or confusions"
    },
    {
      id: "simplify",
      label: "Simplify",
      complete: false,
      description: "Simplify the explanation with plain language"
    },
    {
      id: "analogize",
      label: "Analogize",
      complete: false,
      description: "Create analogies to make the concept more relatable"
    }
  ];
  
  const [feynmanProgress, setFeynmanProgress] = useState<FeynmanProgress>({
    steps: initialSteps,
    currentStep: "explain",
    sessionId: activeSessionId || undefined
  });
  
  // Update current step based on message content
  useEffect(() => {
    if (messages.length > 0) {
      // Find the most recent message with a feynmanStep
      const messagesWithStep = messages
        .filter(msg => msg.feynmanStep)
        .sort((a, b) => {
          if (!a.timestamp || !b.timestamp) return 0;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        
      if (messagesWithStep.length > 0 && messagesWithStep[0].feynmanStep) {
        // Create a map of completed steps based on all messages
        const completedSteps: Record<string, boolean> = {};
        messagesWithStep.forEach(msg => {
          if (msg.feynmanStep) completedSteps[msg.feynmanStep] = true;
        });
        
        // Get the most recent step
        const currentStepId = messagesWithStep[0].feynmanStep;
        
        // Update the progress state
        const updatedSteps = feynmanProgress.steps.map(step => ({
          ...step,
          complete: completedSteps[step.id] || false
        }));
        
        setFeynmanProgress({
          steps: updatedSteps,
          currentStep: currentStepId,
          sessionId: activeSessionId
        });
      }
    }
  }, [messages, activeSessionId]);
  
  // Mutation to update the session progress in the database
  const updateSessionProgress = useMutation({
    mutationFn: async (data: { sessionId: number; currentStep: string; completedSteps: string[] }) => {
      if (!data.sessionId) throw new Error("No session ID provided");
      
      // In a real implementation, we would call the API
      // const response = await apiRequest('PATCH', `/api/sessions/${data.sessionId}`, {
      //   currentStep: data.currentStep,
      //   stepsCompleted: data.completedSteps
      // });
      // return await response.json();
      
      // For now, just return the data
      return {
        id: data.sessionId,
        currentStep: data.currentStep,
        stepsCompleted: data.completedSteps
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', data.id] });
    },
    onError: (error) => {
      console.error('Failed to update session progress:', error);
    }
  });
  
  const moveToNextStep = () => {
    const currentStepIndex = feynmanProgress.steps.findIndex(
      (step) => step.id === feynmanProgress.currentStep
    );
    
    if (currentStepIndex < feynmanProgress.steps.length - 1) {
      const nextStep = feynmanProgress.steps[currentStepIndex + 1].id;
      
      // Mark current step as complete
      const updatedSteps = [...feynmanProgress.steps];
      updatedSteps[currentStepIndex] = {
        ...updatedSteps[currentStepIndex],
        complete: true
      };
      
      const newProgress = {
        steps: updatedSteps,
        currentStep: nextStep,
        sessionId: feynmanProgress.sessionId
      };
      
      setFeynmanProgress(newProgress);
      
      // Update in the database if we have a session ID
      if (feynmanProgress.sessionId && userId) {
        const completedSteps = updatedSteps
          .filter(step => step.complete)
          .map(step => step.id);
          
        updateSessionProgress.mutate({
          sessionId: feynmanProgress.sessionId,
          currentStep: nextStep,
          completedSteps
        });
      }
      
      toast({
        title: "Feynman Process",
        description: `Moving to ${nextStep} step`,
      });
    } else {
      // All steps completed
      const updatedSteps = feynmanProgress.steps.map((step) => ({
        ...step,
        complete: true
      }));
      
      const newProgress = {
        steps: updatedSteps,
        currentStep: feynmanProgress.currentStep,
        sessionId: feynmanProgress.sessionId
      };
      
      setFeynmanProgress(newProgress);
      
      // Update in the database if we have a session ID
      if (feynmanProgress.sessionId && userId) {
        updateSessionProgress.mutate({
          sessionId: feynmanProgress.sessionId,
          currentStep: feynmanProgress.currentStep,
          completedSteps: updatedSteps.map(step => step.id)
        });
      }
      
      toast({
        title: "Feynman Process Completed",
        description: "You've completed all Feynman technique steps!",
      });
    }
  };
  
  const getFeedback = (feedback: "good" | "confused", message: string) => {
    if (feedback === "good") {
      toast({
        title: "Good Explanation",
        description: "Great! Let's move to the next step.",
      });
      
      // If current step is explain, move to review
      if (feynmanProgress.currentStep === "explain") {
        moveToNextStep();
      }
    } else {
      toast({
        title: "Still Confused",
        description: "Let's try to clarify this concept further.",
      });
    }
  };
  
  return {
    feynmanProgress,
    moveToNextStep,
    getFeedback,
    setFeynmanProgress
  };
}
