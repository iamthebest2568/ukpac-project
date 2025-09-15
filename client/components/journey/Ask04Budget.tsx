import { logEvent } from "../../services/dataLogger.js";
import FigmaStyle1Layout from "../layouts/FigmaStyle1Layout";

interface Ask04BudgetProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData?: any;
}

const Ask04Budget = ({
  sessionID,
  onNavigate,
  journeyData,
}: Ask04BudgetProps) => {
  const handleChoice = (choice: "satisfied" | "unsatisfied") => {
    const choiceText = {
      satisfied: "พอใจ",
      unsatisfied: "ไม่พอใจ",
    }[choice];

    const data = { choice, choiceText };

    // Log the satisfaction choice (for MN3 path)
    logEvent({
      event: "SATISFACTION_CHOICE",
      payload: {
        choice: choiceText,
        choiceKey: choice,
        path: "MN3",
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
      ariaLabel: "พอใจกับผลลัพธ์ที่ได้จากการตอบคำถาม",
    },
    {
      text: "ไม่พอใจ",
      onClick: () => handleChoice("unsatisfied"),
      ariaLabel: "ไม่พอใจกับผลลัพธ์และต้องการให้ข้อเสนอแนะ",
    },
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8ba1913a4cf14a5f94abc17994701220?format=webp&width=800"
      backgroundAlt="ผลลัพธ์จากการตอบคำถาม"
      title={`คุณพอใจผลที่เกิด��ึ้นหรือไม่
พิจารณาจากการตอบคำถามและกิจกรรมต่างๆ ที่ผ่านมา`}
      className="ask04-budget-page"
      buttons={buttons}
    />
  );
};

export default Ask04Budget;
