/**
 * UK PACK - End Sequence Flow Container
 * Manages the final three screens of the reward and thank-you sequence
 */

import { useState, lazy, Suspense } from "react";

// Internal step components
import Step1_Decision from "./EndSequence/Step1_Decision";
import Step2_Form from "./EndSequence/Step2_Form";
import Step3_ThankYou from "./EndSequence/Step3_ThankYou";

interface Flow_EndSequenceProps {
  sessionID: string | null;
  onComplete: (data: any) => void;
  onBack?: () => void;
}

const Flow_EndSequence = ({ sessionID, onComplete, onBack }: Flow_EndSequenceProps) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [flowData, setFlowData] = useState<any>({});

  const handleStepComplete = (stepData: any) => {
    const updatedData = { ...flowData, ...stepData };
    setFlowData(updatedData);

    if (currentStep === 1) {
      // Check decision from Step1_Decision
      if (stepData.rewardDecision?.choice === 'participate') {
        // Move to form step
        setCurrentStep(2);
      } else {
        // Skip form, go directly to thank you
        setCurrentStep(3);
      }
    } else if (currentStep === 2) {
      // Move to thank you step
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Complete the entire flow
      onComplete(updatedData);
    }
  };

  const handleStepBack = () => {
    if (currentStep === 3) {
      // Check if we came from form or directly from decision
      if (flowData.rewardDecision?.choice === 'participate') {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
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
          <Step1_Decision
            sessionID={sessionID}
            onNext={handleStepComplete}
            onBack={handleStepBack}
            initialData={flowData.rewardDecision}
          />
        );
      case 2:
        return (
          <Step2_Form
            sessionID={sessionID}
            onNext={handleStepComplete}
            onBack={handleStepBack}
            initialData={flowData.rewardForm}
          />
        );
      case 3:
        return (
          <Step3_ThankYou
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

export default Flow_EndSequence;
