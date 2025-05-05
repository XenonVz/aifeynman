import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/types";

interface QuizCardProps {
  show: boolean;
  onClose: () => void;
  onExpand: () => void;
  question: QuizQuestion;
  onAnswer: (optionIndex: number) => void;
}

const QuizCard = ({ show, onClose, onExpand, question, onAnswer }: QuizCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
  }, [question]);

  const handleOptionSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedOption(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption !== null) {
      onAnswer(selectedOption);
      setIsAnswered(true);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 right-4 z-20 w-80">
      <Card className="shadow-lg border border-neutral-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-bold">Quick Quiz</CardTitle>
            <div className="flex space-x-2">
              <button 
                className="text-xs text-neutral-500 hover:text-neutral-700"
                onClick={onExpand}
              >
                <i className="fas fa-expand-alt"></i>
              </button>
              <button 
                className="text-xs text-neutral-500 hover:text-neutral-700"
                onClick={onClose}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm font-medium mb-2">{question.question}</p>
          
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <label 
                key={index}
                className={`flex items-center p-2 rounded-lg border ${
                  isAnswered
                    ? index === question.correctOption
                      ? "border-accent bg-accent/10"
                      : selectedOption === index
                      ? "border-destructive bg-destructive/10"
                      : "border-neutral-200"
                    : selectedOption === index
                    ? "border-primary bg-primary/10"
                    : "border-neutral-200 hover:bg-neutral-50"
                } cursor-pointer`}
                onClick={() => handleOptionSelect(index)}
              >
                <input 
                  type="radio" 
                  name="quiz-answer" 
                  className="mr-2 accent-primary"
                  checked={selectedOption === index}
                  readOnly
                />
                <span className="text-sm">{option}</span>
                {isAnswered && index === question.correctOption && (
                  <i className="fas fa-check text-accent ml-auto"></i>
                )}
                {isAnswered && selectedOption === index && index !== question.correctOption && (
                  <i className="fas fa-times text-destructive ml-auto"></i>
                )}
              </label>
            ))}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full mt-3"
            onClick={handleCheckAnswer}
            disabled={selectedOption === null || isAnswered}
          >
            {isAnswered ? "Next Question" : "Check Answer"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizCard;
