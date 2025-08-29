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
      backgroundImage="https://cdn.builder.io/o/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faf32686a3c3d417994a2e2311560fea3?alt=media&token=cd0a67ee-b882-4eaa-a103-6640da4da97e&apiKey=0eb7afe56fd645b8b4ca090471cef081"
      backgroundAlt="Reply friend background"
      title="เพื่อนถามคุณเรื่องนโยบาย คุณจะตอบยังไง?"
      buttons={[
        {
          text: "ตอบได้���ลย",
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
