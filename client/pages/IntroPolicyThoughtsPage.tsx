import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";
import { useState } from "react";

const IntroPolicyThoughtsPage = () => {
  const { navigateToPage } = useSession();
  const [selectedChoice, setSelectedChoice] = useState<string>("กังวัลค่าใช้จ่าย"); // Pre-select as shown in design

  const handleChoice = (choice: string) => {
    setSelectedChoice(choice);
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/intro-reply-friend");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality - could replay video or audio content
    console.log("Replay clicked");
  };

  const choices = [
    { text: "ไม่เชื่อว่าแก้ปัญหาได้จริง" },
    { text: "กังวัลค่าใช้จ่าย" }, // This should be pre-selected and appear as black button
    { text: "ไม่อยากใช้เพราะไม่สะดวก" },
    { text: "ยินดีจ่ายเพราะรถจะติดน้อยลง" }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/3cfdc582d291da8313da83afa531f66c01c9c5a7?width=1132"
      backgroundAlt="Policy thoughts background"
      title="คุณคิดเห็นอย่างไร
กับนโยบายนี้"
      buttons={choices.map((choice) => ({
        text: choice.text,
        onClick: () => handleChoice(choice.text),
        ariaLabel: `เลือก${choice.text}`,
        isSelected: selectedChoice === choice.text
      }))}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง"
      }}
    />
  );
};

export default IntroPolicyThoughtsPage;
