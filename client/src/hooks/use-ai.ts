import { useState } from "react";
import { QuizQuestion, ChatMessage } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseAIProps {
  activeSessionId?: number | null;
  userId?: number | null;
  messages?: ChatMessage[];
}

export function useAi({ activeSessionId, userId, messages = [] }: UseAIProps = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showExpandedQuiz, setShowExpandedQuiz] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // Mutation to save a generated quiz to the database
  const saveQuiz = useMutation({
    mutationFn: async (quizData: { sessionId: number; title: string; questions: QuizQuestion[] }) => {
      if (!quizData.sessionId) throw new Error("No session ID provided");
      
      // In a real implementation, we would call the API
      // const response = await apiRequest('POST', '/api/quizzes', quizData);
      // return await response.json();
      
      // For now, just return a mock success response
      return {
        id: Date.now(),
        sessionId: quizData.sessionId,
        title: quizData.title,
        questions: quizData.questions,
        createdAt: new Date()
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes', activeSessionId] });
      console.log("Quiz saved successfully:", data);
    },
    onError: (error) => {
      console.error('Failed to save quiz:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save the quiz to your session",
        variant: "destructive"
      });
    }
  });

  const generateQuiz = async () => {
    if (!activeSessionId && !userId) {
      toast({
        title: "Session Required",
        description: "You need to be in an active session to generate a quiz.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingQuiz(true);
    
    try {
      // Extract message content for the AI to generate quiz from
      const messageContents = messages
        .filter(msg => msg.role === "user")
        .map(msg => msg.content)
        .join("\n\n");
      
      if (messageContents.trim().length < 10) {
        toast({
          title: "Not Enough Content",
          description: "Please teach more content before generating a quiz.",
          variant: "destructive",
        });
        setIsGeneratingQuiz(false);
        return;
      }
      
      // In a real implementation, we would call the API to generate a quiz based on the teaching content
      // const response = await apiRequest("POST", "/api/quizzes/generate", { 
      //   sessionId: activeSessionId,
      //   content: messageContents
      // });
      // const quizData = await response.json();
      // setQuestions(quizData.questions);
      
      // For now, generate a dynamic quiz based on the teaching content
      // Here we're simulating what the OpenAI API would generate
      const generatedQuestions = generateQuestionsFromContent(messageContents);
      
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(generatedQuestions[0]);
      setShowQuiz(true);
      
      // Save the quiz to the database if we have a session ID
      if (activeSessionId) {
        saveQuiz.mutate({
          sessionId: activeSessionId,
          title: `Quiz ${new Date().toLocaleDateString()}`,
          questions: generatedQuestions
        });
      }
      
      toast({
        title: "Quiz Generated",
        description: "A quiz has been generated based on your teaching session.",
      });
    } catch (error) {
      toast({
        title: "Quiz Generation Failed",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleQuizAnswer = (optionIndex: number) => {
    // Check if the answer is correct
    const isCorrect = currentQuestion && optionIndex === currentQuestion.correctOption;
    
    // Show feedback
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect 
        ? "Great job! You selected the right answer." 
        : `The correct answer was: ${currentQuestion?.options[currentQuestion.correctOption]}`,
      variant: isCorrect ? "default" : "destructive",
    });

    // Move to the next question if available
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentQuestion(questions[currentQuestionIndex + 1]);
      }, 1500);
    } else {
      // Quiz completed
      setTimeout(() => {
        setShowQuiz(false);
        toast({
          title: "Quiz Completed",
          description: "You've completed the quiz! Great job reviewing the material.",
        });
      }, 1500);
    }
  };

  const expandQuiz = () => {
    setShowQuiz(false);
    setShowExpandedQuiz(true);
  };

  return {
    generateQuiz,
    currentQuestion,
    showQuiz,
    setShowQuiz,
    handleQuizAnswer,
    expandQuiz,
    showExpandedQuiz,
    setShowExpandedQuiz,
    questions,
    currentQuestionIndex,
    isGeneratingQuiz
  };
}

// Helper function to generate quiz questions from teaching content
// This simulates what would normally be done by the OpenAI API
function generateQuestionsFromContent(content: string): QuizQuestion[] {
  const cleanContent = content.toLowerCase();
  const questions: QuizQuestion[] = [];
  
  // Generate questions based on content keywords
  if (cleanContent.includes("newton") || cleanContent.includes("law") || cleanContent.includes("physics")) {
    questions.push({
      id: `q${Date.now()}-1`,
      question: "Which of the following best describes Newton's First Law?",
      options: [
        "Objects in motion stay in motion forever.",
        "Force equals mass times acceleration.",
        "An object will remain at rest or in motion unless acted upon by a force.",
        "For every action, there is an equal and opposite reaction."
      ],
      correctOption: 2
    });
  }
  
  if (cleanContent.includes("math") || cleanContent.includes("equation") || cleanContent.includes("formula")) {
    questions.push({
      id: `q${Date.now()}-2`,
      question: "Which mathematical formula represents the Pythagorean theorem?",
      options: [
        "E = mc²",
        "a² + b² = c²",
        "F = ma",
        "V = IR"
      ],
      correctOption: 1
    });
  }
  
  if (cleanContent.includes("program") || cleanContent.includes("code") || cleanContent.includes("software")) {
    questions.push({
      id: `q${Date.now()}-3`,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Machine Learning",
        "Hyperlink Transfer Method Language",
        "Home Tool Markup Language"
      ],
      correctOption: 0
    });
  }
  
  if (cleanContent.includes("biology") || cleanContent.includes("cell") || cleanContent.includes("organism")) {
    questions.push({
      id: `q${Date.now()}-4`,
      question: "Which organelle is known as the 'powerhouse of the cell'?",
      options: [
        "Nucleus",
        "Endoplasmic Reticulum",
        "Mitochondria",
        "Golgi Apparatus"
      ],
      correctOption: 2
    });
  }
  
  // Default question if no specific content is detected
  if (questions.length === 0) {
    questions.push({
      id: `q${Date.now()}-default`,
      question: "Based on your teaching, which statement is most accurate?",
      options: [
        "Knowledge is best gained through repetition",
        "Understanding concepts is more important than memorizing facts",
        "Visual aids are the most effective teaching tool",
        "Learning should always be a structured process"
      ],
      correctOption: 1
    });
  }
  
  return questions;
}
