/**
 * UK PACK - MN01 Mini-Game Flow Container (cloned from MN3)
 */

// Flow_MiniGame_MN01 — simplified to only render Step1_Choice per request

import Step1_Choice from "./MN01/Step1_Choice";

interface Flow_MiniGame_MN01Props {
  sessionID: string | null;
  onComplete: (data: any) => void;
  onBack?: () => void;
}

const Flow_MiniGame_MN01 = ({
  sessionID,
  onComplete,
  onBack,
}: Flow_MiniGame_MN01Props) => {
  // Adapt MN01 step output to the expected MN1 shape so downstream flows (MN2) receive priorities
  const handleStep1Complete = (stepData: any) => {
    // Accept multiple possible shapes from Step1_Choice
    const selectedPriorities =
      stepData?.budget_step1_choice?.selectedPriorities ||
      stepData?.selectedPriorities ||
      stepData?.priorities?.selectedPriorities ||
      [];

    const mapped = { priorities: { selectedPriorities } };
    onComplete(mapped);
  };

  return (
    <div className="flow-container">
      <Step1_Choice
        sessionID={sessionID}
        onNext={handleStep1Complete}
        onBack={onBack}
      />
    </div>
  );
};

export default Flow_MiniGame_MN01;
