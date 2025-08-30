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
      backgroundImage="/placeholder.svg"
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
