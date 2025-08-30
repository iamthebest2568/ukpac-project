import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroGroupSelectionPage = () => {
  const { navigateToPage } = useSession();

  const handleChoice = (choice: string) => {
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/intro-travel-mode-city");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality - could replay video or audio content
    console.log("Replay clicked");
  };

  const buttons = [
    {
      text: "คนพิการ",
      onClick: () => handleChoice("คนพิการ"),
      ariaLabel: "เลือกคนพิการ"
    },
    {
      text: "เด็ก",
      onClick: () => handleChoice("เด็ก"),
      ariaLabel: "เลือกเด็��"
    },
    {
      text: "ผู้สูงอายุ",
      onClick: () => handleChoice("ผู้สูงอายุ"),
      ariaLabel: "เลือกผู้สูงอายุ"
    },
    {
      text: "อื่นๆ",
      onClick: () => handleChoice("อื่นๆ"),
      ariaLabel: "เลือกอื่นๆ"
    }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="/placeholder.svg"
      backgroundAlt="Group selection background"
      isVideo={false}
      title="คุณมองว่าตัวเองเป็น
คนกลุ่มไหนในเมืองนี้"
      buttons={buttons}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง"
      }}
    />
  );
};

export default IntroGroupSelectionPage;
