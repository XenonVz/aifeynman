import { FeynmanProgress as FeynmanProgressType } from "@/types";

interface FeynmanProgressProps {
  progress: FeynmanProgressType;
  onViewGapsReport: () => void;
}

const FeynmanProgress = ({ progress, onViewGapsReport }: FeynmanProgressProps) => {
  const { steps, currentStep } = progress;

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-neutral-200 dark:border-gray-800 p-4 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium mb-1 dark:text-white">Feynman Technique Progress</p>
        <div className="flex items-center space-x-2">
          {steps.map((step) => (
            <div key={step.id} className="flex-1">
              <div className="flex items-center mb-1">
                <div 
                  className={`h-2 w-2 rounded-full ${
                    step.complete ? "bg-accent dark:bg-accent" : "bg-neutral-300 dark:bg-gray-600"
                  } mr-1.5`}
                ></div>
                <p 
                  className={`text-xs ${
                    step.complete ? "font-medium dark:text-gray-200" : "text-neutral-500 dark:text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              <div 
                className={`h-1 ${
                  step.complete ? "bg-accent dark:bg-accent" : "bg-neutral-200 dark:bg-gray-700"
                } rounded-full`}
              ></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="ml-4">
        <button 
          className="text-xs text-primary dark:text-primary-foreground font-medium hover:underline"
          onClick={onViewGapsReport}
        >
          View Gaps Report
        </button>
      </div>
    </div>
  );
};

export default FeynmanProgress;
