import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

const StepIndicator = ({ steps, currentStep, completedSteps }: StepIndicatorProps) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-muted" />
        <div 
          className="absolute left-0 top-5 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = currentStep === step.id;
          
          return (
            <div 
              key={step.id} 
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={cn(
                  "step-indicator",
                  isCompleted && "step-indicator-complete",
                  isActive && !isCompleted && "step-indicator-active animate-pulse-ring",
                  !isActive && !isCompleted && "step-indicator-inactive"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-3 text-center hidden md:block">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile Step Info */}
      <div className="md:hidden mt-4 text-center">
        <p className="text-sm font-medium text-primary">
          {steps[currentStep - 1]?.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {steps[currentStep - 1]?.description}
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;
