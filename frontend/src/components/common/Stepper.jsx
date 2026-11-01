import React from 'react';
import { Check } from 'lucide-react';

export const Stepper = ({ steps = [], currentStep = 1 }) => {
  return (
    <div className="stepper-header">
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div
            key={idx}
            className={`stepper-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
          >
            <div className="stepper-bubble">
              {isCompleted ? <Check size={16} /> : stepNum}
            </div>
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
};

