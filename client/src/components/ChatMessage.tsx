import { ChatMessage as ChatMessageType } from "@/types";
import { User, AiPersona } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface ChatMessageProps {
  message: ChatMessageType;
  user: User | null;
  persona: AiPersona | null;
  onFeedback?: (feedback: "good" | "confused") => void;
  showFeedback?: boolean;
}

const ChatMessage = ({
  message,
  user,
  persona,
  onFeedback,
  showFeedback = false,
}: ChatMessageProps) => {
  const isAi = message.role === "ai";
  const avatar = isAi ? persona?.avatarUrl : user?.avatarUrl;
  const [isTyping, setIsTyping] = useState(isAi);
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const messageContent = message.content;
  
  // For AI messages, simulate typing effect
  useEffect(() => {
    if (!isAi) {
      setDisplayedContent(messageContent);
      return;
    }
    
    // Reset state when message changes
    if (messageContent !== displayedContent && currentIndex === 0) {
      setDisplayedContent("");
      setIsTyping(true);
    }
    
    // Typing animation
    if (currentIndex < messageContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(prev => prev + messageContent[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 10); // Adjust speed as needed
      
      return () => clearTimeout(timeout);
    } else if (currentIndex === messageContent.length) {
      setIsTyping(false);
    }
  }, [messageContent, currentIndex, isAi, displayedContent]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const bubbleVariants = {
    hidden: isAi 
      ? { opacity: 0, x: -20 } 
      : { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        mass: 1
      } 
    }
  };
  
  const feedbackVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.3,
        duration: 0.4,
        ease: "easeOut" 
      }
    }
  };
  
  const avatarVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: { repeat: Infinity, duration: 1.5 }
    },
    static: {
      scale: 1,
      opacity: 1
    }
  };
  
  // Styles for the typing indicator
  const typingIndicatorStyles = `
    inline-block h-2 w-2 rounded-full bg-accent mr-1 opacity-70
  `;
  
  return (
    <motion.div 
      className={`flex flex-col max-w-md mx-auto md:mx-0 md:max-w-lg ${!isAi && "ml-auto items-end"}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={`flex items-start ${!isAi && "flex-row-reverse"}`}>
        <motion.img
          src={avatar}
          alt={`${isAi ? persona?.name : user?.displayName} Avatar`}
          className={`w-8 h-8 rounded-full object-cover mt-1 ${isAi ? "mr-3" : "ml-3"}`}
          variants={avatarVariants}
          animate={isTyping && isAi ? "pulse" : "static"}
        />
        <motion.div
          className={`flex-1 ${
            isAi
              ? "bg-white dark:bg-gray-800 chat-bubble-ai rounded-2xl dark:text-gray-100"
              : "bg-primary chat-bubble-user rounded-2xl text-white"
          } px-4 py-3 shadow-sm`}
          variants={bubbleVariants}
          initial="hidden"
          animate="visible"
        >
          {isAi ? (
            <>
              {displayedContent.split('\n').map((paragraph, idx) => (
                <p key={idx} className={`text-sm ${idx < displayedContent.split('\n').length - 1 ? "mb-3" : ""}`}>
                  {paragraph}
                </p>
              ))}
              {isTyping && (
                <div className="mt-1 flex space-x-1 h-4">
                  <motion.span 
                    className={typingIndicatorStyles}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  />
                  <motion.span 
                    className={typingIndicatorStyles}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                  />
                  <motion.span 
                    className={typingIndicatorStyles}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.4 }}
                  />
                </div>
              )}
            </>
          ) : (
            // User messages don't need typing animation
            message.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className={`text-sm ${idx < message.content.split('\n').length - 1 ? "mb-3" : ""}`}>
                {paragraph}
              </p>
            ))
          )}
        </motion.div>
      </div>
      
      <AnimatePresence>
        {showFeedback && isAi && onFeedback && !isTyping && (
          <motion.div 
            className="mt-3 ml-11 flex space-x-2"
            variants={feedbackVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
          >
            <motion.button 
              className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-gray-800 text-neutral-700 dark:text-gray-300 rounded-full hover:bg-neutral-200 dark:hover:bg-gray-700"
              onClick={() => onFeedback("good")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-check text-accent mr-1"></i> Good explanation
            </motion.button>
            <motion.button 
              className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-gray-800 text-neutral-700 dark:text-gray-300 rounded-full hover:bg-neutral-200 dark:hover:bg-gray-700"
              onClick={() => onFeedback("confused")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-question-circle mr-1"></i> Still confused
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {message.feynmanStep === 'review' && isAi && !isTyping && (
          <motion.div 
            className="mt-3 ml-11"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <motion.div 
              className="p-3 bg-neutral-50 dark:bg-gray-800 rounded-xl border border-neutral-200 dark:border-gray-700"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <p className="text-xs font-medium mb-2 dark:text-gray-300">Feynman Review Step</p>
              <p className="text-sm mb-3 dark:text-gray-300">What parts should I improve in my explanation?</p>
              <div className="flex flex-wrap gap-2">
                <motion.button 
                  className="px-3 py-1.5 text-xs bg-white dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 text-neutral-700 dark:text-gray-300 rounded-full hover:bg-neutral-100 dark:hover:bg-gray-600 hover:border-neutral-300 dark:hover:border-gray-500"
                  whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Need simpler language
                </motion.button>
                <motion.button 
                  className="px-3 py-1.5 text-xs bg-white dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 text-neutral-700 dark:text-gray-300 rounded-full hover:bg-neutral-100 dark:hover:bg-gray-600 hover:border-neutral-300 dark:hover:border-gray-500"
                  whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add real examples
                </motion.button>
                <motion.button 
                  className="px-3 py-1.5 text-xs bg-white dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 text-neutral-700 dark:text-gray-300 rounded-full hover:bg-neutral-100 dark:hover:bg-gray-600 hover:border-neutral-300 dark:hover:border-gray-500"
                  whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Correct misconception
                </motion.button>
                <motion.button 
                  className="px-3 py-1.5 text-xs bg-accent/20 dark:bg-accent/10 border border-accent/30 text-accent-dark dark:text-accent rounded-full"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(52, 211, 153, 0.25)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-check mr-1"></i> Good, move to Simplify step
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatMessage;
