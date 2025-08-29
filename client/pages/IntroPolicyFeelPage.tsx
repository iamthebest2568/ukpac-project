import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";
import { useState } from "react";

const IntroPolicyFeelPage = () => {
  const { navigateToPage } = useSession();
  const [selectedChoice, setSelectedChoice] = useState<string>("เฉยๆ"); // Pre-select as shown in design

  const handleChoice = (choice: string) => {
    setSelectedChoice(choice);
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/ask01"); // Navigate to main survey
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality - could replay video or audio content
    console.log("Replay clicked");
  };

  const choices = [
    { text: "เห็นด้วย" },
    { text: "เฉยๆ" }, // This should be pre-selected and appear as black button
    { text: "ไม่เห็นด้วย" }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/3cfdc582d291da8313da83afa531f66c01c9c5a7?width=1132"
      backgroundAlt="Policy feel background"
      title="คุณรู้สึกอย่างไรกับนโยบายนี้"
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

export default IntroPolicyFeelPage;
