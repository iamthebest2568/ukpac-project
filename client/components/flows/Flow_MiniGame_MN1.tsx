/**
 * UK PACK - MN1 Mini-Game Flow Container
 * Manages the first step of the Policy Designer mini-game (priorities selection)
 */

import { useState } from "react";

/**
 * UK PACK - MN1 Mini-Game Flow Container
 * Manages the first step of the Policy Designer mini-game (priorities selection)
 */

import { useState } from "react";

// Internal step components
import Step1_Priorities from "./MN1/Step1_Priorities";

interface Flow_MiniGame_MN1Props {
  sessionID: string | null;
  onComplete: (data: any) => void;
  onBack?: () => void;
}

const Flow_MiniGame_MN1 = ({ sessionID, onComplete, onBack }: Flow_MiniGame_MN1Props) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [flowData, setFlowData] = useState<any>({});

  const handleStepComplete = (stepData: any) => {
    const updatedData = { ...flowData, ...stepData };
    setFlowData(updatedData);

    if (currentStep === 1) {
      // This is the only step in MN1, so complete the flow
      onComplete(updatedData);
    }
  };

  const handleStepBack = () => {
    if (currentStep === 1 && onBack) {
      onBack();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_Priorities
            sessionID={sessionID}
            onNext={handleStepComplete}
            onBack={handleStepBack}
            initialData={flowData.priorities}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flow-container">
      {renderCurrentStep()}
    </div>
  );
};

export default Flow_MiniGame_MN1;
