import { useState } from "react";
import { FeynmanProgress, FeynmanStep } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function useFeynman() {
  const { toast } = useToast();
  
  // Initialize the Feynman steps
  const initialSteps: FeynmanStep[] = [
    {
      id: "explain",
      label: "Explain",
      complete: true,
      description: "Explain the concept as if you're teaching it to someone else"
    },
    {
      id: "review",
      label: "Review",
      complete: true,
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
    currentStep: "review",
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
      
      setFeynmanProgress({
        steps: updatedSteps,
        currentStep: nextStep
      });
      
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
      
      setFeynmanProgress({
        steps: updatedSteps,
        currentStep: feynmanProgress.currentStep
      });
      
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
    getFeedback
  };
}
