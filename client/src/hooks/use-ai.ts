import { useState } from "react";
import { QuizQuestion } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function useAi() {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showExpandedQuiz, setShowExpandedQuiz] = useState(false);

  // Mock quiz questions for now
  const mockQuizQuestions: QuizQuestion[] = [
    {
      id: "q1",
      question: "Which of the following best describes Newton's First Law?",
      options: [
        "Objects in motion stay in motion forever.",
        "Force equals mass times acceleration.",
        "An object will remain at rest or in motion unless acted upon by a force.",
        "For every action, there is an equal and opposite reaction."
      ],
      correctOption: 2
    },
    {
      id: "q2",
      question: "In Newton's First Law, when forces are balanced on an object at rest, what happens?",
      options: [
        "The object accelerates",
        "The object remains at rest",
        "The object moves at constant velocity",
        "The object experiences friction"
      ],
      correctOption: 1
    },
    {
      id: "q3",
      question: "What is another name for Newton's First Law?",
      options: [
        "Law of Acceleration",
        "Law of Inertia",
        "Law of Action-Reaction",
        "Law of Conservation"
      ],
      correctOption: 1
    }
  ];

  const generateQuiz = async () => {
    try {
      // In a real implementation, we would call the API to generate a quiz
      // const response = await apiRequest("POST", "/api/quiz/generate", { topic: "current-topic" });
      // const quizData = await response.json();
      // setQuestions(quizData.questions);
      
      // For now, use the mock data
      setQuestions(mockQuizQuestions);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(mockQuizQuestions[0]);
      setShowQuiz(true);
      
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
    }
  };

  const handleQuizAnswer = (optionIndex: number) => {
    // In a real implementation, we would send the answer to the API
    // and get feedback

    // Move to the next question if available
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentQuestion(questions[currentQuestionIndex + 1]);
      }, 1000);
    } else {
      // Quiz completed
      setTimeout(() => {
        setShowQuiz(false);
        toast({
          title: "Quiz Completed",
          description: "You've completed the quiz!",
        });
      }, 1000);
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
    currentQuestionIndex
  };
}
