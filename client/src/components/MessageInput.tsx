import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  currentStep: string;
  isLoading: boolean;
}

const MessageInput = ({ onSendMessage, currentStep, isLoading }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddImage = () => {
    toast({
      title: "Image Upload",
      description: "Image upload feature activated",
      duration: 3000,
    });
  };

  const handleAddFile = () => {
    toast({
      title: "File Upload",
      description: "File upload feature activated",
      duration: 3000,
    });
  };

  const handleMicrophoneClick = () => {
    toast({
      title: "Voice Input",
      description: "Voice recording feature activated",
      duration: 3000,
    });
  };

  // Button animations
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Send button variants
  const sendButtonVariants = {
    disabled: { opacity: 0.5, scale: 0.95 },
    enabled: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    loading: {
      opacity: 1,
      rotateZ: [0, 360],
      transition: {
        rotateZ: {
          repeat: Infinity,
          duration: 1.5,
          ease: "linear"
        }
      }
    }
  };

  // Textarea focus animation
  const textareaVariants = {
    unfocused: { 
      boxShadow: "0 0 0 0 rgba(99, 102, 241, 0)",
      borderColor: "rgba(209, 213, 219, 1)",
      transition: { duration: 0.2 }
    },
    focused: { 
      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)",
      borderColor: "rgba(99, 102, 241, 1)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-900 border-t border-neutral-200 dark:border-gray-800 p-4"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center space-x-2">
        <motion.button 
          className="p-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded-full"
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          onClick={handleMicrophoneClick}
        >
          <i className="fas fa-microphone"></i>
        </motion.button>
        <div className="flex-1 relative">
          <motion.div
            variants={textareaVariants}
            initial="unfocused"
            animate={isFocused ? "focused" : "unfocused"}
            className="rounded-xl overflow-hidden"
          >
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Continue teaching..."
              rows={1}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-gray-700 rounded-xl focus:outline-none resize-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </motion.div>
          <AnimatePresence>
            {message.length > 0 && (
              <motion.div 
                className="absolute right-3 top-3 text-xs text-neutral-400"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                {message.length} chars
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div
          variants={sendButtonVariants}
          initial="disabled"
          animate={isLoading ? "loading" : message.trim() ? "enabled" : "disabled"}
        >
          <Button
            className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark"
            disabled={!message.trim() || isLoading}
            onClick={handleSend}
          >
            {isLoading ? (
              <i className="fas fa-spinner"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </Button>
        </motion.div>
      </div>
      <div className="flex justify-between mt-2 px-1">
        <div className="flex space-x-2 text-xs text-neutral-500 dark:text-gray-400">
          <motion.button 
            className="hover:text-neutral-700 dark:hover:text-gray-300 flex items-center"
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={handleAddImage}
          >
            <i className="fas fa-image mr-1"></i>
            <span>Add image</span>
          </motion.button>
          <motion.button 
            className="hover:text-neutral-700 dark:hover:text-gray-300 flex items-center"
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={handleAddFile}
          >
            <i className="fas fa-file mr-1"></i>
            <span>Add file</span>
          </motion.button>
        </div>
        <motion.div 
          className="text-xs text-neutral-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Feynman Step: 
          <motion.span 
            className="font-medium text-accent dark:text-accent-foreground capitalize ml-1"
            key={currentStep}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            {currentStep}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MessageInput;
