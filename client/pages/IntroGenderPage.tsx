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
      backgroundImage="https://cdn.builder.io/o/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faf32686a3c3d417994a2e2311560fea3?alt=media&token=cd0a67ee-b882-4eaa-a103-6640da4da97e&apiKey=0eb7afe56fd645b8b4ca090471cef081"
      backgroundAlt="Gender selection background"
      isVideo={true}
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
