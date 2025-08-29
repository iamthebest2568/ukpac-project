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
      backgroundImage="https://cdn.builder.io/o/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faf32686a3c3d417994a2e2311560fea3?alt=media&token=cd0a67ee-b882-4eaa-a103-6640da4da97e&apiKey=0eb7afe56fd645b8b4ca090471cef081"
      backgroundAlt="Policy feel background"
      isVideo={true}
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
