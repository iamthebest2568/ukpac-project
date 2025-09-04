import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroPolicyThoughtsPage = () => {
  const { navigateToPage } = useSession();

  const handleChoice = (choice: string) => {
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/intro-reply-friend");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality
    console.log("Replay clicked");
  };

  const buttons = [
    {
      text: "ไม่เชื่อว่าแก้ปัญหาได้จริง",
      onClick: () => handleChoice("ไม่เชื่อว่าแก้ปัญหาได้จริง"),
      ariaLabel: "เลือกไม่เชื่อว่าแก้ปัญหาได้จริง",
    },
    {
      text: "กังวลค่าใช้จ่าย",
      onClick: () => handleChoice("กังวลค่าใช้จ่าย"),
      ariaLabel: "เลือกกังวลค่าใช้จ่าย",
    },
    {
      text: "ไม่อยากใช้เพราะไม่สะดวก",
      onClick: () => handleChoice("ไม่อยากใช้เพราะไม่สะดวก"),
      ariaLabel: "เลือกไม่อยากใช้เพราะไม่สะดวก",
    },
    {
      text: "ยินดีจ่ายเพราะรถจะติดน้อยลง",
      onClick: () => handleChoice("ยินดีจ่ายเพราะรถจะติดน้อยลง"),
      ariaLabel: "เลือกยินดีจ่ายเพราะรถจะติดน้อยลง",
    },
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="/placeholder.svg"
      backgroundAlt="Policy thoughts background"
      title="คุณคิดเห็นอย่างไร
กับนโยบายนี้"
      buttons={buttons}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง",
      }}
    />
  );
};

export default IntroPolicyThoughtsPage;
