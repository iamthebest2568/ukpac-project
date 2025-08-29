import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroStartPage = () => {
  const { navigateToPage } = useSession();

  const handleStart = () => {
    navigateToPage("/intro-who-are-you");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="" // Will be replaced with video background
      backgroundAlt="Intro background"
      title="เริ่มต้นการสำรวจ"
      buttons={[
        {
          text: "เริ่มต้น",
          onClick: handleStart,
          ariaLabel: "เริ่มต้นการสำรวจ"
        }
      ]}
    />
  );
};

export default IntroStartPage;
