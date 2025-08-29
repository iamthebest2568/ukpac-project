import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";
import { useState } from "react";

const IntroTravelFreqCityPage = () => {
  const { navigateToPage } = useSession();
  const [selectedChoice, setSelectedChoice] = useState<string>("ทุกวันธรรมดา"); // Pre-select as shown in design

  const handleChoice = (choice: string) => {
    setSelectedChoice(choice);
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/intro-policy-thoughts");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality - could replay video or audio content
    console.log("Replay clicked");
  };

  const choices = [
    { text: "ทุกวัน" },
    { text: "ทุกวันธรรมดา" }, // Pre-selected as shown in Figma
    { text: "สัปดาห์ละครั้ง" },
    { text: "เ���ือนละครั้ง" },
    { text: "ไม่ค่อยเข้าเมือง" }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/6199baab2fbf2c0d1c0b2131243961bbff593cdf?width=1132"
      backgroundAlt="Travel frequency background"
      title="คุณเดินทางเข้าเมือง
บ่อยแค่ไหน"
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

export default IntroTravelFreqCityPage;
