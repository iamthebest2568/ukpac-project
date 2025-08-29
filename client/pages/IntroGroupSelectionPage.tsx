import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroGroupSelectionPage = () => {
  const { navigateToPage } = useSession();

  const handleNext = () => {
    navigateToPage("/intro-travel-mode-city");
  };

  const handleBack = () => {
    navigateToPage("/intro-gender");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="" // Will be replaced with video background
      backgroundAlt="Group selection background"
      title="คุณอยู่ใ��กลุ่มอายุไหน?"
      buttons={[
        {
          text: "18-25 ปี",
          onClick: handleNext,
          ariaLabel: "เลือกกลุ่มอายุ 18-25 ปี"
        },
        {
          text: "26-35 ปี",
          onClick: handleNext,
          ariaLabel: "เลือกกลุ่มอายุ 26-35 ปี"
        },
        {
          text: "36-45 ปี",
          onClick: handleNext,
          ariaLabel: "เลือกกลุ่มอายุ 36-45 ปี"
        },
        {
          text: "46+ ปี",
          onClick: handleNext,
          ariaLabel: "เลือกกลุ่มอายุ 46+ ปี"
        }
      ]}
    />
  );
};

export default IntroGroupSelectionPage;
