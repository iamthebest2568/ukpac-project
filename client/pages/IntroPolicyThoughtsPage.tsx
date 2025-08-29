import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroPolicyThoughtsPage = () => {
  const { navigateToPage } = useSession();

  const handleNext = () => {
    navigateToPage("/intro-reply-friend");
  };

  const handleBack = () => {
    navigateToPage("/intro-travel-freq-city");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="" // Will be replaced with video background
      backgroundAlt="Policy thoughts background"
      title="คุณคิดยังไงกับนโยบายขนส่งสาธารณะ?"
      buttons={[
        {
          text: "สนใจมาก",
          onClick: handleNext,
          ariaLabel: "เลือกสนใจมาก"
        },
        {
          text: "สนใจปานกลาง",
          onClick: handleNext,
          ariaLabel: "เลือกสนใจปานกลาง"
        },
        {
          text: "ไม่��่อยสนใจ",
          onClick: handleNext,
          ariaLabel: "เลือกไม่ค่อยสนใจ"
        },
        {
          text: "ไม่สนใจเลย",
          onClick: handleNext,
          ariaLabel: "เลือกไม่สนใจเลย"
        }
      ]}
    />
  );
};

export default IntroPolicyThoughtsPage;
