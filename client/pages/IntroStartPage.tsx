import React from "react";
import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroStartPage = () => {
  const { navigateToPage } = useSession();

  const handleStart = () => {
    // Direct navigation
    navigateToPage("/intro-who-are-you");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
      backgroundAlt="Intro background"
      title={`แล้วถ้าหากวันหนึ่งมี\nการเก็บค่าธรรมเนียม\nเพื่อแก้ไขปัญหาจราจร\nจะเป็นอย่างไร...`}
      buttons={[
        {
          text: "เริ่มเล่น",
          onClick: handleStart,
          ariaLabel: "เริ่มเล่นเกม",
        },
      ]}
    />
  );
};

export default IntroStartPage;
