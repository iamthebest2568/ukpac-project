import { logEvent } from "../../services/dataLogger.js";
import FigmaStyle1Layout from "../layouts/FigmaStyle1Layout";

interface Ask01Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const Ask01 = ({ sessionID, onNavigate }: Ask01Props) => {
  const handleChoice = (choice: "agree" | "neutral" | "disagree") => {
    const choiceText = {
      agree: "เห็นด้วย",
      neutral: "กลางๆ",
      disagree: "ไม่เห็นด้วย",
    }[choice];

    const data = { choice, choiceText };

    // Log user choice
    logEvent({
      event: "ASK01_CHOICE",
      payload: {
        choice: choiceText,
        choiceKey: choice,
        sessionID,
      },
    });

    if (choice === "agree") {
      onNavigate("fakeNews", data);
    } else {
      onNavigate("ask02", data);
    }
  };

  // Define buttons for the FigmaStyle1Layout
  const buttons = [
    {
      text: "เห็นด้วย",
      onClick: () => handleChoice("agree"),
      ariaLabel: "เห็นด้วยกับข้อความดังกล่าว",
    },
    {
      text: "กลางๆ",
      onClick: () => handleChoice("neutral"),
      ariaLabel: "มีความเห็นเป็นกลางต่อข้อความดั��กล่าว",
    },
    {
      text: "ไม่เห็นด้วย",
      onClick: () => handleChoice("disagree"),
      ariaLabel: "ไม่เห็นด้วยกับข้อความดังกล่าว",
    },
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
      backgroundAlt="รถไฟใต้ดิน"
      title={`จากข้อความดังกล่าว
คุณมีความคิดเห็นอย่างไร`}
      buttons={buttons}
    />
  );
};

export default Ask01;
