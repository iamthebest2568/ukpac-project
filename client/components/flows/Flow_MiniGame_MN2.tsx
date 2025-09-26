/**
 * UK PACK - MN2 Mini-Game Flow Container
 * Manages the second and third steps of the Policy Designer mini-game
 * (beneficiaries selection + policy summary)
 * Now shows one priority question per page for better UX
 */

import { useState, useMemo } from "react";
import Uk1Button from "../shared/Uk1Button";

// Internal step components
import Step1_Beneficiaries from "./MN2/Step1_Beneficiaries";
import Step2_Summary from "./MN2/Step2_Summary";

interface Flow_MiniGame_MN2Props {
  sessionID: string | null;
  onComplete: (data: any) => void;
  onBack?: () => void;
  mn1Data?: any; // Data from MN1 flow (selected priorities)
}

const Flow_MiniGame_MN2 = ({
  sessionID,
  onComplete,
  onBack,
  mn1Data,
}: Flow_MiniGame_MN2Props) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [flowData, setFlowData] = useState<any>({ beneficiarySelections: {} });

  // Extract priorities from MN1 data
  const priorities: string[] = useMemo(() => {
    return mn1Data?.priorities?.selectedPriorities || [];
  }, [mn1Data]);

  // Calculate total steps: one for each priority + one for summary
  const totalSteps = priorities.length + 1;
  const isLastBeneficiaryStep = currentStep === priorities.length;
  const isSummaryStep = currentStep === totalSteps;

  const handleStepComplete = (stepData: any) => {
    if (isSummaryStep) {
      // Complete the entire flow
      const completeData = {
        ...mn1Data, // Include MN1 data
        beneficiaries: {
          selections: Object.values(flowData.beneficiarySelections),
        },
        ...stepData, // Include summary data
      };
      onComplete(completeData);
    } else {
      // This is a beneficiary selection step
      const currentPriority = priorities[currentStep - 1];

      // Extract beneficiary selections from stepData
      const beneficiaryData = stepData.beneficiaries?.selections?.[0] || {
        priority: currentPriority,
        beneficiaries: [],
      };

      // Store this priority's beneficiary selections
      const updatedFlowData = {
        ...flowData,
        beneficiarySelections: {
          ...flowData.beneficiarySelections,
          [currentPriority]: beneficiaryData,
        },
      };

      setFlowData(updatedFlowData);

      // Move to next step
      setCurrentStep(currentStep + 1);
    }
  };

  const isUkpack1 = typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/ukpack1');

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 1 && onBack) {
      onBack();
    }
  };

  const renderCurrentStep = () => {
    if (isSummaryStep) {
      // Prepare combined data for summary
      const allSelections = Object.values(flowData.beneficiarySelections);
      const combinedData = {
        ...mn1Data,
        beneficiaries: { selections: allSelections },
      };

      return (
        <Step2_Summary
          sessionID={sessionID}
          onNext={handleStepComplete}
          onBack={handleStepBack}
          journeyData={combinedData}
          useUk1Button={isUkpack1}
        />
      );
    } else {
      // This is a beneficiary selection step
      const currentPriority = priorities[currentStep - 1];
      const currentPriorityIndex = currentStep - 1;
      // Each step should start fresh with no pre-selected beneficiaries
      const initialBeneficiaries: string[] = [];

      return (
        <Step1_Beneficiaries
          sessionID={sessionID}
          onNext={handleStepComplete}
          onBack={handleStepBack}
          currentPriority={currentPriority}
          currentStep={currentStep}
          totalPrioritySteps={priorities.length}
          initialBeneficiaries={initialBeneficiaries}
          useUk1Button={isUkpack1}
        />
      );
    }
  };

  // If no priorities found, show error
  if (priorities.length === 0) {
    return (
      <div className="figma-style1-container">
        <div className="figma-style1-content">
          <div className="figma-style1-background">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F27759edd1f334fba98515ddd5c397f69?format=webp&width=800"
              alt="กลุ่มผู้ได้รับประโยชน์"
              className="figma-style1-background-image"
            />
            <div className="figma-style1-background-overlay" />
          </div>
          <div className="figma-style1-main">
            <div className="figma-style1-content-area">
              <div className="figma-style1-title-container">
                <h1 className="figma-style1-title">
                  ไม่พบข้อมูลจากขั้นตอนก่อนหน้า
                </h1>
                <p className="text-white text-center mt-4">
                  กรุณากลับไปเลือกนโยบายก่อน
                </p>
              </div>
              <div className="w-full max-w-[325px]">
                {isUkpack1 ? (
                  <Uk1Button onClick={onBack}>
                    <span className="figma-style1-button-text">กลับไปเลือกนโยบาย</span>
                  </Uk1Button>
                ) : (
                  <button onClick={onBack} className="figma-style1-button">
                    <span className="figma-style1-button-text">กลับไปเลือกนโยบาย</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="flow-container">{renderCurrentStep()}</div>;
};

export default Flow_MiniGame_MN2;
