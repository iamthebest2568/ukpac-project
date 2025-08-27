/**
 * UK PACK - End Sequence Step 1: Reward Decision
 * Moved from RewardDecision component
 */

import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout";

interface Step1_DecisionProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
}

const Step1_Decision = ({
  sessionID,
  onNext,
  onBack,
  initialData,
}: Step1_DecisionProps) => {
  const handleChoice = (choice: "participate" | "decline") => {
    const choiceText = {
      participate: "ลุ้นรับรางวัล",
      decline: "ไม่",
    }[choice];

    // Log the reward decision
    logEvent({
      event: "REWARD_DECISION",
      payload: {
        choice,
        choiceText,
        sessionID,
      },
    });

    const data = { rewardDecision: { choice, choiceText } };
    onNext(data);
  };

  // Define buttons for the FigmaStyle1Layout
  const buttons = [
    {
      text: "ลุ้นรับรางวัล",
      onClick: () => handleChoice("participate"),
      ariaLabel: "เข้าร่วมโครงการและกรอกข้อมูลเพื่อรับรางวัล",
    },
    {
      text: "ไม่",
      onClick: () => handleChoice("decline"),
      ariaLabel: "ไม่เข้าร่วมโครงการรับรางวัล",
    },
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
      backgroundAlt="รางวัลสำหรับคุณ"
      title={`ขอบคุณที่ร่วมเป็นส่วนหนึ่ง ในการพัฒนาเมือง  คุณอยากกรอกข้อมูลเพิ่ม เพื่อลุ้นรับรางวัลบัตรขนส่ง สาธารณะ 300 บาท หรือไม่?`}
      buttons={buttons}
    />
  );
};

export default Step1_Decision;
