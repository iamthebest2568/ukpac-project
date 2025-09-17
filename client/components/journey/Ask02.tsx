import { logEvent } from "../../services/dataLogger.js";
import FigmaStyle1Layout from "../layouts/FigmaStyle1Layout";

interface Ask02Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const Ask02 = ({ sessionID, onNavigate }: Ask02Props) => {
  const handleChoice = (choice: "coverage" | "ineffective" | "other") => {
    const choiceText = {
      coverage: "นโยบายไม่ครอบคลุม",
      ineffective: "เก็บไปก็ไม่มีอะไรเกิดขึ้น",
      other: "อื่นๆ",
    }[choice];

    const data = { choice, choiceText };

    // Log the reasoning choice
    logEvent({
      event: "ASK02_CHOICE",
      payload: {
        choice: choiceText,
        choiceKey: choice,
        sessionID,
      },
    });

    if (choice === "coverage") {
      onNavigate("Flow_MiniGame_MN1", data);
    } else if (choice === "ineffective") {
      onNavigate("Flow_MiniGame_MN3", data);
    } else {
      onNavigate("ask02_2", data);
    }
  };

  // Define buttons for the FigmaStyle1Layout
  const buttons = [
    {
      text: "นโยบายไม่ครอบคลุม",
      onClick: () => handleChoice("coverage"),
      ariaLabel: "เห็นว่านโยบายยังไม่ครอบคลุมประเด็นสำคัญ",
    },
    {
      text: "เก็บไปก็ไม่มีอะไรเกิดขึ้น",
      onClick: () => handleChoice("ineffective"),
      ariaLabel: "เห็นว่าการเก็บเงินอาจไม่ส่งผลต่อการแก้ปัญหา",
    },
    {
      text: "อื่นๆ",
      onClick: () => handleChoice("other"),
      ariaLabel: "มีเหตุผลอื่นที่ต้องการแสดงความคิดเห็น",
    },
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5117e49b26df4728a78a17199af7ae9c?format=webp&width=800"
      backgroundAlt="บุคคลกำลังคิดบนบันไดเลื่อน"
      title={`คุณพอใจผลลัพธ์ที่เกิดขึ้นหรือไม่`}
      buttons={buttons}
      className="ask02-page"
    />
  );
};

export default Ask02;
