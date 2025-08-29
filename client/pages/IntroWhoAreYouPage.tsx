import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";
import { useState } from "react";

const IntroWhoAreYouPage = () => {
  const { navigateToPage } = useSession();
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoice = (choice: string) => {
    setSelectedChoice(choice);
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/intro-gender");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality - could replay video or audio content
    console.log("Replay clicked");
  };

  const choices = [
    "ผู้ที่ต้องเข้ามาทำงาน",
    "ผู้อยู่อาศัยในพื้นที่",
    "นักศึกษาที่เข้ามาเรียนในพื้นที่",
    "ผู้ประกอบการที่มาขายของในพื้นที่",
    "ผู้ปกครองที่เข้ามาส่งลูกในพื้นที่",
    "ผู้เข้ามาช๊อปปิ้ง กินข้าว"
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/o/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faf32686a3c3d417994a2e2311560fea3?alt=media&token=cd0a67ee-b882-4eaa-a103-6640da4da97e&apiKey=0eb7afe56fd645b8b4ca090471cef081"
      backgroundAlt="Who are you background"
      isVideo={true}
      title="คุณเป็นใครเป็นในมหานครนี้"
      buttons={choices.map((choice, index) => ({
        text: choice,
        onClick: () => handleChoice(choice),
        ariaLabel: `เลือก${choice}`,
        isSelected: selectedChoice === choice,
        // Highlight the second option (ผู้อยู่อาศัยในพื้นที่) as shown in Figma
        variant: index === 1 ? "dark" : "default"
      }))}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง"
      }}
    />
  );
};

export default IntroWhoAreYouPage;
