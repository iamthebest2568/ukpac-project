import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroGenderPage = () => {
  const { navigateToPage } = useSession();

  const handleNext = () => {
    navigateToPage("/intro-group-selection");
  };

  const handleBack = () => {
    navigateToPage("/intro-who-are-you");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="" // Will be replaced with video background
      backgroundAlt="Gender selection background"
      title="เพศของคุณคืออะไร?"
      buttons={[
        {
          text: "ชาย",
          onClick: handleNext,
          ariaLabel: "เลือกเพศชาย"
        },
        {
          text: "หญิง",
          onClick: handleNext,
          ariaLabel: "เลือกเพศหญิง"
        },
        {
          text: "อื่นๆ",
          onClick: handleNext,
          ariaLabel: "เลือกเพศอื่นๆ"
        }
      ]}
    />
  );
};

export default IntroGenderPage;
