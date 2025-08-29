import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";
import { useState } from "react";

const IntroTravelModeCityPage = () => {
  const { navigateToPage } = useSession();
  const [selectedChoice, setSelectedChoice] = useState<string>("อยู่ในพื้นที่ไม่ต้องเข้าเมือง"); // Pre-select as shown in design

  const handleChoice = (choice: string) => {
    setSelectedChoice(choice);
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/intro-travel-freq-city");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality - could replay video or audio content
    console.log("Replay clicked");
  };

  const choices = [
    { text: "รถไฟฟ้า BTS / MRT" },
    { text: "อยู่ในพื้นที่ไม่ต้องเข้าเมือง" }, // This should be pre-selected and appear as black button
    { text: "รถยนต���" },
    { text: "รถ รับ-ส่ง" },
    { text: "รถประจำทาง" }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/3cfdc582d291da8313da83afa531f66c01c9c5a7?width=1132"
      backgroundAlt="Travel mode background"
      title="คุณเดินทางเข้าเมือง
ด้วยวิธีไหน"
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

export default IntroTravelModeCityPage;
