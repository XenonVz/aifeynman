import { ChatMessage as ChatMessageType } from "@/types";
import { User, AiPersona } from "@shared/schema";

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
  
  return (
    <div className={`flex flex-col max-w-md mx-auto md:mx-0 md:max-w-lg ${!isAi && "ml-auto items-end"}`}>
      <div className={`flex items-start ${!isAi && "flex-row-reverse"}`}>
        <img
          src={avatar}
          alt={`${isAi ? persona?.name : user?.displayName} Avatar`}
          className={`w-8 h-8 rounded-full object-cover mt-1 ${isAi ? "mr-3" : "ml-3"}`}
        />
        <div
          className={`flex-1 ${
            isAi
              ? "bg-white chat-bubble-ai rounded-2xl"
              : "bg-primary chat-bubble-user rounded-2xl text-white"
          } px-4 py-3 shadow-sm`}
        >
          {message.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className={`text-sm ${idx < message.content.split('\n').length - 1 ? "mb-3" : ""}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      
      {showFeedback && isAi && onFeedback && (
        <div className="mt-3 ml-11 flex space-x-2">
          <button 
            className="px-3 py-1.5 text-xs bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200"
            onClick={() => onFeedback("good")}
          >
            <i className="fas fa-check text-accent mr-1"></i> Good explanation
          </button>
          <button 
            className="px-3 py-1.5 text-xs bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200"
            onClick={() => onFeedback("confused")}
          >
            <i className="fas fa-question-circle mr-1"></i> Still confused
          </button>
        </div>
      )}
      
      {message.feynmanStep === 'review' && isAi && (
        <div className="mt-3 ml-11">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <p className="text-xs font-medium mb-2">Feynman Review Step</p>
            <p className="text-sm mb-3">What parts should I improve in my explanation?</p>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 text-xs bg-white border border-neutral-200 text-neutral-700 rounded-full hover:bg-neutral-100 hover:border-neutral-300">
                Need simpler language
              </button>
              <button className="px-3 py-1.5 text-xs bg-white border border-neutral-200 text-neutral-700 rounded-full hover:bg-neutral-100 hover:border-neutral-300">
                Add real examples
              </button>
              <button className="px-3 py-1.5 text-xs bg-white border border-neutral-200 text-neutral-700 rounded-full hover:bg-neutral-100 hover:border-neutral-300">
                Correct misconception
              </button>
              <button className="px-3 py-1.5 text-xs bg-accent/20 border border-accent/30 text-accent-dark rounded-full">
                <i className="fas fa-check mr-1"></i> Good, move to Simplify step
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
