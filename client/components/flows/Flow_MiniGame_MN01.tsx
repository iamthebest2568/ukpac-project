/**
 * UK PACK - MN01 Mini-Game Flow Container (cloned from MN3)
 */

import { useState } from "react";

// Internal step components
import Step1_Choice from "./MN01/Step1_Choice";
import Step2_Allocation from "./MN01/Step2_Allocation";
import Step3_Result from "./MN01/Step3_Result";

interface Flow_MiniGame_MN01Props {
  sessionID: string | null;
  onComplete: (data: any) => void;
  onBack?: () => void;
}

const Flow_MiniGame_MN01 = ({ sessionID, onComplete, onBack }: Flow_MiniGame_MN01Props) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [flowData, setFlowData] = useState<any>({});

  const handleStepComplete = (stepData: any) => {
    const updatedData = { ...flowData, ...stepData };
    setFlowData(updatedData);

    if (currentStep === 1) {
      // Move to allocation step
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Move to result step
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Complete the entire flow
      onComplete(updatedData);
    }
  };

  const handleStepBack = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 1 && onBack) {
      onBack();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_Choice
            sessionID={sessionID}
            onNext={handleStepComplete}
            onBack={handleStepBack}
            initialData={flowData.budget_step1_choice}
          />
        );
      case 2:
        return (
          <Step2_Allocation
            sessionID={sessionID}
            onNext={handleStepComplete}
            onBack={handleStepBack}
            journeyData={flowData}
          />
        );
      case 3:
        return (
          <Step3_Result
            sessionID={sessionID}
            onNext={handleStepComplete}
            onBack={handleStepBack}
            journeyData={flowData}
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

export default Flow_MiniGame_MN01;
