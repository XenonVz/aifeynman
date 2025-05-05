import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  currentStep: string;
  isLoading: boolean;
}

const MessageInput = ({ onSendMessage, currentStep, isLoading }: MessageInputProps) => {
  const [message, setMessage] = useState("");
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

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-neutral-200 dark:border-gray-800 p-4">
      <div className="flex items-center space-x-2">
        <button className="p-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded-full">
          <i className="fas fa-microphone"></i>
        </button>
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Continue teaching..."
            rows={1}
            className="w-full px-4 py-3 border border-neutral-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>
        <Button
          className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark"
          disabled={!message.trim() || isLoading}
          onClick={handleSend}
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
        </Button>
      </div>
      <div className="flex justify-between mt-2 px-1">
        <div className="flex space-x-2 text-xs text-neutral-500 dark:text-gray-400">
          <button className="hover:text-neutral-700 dark:hover:text-gray-300 flex items-center">
            <i className="fas fa-image mr-1"></i>
            <span>Add image</span>
          </button>
          <button className="hover:text-neutral-700 dark:hover:text-gray-300 flex items-center">
            <i className="fas fa-file mr-1"></i>
            <span>Add file</span>
          </button>
        </div>
        <div className="text-xs text-neutral-500 dark:text-gray-400">
          Feynman Step: <span className="font-medium text-accent dark:text-accent-foreground capitalize">{currentStep}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
