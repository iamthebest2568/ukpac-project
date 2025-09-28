/**
 * UK PACK - MN3 Mini-Game Flow Container
 * Manages the three screens of the "Budget Manager" mini-game
 */

import { useState } from "react";

// Internal step components
import Step1_Choice from "./MN3/Step1_Choice";
import Step2_Allocation from "./MN3/Step2_Allocation";
import Step3_Result from "./MN3/Step3_Result";

interface Flow_MiniGame_MN3Props {
  sessionID: string | null;
  onComplete: (data: any) => void;
  onBack?: () => void;
}

const Flow_MiniGame_MN3 = ({
  sessionID,
  onComplete,
  onBack,
}: Flow_MiniGame_MN3Props) => {
  const isUkpack1 =
    typeof window !== "undefined" &&
    window.location &&
    window.location.pathname.startsWith("/beforecitychange");
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
            useUk1Button={isUkpack1}
          />
        );
      case 3:
        return (
          <Step3_Result
            sessionID={sessionID}
            onNext={handleStepComplete}
            onBack={handleStepBack}
            journeyData={flowData}
            useUk1Button={isUkpack1}
          />
        );
      default:
        return null;
    }
  };

  return <div className="flow-container">{renderCurrentStep()}</div>;
};

export default Flow_MiniGame_MN3;
