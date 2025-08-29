import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";
import { useState } from "react";

const IntroReplyFriendPage = () => {
  const { navigateToPage } = useSession();
  const [selectedChoice, setSelectedChoice] = useState<string>("อยากรู้อยู่พอดี"); // Pre-select as shown in design

  const handleChoice = (choice: string) => {
    setSelectedChoice(choice);
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/intro-policy-feel");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality - could replay video or audio content
    console.log("Replay clicked");
  };

  const choices = [
    { text: "ดูแล้ว", variant: "default" },
    { text: "อยากรู้อยู่พอดี", variant: "dark" }, // Pre-selected as shown in Figma
    { text: "ยังไม่ได้ดู", variant: "default" }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/419597ed0400b0cba84e4b50f1b9a2bb3217526c?width=956"
      backgroundAlt="Reply friend background"
      title="คุณจะตอบกลับเพื่อน
ว่าอย่า��ไร"
      buttons={choices.map((choice) => ({
        text: choice.text,
        onClick: () => handleChoice(choice.text),
        ariaLabel: `เลือก${choice.text}`,
        isSelected: selectedChoice === choice.text,
        variant: choice.variant as "default" | "dark"
      }))}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง"
      }}
    />
  );
};

export default IntroReplyFriendPage;
