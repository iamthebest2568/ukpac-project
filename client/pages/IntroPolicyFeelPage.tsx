import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroPolicyFeelPage = () => {
  const { navigateToPage } = useSession();

  const handleChoice = (choice: string) => {
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/ask01"); // Navigate to main survey
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality - could replay video or audio content
    console.log("Replay clicked");
  };

  const buttons = [
    {
      text: "เห็นด้วย",
      onClick: () => handleChoice("เห็นด้วย"),
      ariaLabel: "เลือกเห็นด้วย"
    },
    {
      text: "เฉยๆ",
      onClick: () => handleChoice("เฉยๆ"),
      ariaLabel: "เลือกเฉยๆ"
    },
    {
      text: "ไม่เห็นด้วย",
      onClick: () => handleChoice("ไม่เห็นด้วย"),
      ariaLabel: "เลือกไม่เห็นด้วย"
    }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="/placeholder.svg"
      backgroundAlt="Policy feel background"
      title="คุณรู้สึกอย่างไรกับนโยบายนี้"
      buttons={buttons}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง"
      }}
    />
  );
};

export default IntroPolicyFeelPage;
