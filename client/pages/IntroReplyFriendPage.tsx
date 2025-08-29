import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroReplyFriendPage = () => {
  const { navigateToPage } = useSession();

  const handleNext = () => {
    navigateToPage("/intro-policy-feel");
  };

  const handleBack = () => {
    navigateToPage("/intro-policy-thoughts");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="" // Will be replaced with video background
      backgroundAlt="Reply friend background"
      title="เพื่อนถามคุณเรื่องนโยบาย คุณจะตอบยังไง?"
      buttons={[
        {
          text: "ตอบได้เลย",
          onClick: handleNext,
          ariaLabel: "เลือกตอบได้เลย"
        },
        {
          text: "ตอบได้บ้าง",
          onClick: handleNext,
          ariaLabel: "เลือกตอบได้บ้าง"
        },
        {
          text: "ตอบยาก",
          onClick: handleNext,
          ariaLabel: "เลือกตอบยาก"
        },
        {
          text: "ไม่อยากตอบ",
          onClick: handleNext,
          ariaLabel: "เลือกไม่อยากตอบ"
        }
      ]}
    />
  );
};

export default IntroReplyFriendPage;
