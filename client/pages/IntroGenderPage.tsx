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
      ariaLabel: "เลือกผู้หญิง",
    },
    {
      text: "ผู้ชาย",
      onClick: () => handleChoice("ผู้ชาย"),
      ariaLabel: "เลือกผู้ชาย",
    },
    {
      text: "เพศทางเลือก",
      onClick: () => handleChoice("เพศทางเลือก"),
      ariaLabel: "เลือกเพศทางเลือก",
    },
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="/opening-compress.mp4"
      backgroundAlt="Gender selection video background"
      isVideo={true}
      title="เพศของคุณ"
      buttons={buttons}
      videoSegment={{
        startTime: 0.15,
        endTime: 0.18,
      }}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง",
      }}
    />
  );
};

export default IntroGenderPage;
