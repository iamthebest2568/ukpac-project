import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroGenderPage = () => {
  const { navigateToPage } = useSession();

  const handleChoice = (choice: string) => {
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/intro-group-selection");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality - could replay video or audio content
    console.log("Replay clicked");
  };

  const buttons = [
    {
      text: "ผู้หญิง",
      onClick: () => handleChoice("ผู้หญิง"),
      ariaLabel: "เลือกผู้หญิง"
    },
    {
      text: "ผู้ชาย",
      onClick: () => handleChoice("ผู้ชาย"),
      ariaLabel: "เลือกผู้ชาย"
    },
    {
      text: "เพศทางเลือก",
      onClick: () => handleChoice("เพศทางเลือก"),
      ariaLabel: "เลือกเพศทางเลือก"
    }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/o/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faf32686a3c3d417994a2e2311560fea3?alt=media&token=cd0a67ee-b882-4eaa-a103-6640da4da97e&apiKey=0eb7afe56fd645b8b4ca090471cef081"
      backgroundAlt="Gender selection background"
      title="เพศของคุณ"
      buttons={buttons}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง"
      }}
    />
  );
};

export default IntroGenderPage;
