import { logEvent } from "../../services/dataLogger.js";
import FigmaStyle1Layout from "../layouts/FigmaStyle1Layout";

interface Ask04Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData: any;
}

const Ask04 = ({ sessionID, onNavigate, journeyData }: Ask04Props) => {
  const handleChoice = (choice: "satisfied" | "unsatisfied") => {
    const choiceText = {
      satisfied: "พอใจ",
      unsatisfied: "ไม่พอใจ",
    }[choice];

    const data = { choice, choiceText };

    // Log the satisfaction choice (for MN1/MN2 path)
    logEvent({
      event: "SATISFACTION_CHOICE",
      payload: {
        choice: choiceText,
        choiceKey: choice,
        path: "MN1_MN2",
        sessionID,
      },
    });

    if (choice === "satisfied") {
      onNavigate("fakeNews", data);
    } else {
      onNavigate("ask05", data);
    }
  };

  // Define buttons for the FigmaStyle1Layout
  const buttons = [
    {
      text: "พอใจ",
      onClick: () => handleChoice("satisfied"),
      ariaLabel: "พอใจกับผลลัพธ์ที่ไ���้จากการตอบคำถาม",
    },
    {
      text: "ไม่พอใจ",
      onClick: () => handleChoice("unsatisfied"),
      ariaLabel: "ไม่พอใจกับผลลัพธ์และต้องการให้ข้อเสนอแนะ",
    },
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fa56996a8dcaa4381bfcf73c46db8134d?format=webp&width=800"
      backgroundAlt="ผลลัพธ์จากการตอบคำถาม"
      title={`คุณพอใจผลลัพธ์ที่เกิดขึ้นหรือไม่?
พิจารณาจากการตอบคำถามและกิจกรรมต่างๆ ที่ผ่านมา`}
      className="ask04-page"
      buttons={buttons}
    />
  );
};

export default Ask04;
