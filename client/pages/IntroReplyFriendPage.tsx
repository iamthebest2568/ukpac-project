import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroReplyFriendPage = () => {
  const { navigateToPage } = useSession();

  const handleChoice = (choice: string) => {
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/intro-policy-feel");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality - could replay video or audio content
    console.log("Replay clicked");
  };

  const buttons = [
    {
      text: "ดูแล้ว",
      onClick: () => handleChoice("ดูแล้ว"),
      ariaLabel: "เลือกดูแล้ว"
    },
    {
      text: "อยากรู้อยู่พอดี",
      onClick: () => handleChoice("อยากรู้อยู่พอดี"),
      ariaLabel: "เลือกอยากรู้อยู่พอดี"
    },
    {
      text: "ยังไม่ได้ดู",
      onClick: () => handleChoice("ยังไม่ได้ดู"),
      ariaLabel: "เลือกยังไม่ได้ดู"
    }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/419597ed0400b0cba84e4b50f1b9a2bb3217526c?width=956"
      backgroundAlt="Reply friend background"
      title="คุณจะตอบกลับเพื่อน
ว่าอย่างไร"
      buttons={buttons}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง"
      }}
    />
  );
};

export default IntroReplyFriendPage;
