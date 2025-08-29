/**
 * UK PACK - MN2 Mini-Game Flow Container
 * Manages the second and third steps of the Policy Designer mini-game
 * (beneficiaries selection + policy summary)
 */

import { useState } from "react";

// Internal step components
import Step1_Beneficiaries from "./MN2/Step1_Beneficiaries";
import Step2_Summary from "./MN2/Step2_Summary";

interface Flow_MiniGame_MN2Props {
  sessionID: string | null;
  onComplete: (data: any) => void;
  onBack?: () => void;
  mn1Data?: any; // Data from MN1 flow (selected priorities)
}

const Flow_MiniGame_MN2 = ({ sessionID, onComplete, onBack, mn1Data }: Flow_MiniGame_MN2Props) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [flowData, setFlowData] = useState<any>({});

  const handleStepComplete = (stepData: any) => {
    const updatedData = { ...flowData, ...stepData };
    setFlowData(updatedData);

    if (currentStep === 1) {
      // Move to summary step
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Complete the entire flow
      const completeData = {
        ...mn1Data, // Include MN1 data
        ...updatedData // Include MN2 data
      };
      onComplete(completeData);
    }
  };

  const handleStepBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 1 && onBack) {
      onBack();
    }
  };

  const renderCurrentStep = () => {
    const combinedData = { ...mn1Data, ...flowData };

    console.log("Flow_MiniGame_MN2 - currentStep:", currentStep);
    console.log("Flow_MiniGame_MN2 - mn1Data:", mn1Data);
    console.log("Flow_MiniGame_MN2 - flowData:", flowData);
    console.log("Flow_MiniGame_MN2 - combinedData:", combinedData);

    switch (currentStep) {
      case 1:
        return (
          <Step1_Beneficiaries
            sessionID={sessionID}
            onNext={handleStepComplete}
            onBack={handleStepBack}
            mn1Data={mn1Data}
            initialData={flowData.beneficiaries}
          />
        );
      case 2:
        return (
          <Step2_Summary
            sessionID={sessionID}
            onNext={handleStepComplete}
            onBack={handleStepBack}
            journeyData={combinedData}
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

export default Flow_MiniGame_MN2;
