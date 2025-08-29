import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroStartPage = () => {
  const { navigateToPage } = useSession();

  const handleStart = () => {
    navigateToPage("/intro-who-are-you");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/o/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faf32686a3c3d417994a2e2311560fea3?alt=media&token=cd0a67ee-b882-4eaa-a103-6640da4da97e&apiKey=0eb7afe56fd645b8b4ca090471cef081"
      backgroundAlt="Intro background"
      isVideo={true}
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
