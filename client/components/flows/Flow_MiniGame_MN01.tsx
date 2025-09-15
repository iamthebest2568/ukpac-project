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

const Flow_MiniGame_MN01 = ({ sessionID, onComplete, onBack }: Flow_MiniGame_MN01Props) => {
  // Render only the first step (choice) and delegate completion immediately to onComplete
  return (
    <div className="flow-container">
      <Step1_Choice
        sessionID={sessionID}
        onNext={onComplete}
        onBack={onBack}
      />
    </div>
  );
};

export default Flow_MiniGame_MN01;
