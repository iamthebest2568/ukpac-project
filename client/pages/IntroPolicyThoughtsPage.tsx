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
      backgroundImage="https://cdn.builder.io/o/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faf32686a3c3d417994a2e2311560fea3?alt=media&token=cd0a67ee-b882-4eaa-a103-6640da4da97e&apiKey=0eb7afe56fd645b8b4ca090471cef081"
      backgroundAlt="Policy thoughts background"
      isVideo={true}
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
          text: "ไม่ค่อยสนใจ",
          onClick: handleNext,
          ariaLabel: "เลือกไม่���่อยสนใจ"
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
