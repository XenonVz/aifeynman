import { FeynmanProgress as FeynmanProgressType } from "@/types";

interface FeynmanProgressProps {
  progress: FeynmanProgressType;
  onViewGapsReport: () => void;
}

const FeynmanProgress = ({ progress, onViewGapsReport }: FeynmanProgressProps) => {
  const { steps, currentStep } = progress;

  return (
    <div className="bg-white border-b border-neutral-200 p-4 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium mb-1">Feynman Technique Progress</p>
        <div className="flex items-center space-x-2">
          {steps.map((step) => (
            <div key={step.id} className="flex-1">
              <div className="flex items-center mb-1">
                <div 
                  className={`h-2 w-2 rounded-full ${
                    step.complete ? "bg-accent" : "bg-neutral-300"
                  } mr-1.5`}
                ></div>
                <p 
                  className={`text-xs ${
                    step.complete ? "font-medium" : "text-neutral-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              <div 
                className={`h-1 ${
                  step.complete ? "bg-accent" : "bg-neutral-200"
                } rounded-full`}
              ></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="ml-4">
        <button 
          className="text-xs text-primary font-medium hover:underline"
          onClick={onViewGapsReport}
        >
          View Gaps Report
        </button>
      </div>
    </div>
  );
};

export default FeynmanProgress;
