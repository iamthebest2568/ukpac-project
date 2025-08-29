import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroStartPage = () => {
  const { navigateToPage } = useSession();

  const handleStart = () => {
    navigateToPage("/intro-who-are-you");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="/opening-compress.mp4"
      backgroundAlt="Intro video background"
      isVideo={true}
      title={`แล้วถ้าหากวันหนึ่งมี
การเก็บค่าธรรมเนียม
เพื่อแก้ไขปัญหาจราจร
จะเป็นอย่างไร...`}
      buttons={[
        {
          text: "เริ่มเล่น",
          onClick: handleStart,
          ariaLabel: "เริ่มเล่นเกม"
        }
      ]}
      videoSegment={{
        startTime: 0.0,
        endTime: 0.7
      }}
      replayButton={{
        onClick: () => console.log("Replay clicked"),
        ariaLabel: "ดูอีกครั้ง"
      }}
    />
  );
};

export default IntroStartPage;
