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
import { ChatMessage as ChatMessageType, GapItem, QuizQuestion } from "@/types";
import { useChat } from "@/hooks/use-chat";
import { useFeynman } from "@/hooks/use-feynman";
import { useMaterials } from "@/hooks/use-materials";
import { useAi } from "@/hooks/use-ai";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TeachingPageProps {
  persona: AiPersona | null;
  user: User | null;
}

const TeachingPage = ({ persona, user }: TeachingPageProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  
  // Active session state
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [sessionTopic, setSessionTopic] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());
  
  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Chat state
  const { messages, sendMessage, isLoading } = useChat(persona);
  
  // Feynman process state
  const { feynmanProgress, moveToNextStep, getFeedback } = useFeynman({
    activeSessionId,
    userId: user?.id || null,
    messages
  });
  
  // Material upload and gap analysis state
  const { 
    uploadMaterial, 
    gaps, 
    showGapsReport, 
    setShowGapsReport, 
    showMaterialUpload, 
    setShowMaterialUpload, 
    teachConcept,
    isLoadingGaps 
  } = useMaterials({
    activeSessionId,
    userId: user?.id || null,
    messages
  });
  
  // Quiz state
  const { 
    generateQuiz, 
    currentQuestion, 
    showQuiz, 
    setShowQuiz,
    handleQuizAnswer,
    expandQuiz,
    isGeneratingQuiz
  } = useAi({
    activeSessionId,
    userId: user?.id || null,
    messages
  });
  
  // Create session mutation
  const createSession = useMutation({
    mutationFn: async (data: { 
      userId: number;
      title: string;
      aiPersonaId: number;
      topic?: string | null;
    }) => {
      const response = await apiRequest('POST', '/api/sessions', data);
      return await response.json();
    },
    onSuccess: (data) => {
      setActiveSessionId(data.id);
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', user?.id] });
      toast({
        title: "Session Created",
        description: "New teaching session started successfully.",
      });
    },
    onError: (error) => {
      console.error('Failed to create session:', error);
      toast({
        title: "Session Creation Failed",
        description: "Could not create a new session. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Update session mutation
  const updateSession = useMutation({
    mutationFn: async (data: { 
      id: number;
      title?: string;
      topic?: string;
      completed?: boolean;
      currentStep?: string;
    }) => {
      const response = await apiRequest('PATCH', `/api/sessions/${data.id}`, data);
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', user?.id] });
      toast({
        title: "Session Saved",
        description: "Your teaching session has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Failed to update session:', error);
      toast({
        title: "Save Failed",
        description: "Could not save your session. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Initialize a new session when component mounts
  useEffect(() => {
    if (user && persona && !activeSessionId) {
      // Extract the first message if any to use as the title
      let sessionTitle = `Session with ${persona.name}`;
      
      // Create the session
      createSession.mutate({
        userId: user.id,
        title: sessionTitle,
        aiPersonaId: persona.id,
        topic: null
      });
      
      setSessionStartTime(new Date());
    }
  }, [user, persona]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    
    // Determine the topic from messages
    if (messages.length > 0 && !sessionTopic) {
      const firstUserMessage = messages.find(msg => msg.role === "user")?.content;
      if (firstUserMessage && firstUserMessage.length > 5) {
        // Extract a topic from the first message (or in real app, use AI to identify topic)
        const topic = firstUserMessage.split(' ').slice(0, 3).join(' ') + '...';
        setSessionTopic(topic);
        
        // Update the session with the topic if we have an active session
        if (activeSessionId) {
          updateSession.mutate({
            id: activeSessionId,
            topic: topic
          });
        }
      }
    }
  }, [messages, activeSessionId]);
  
  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0 && persona) {
      sendMessage("", true);
    }
  }, [persona]);
  
  const handleMessageSend = (content: string) => {
    sendMessage(content);
    
    // If this is the first user message, save it with the feynmanStep
    if (messages.length <= 1 && activeSessionId) {
      // In a real implementation, you would save this message to the database
      // const response = await apiRequest('POST', '/api/messages', {
      //   sessionId: activeSessionId,
      //   role: "user",
      //   content: content,
      //   feynmanStep: feynmanProgress.currentStep
      // });
    }
  };
  
  const handleSaveSession = () => {
    if (!activeSessionId) {
      toast({
        title: "No Active Session",
        description: "There is no active session to save.",
        variant: "destructive"
      });
      return;
    }
    
    // Get list of completed steps
    const completedSteps = feynmanProgress.steps
      .filter(step => step.complete)
      .map(step => step.id);
    
    // Update the session
    updateSession.mutate({
      id: activeSessionId,
      title: `Session with ${persona?.name} - ${sessionTopic || 'Untitled'}`,
      topic: sessionTopic,
      currentStep: feynmanProgress.currentStep,
      completed: completedSteps.length === feynmanProgress.steps.length
    });
  };
  
  const handleFileUpload = (files: File[]) => {
    uploadMaterial(files)
      .then(() => {
        // Success toast shown in the uploadMaterial function
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
                src={persona?.avatarUrl || ""}
                alt="AI Avatar" 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <p className="font-medium dark:text-white">Teaching <span>{persona?.name}</span></p>
                <p className="text-xs text-neutral-500 dark:text-gray-400">
                  Session started {getSessionTime(sessionStartTime)}
                  {sessionTopic && ` • Topic: ${sessionTopic}`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center px-3 py-1.5 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={handleSaveSession}
              disabled={!activeSessionId}
            >
              <i className="fas fa-save mr-1.5 text-neutral-500 dark:text-gray-400"></i>
              <span>Save Session</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center px-3 py-1.5 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setShowMaterialUpload(true)}
              disabled={!activeSessionId}
            >
              <i className="fas fa-file-upload mr-1.5 text-neutral-500 dark:text-gray-400"></i>
              <span>Upload Material</span>
            </Button>
            <Button 
              size="sm" 
              className="flex items-center px-3 py-1.5 text-sm dark:bg-primary dark:hover:bg-primary-dark"
              onClick={() => generateQuiz()}
              disabled={!activeSessionId || isGeneratingQuiz || messages.length < 3}
            >
              <i className="fas fa-list-check mr-1.5"></i>
              <span>{isGeneratingQuiz ? "Generating..." : "Generate Quiz"}</span>
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
            onSendMessage={handleMessageSend}
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
function getSessionTime(startTime: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - startTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins === 1) return '1 minute ago';
  return `${diffMins} minutes ago`;
}

export default TeachingPage;
