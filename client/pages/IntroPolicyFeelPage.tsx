import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroPolicyFeelPage = () => {
  const { navigateToPage } = useSession();

  const handleFinish = () => {
    navigateToPage("/ask01"); // Navigate to main survey
  };

  const handleBack = () => {
    navigateToPage("/intro-reply-friend");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="" // Will be replaced with video background
      backgroundAlt="Policy feel background"
      title="คุณรู้สึกยังไงกับนโยบายปัจจุบัน?"
      buttons={[
        {
          text: "พอใจ",
          onClick: handleFinish,
          ariaLabel: "เลือกพอใจ"
        },
        {
          text: "ไม่พอใจ",
          onClick: handleFinish,
          ariaLabel: "เลือกไม่พอใจ"
        },
        {
          text: "เฉยๆ",
          onClick: handleFinish,
          ariaLabel: "เลือกเฉยๆ"
        },
        {
          text: "ไม่แน่ใจ",
          onClick: handleFinish,
          ariaLabel: "เลือกไม่แน่ใจ"
        }
      ]}
    />
  );
};

export default IntroPolicyFeelPage;
