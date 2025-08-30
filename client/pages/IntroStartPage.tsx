import React, { useState } from "react";
import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroStartPage = () => {
  const { navigateToPage } = useSession();
  const [showTitle, setShowTitle] = useState(false);

  const handleStart = () => {
    setShowTitle(true);
    // Navigation will happen after video segment completes
  };

  const handleVideoSegmentComplete = () => {
    navigateToPage("/intro-who-are-you");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="/opening-compress.mp4"
      backgroundAlt="Intro video background"
      isVideo={true}
      autoPlay={false}
      title={showTitle ? `แล้วถ้าหากวันหนึ่งมี
การเก็บค่าธรรมเนียม
เพื่อแก้ไขปัญหาจราจร
จะเป็นอย่างไร...` : ""}
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
      onVideoSegmentComplete={handleVideoSegmentComplete}
    />
  );
};

export default IntroStartPage;
