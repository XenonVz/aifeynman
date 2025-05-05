import { useState, useEffect, useRef } from "react";
import { User, AiPersona } from "@shared/schema";
import ChatMessage from "@/components/ChatMessage";
import FeynmanProgress from "@/components/FeynmanProgress";
import MaterialUpload from "@/components/MaterialUpload";
import GapsReport from "@/components/GapsReport";
import QuizCard from "@/components/QuizCard";
import MessageInput from "@/components/MessageInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage as ChatMessageType, GapItem, QuizQuestion, FeynmanStep, FeynmanProgress as FeynmanProgressType } from "@/types";
import { useChat } from "@/hooks/use-chat";
import { useFeynman } from "@/hooks/use-feynman";
import { useMaterials } from "@/hooks/use-materials";
import { useAi } from "@/hooks/use-ai";
import { useIsMobile } from "@/hooks/use-mobile";

interface TeachingPageProps {
  persona: AiPersona | null;
  user: User | null;
}

const TeachingPage = ({ persona, user }: TeachingPageProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Chat state
  const { messages, sendMessage, isLoading } = useChat(persona);
  
  // Feynman process state
  const { feynmanProgress, moveToNextStep, getFeedback } = useFeynman();
  
  // Material upload and gap analysis state
  const { 
    uploadMaterial, 
    gaps, 
    showGapsReport, 
    setShowGapsReport, 
    showMaterialUpload, 
    setShowMaterialUpload, 
    teachConcept 
  } = useMaterials();
  
  // Quiz state
  const { 
    generateQuiz, 
    currentQuestion, 
    showQuiz, 
    setShowQuiz,
    handleQuizAnswer,
    expandQuiz
  } = useAi();
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0 && persona) {
      sendMessage("", true);
    }
  }, [persona]);
  
  const handleMessageSend = (content: string) => {
    sendMessage(content);
  };
  
  const handleSaveSession = () => {
    toast({
      title: "Session Saved",
      description: "Your teaching session has been saved successfully.",
    });
  };
  
  const handleFileUpload = (files: File[]) => {
    uploadMaterial(files)
      .then(() => {
        toast({
          title: "Material Uploaded",
          description: `Successfully uploaded ${files.length} file(s).`,
        });
      })
      .catch((error) => {
        toast({
          title: "Upload Failed",
          description: error.message,
          variant: "destructive",
        });
      });
  };
  
  return (
    <>
      {/* Session Header (Desktop only) */}
      {!isMobile && (
        <div className="bg-white dark:bg-gray-900 border-b border-neutral-200 dark:border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <img 
                src={persona?.avatarUrl}
                alt="AI Avatar" 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <p className="font-medium dark:text-white">Teaching <span>{persona?.name}</span></p>
                <p className="text-xs text-neutral-500 dark:text-gray-400">Session started {getSessionTime()}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center px-3 py-1.5 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={handleSaveSession}
            >
              <i className="fas fa-save mr-1.5 text-neutral-500 dark:text-gray-400"></i>
              <span>Save Session</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center px-3 py-1.5 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setShowMaterialUpload(true)}
            >
              <i className="fas fa-file-upload mr-1.5 text-neutral-500 dark:text-gray-400"></i>
              <span>Upload Material</span>
            </Button>
            <Button 
              size="sm" 
              className="flex items-center px-3 py-1.5 text-sm dark:bg-primary dark:hover:bg-primary-dark"
              onClick={() => generateQuiz()}
            >
              <i className="fas fa-list-check mr-1.5"></i>
              <span>Generate Quiz</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Feynman Progress Tracker */}
      <FeynmanProgress 
        progress={feynmanProgress} 
        onViewGapsReport={() => setShowGapsReport(true)} 
      />
      
      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            user={user}
            persona={persona}
            showFeedback={message.role === "ai" && feynmanProgress.currentStep === "explain"}
            onFeedback={(feedback) => getFeedback(feedback, message.content)}
          />
        ))}
        
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-2 items-center">
              <div className="h-2 w-2 bg-neutral-300 dark:bg-gray-600 rounded-full"></div>
              <div className="h-2 w-2 bg-neutral-300 dark:bg-gray-600 rounded-full"></div>
              <div className="h-2 w-2 bg-neutral-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Material Upload Panel */}
      <MaterialUpload
        open={showMaterialUpload}
        onClose={() => setShowMaterialUpload(false)}
        onUpload={handleFileUpload}
      />
      
      {/* Gaps Report Panel */}
      <GapsReport
        open={showGapsReport}
        onClose={() => setShowGapsReport(false)}
        gaps={gaps}
        onTeachConcept={teachConcept}
      />
      
      {/* Quiz Card */}
      {currentQuestion && (
        <QuizCard
          show={showQuiz}
          onClose={() => setShowQuiz(false)}
          onExpand={expandQuiz}
          question={currentQuestion}
          onAnswer={handleQuizAnswer}
        />
      )}
      
      {/* Message Input Area */}
      <MessageInput
        onSendMessage={handleMessageSend}
        currentStep={feynmanProgress.currentStep}
        isLoading={isLoading}
      />
    </>
  );
};

// Helper function to get session time
function getSessionTime(): string {
  const now = new Date();
  const minutes = Math.floor(Math.random() * 30);
  return `${minutes} minutes ago`;
}

export default TeachingPage;
