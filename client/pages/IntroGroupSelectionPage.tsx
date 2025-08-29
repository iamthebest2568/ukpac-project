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
      backgroundImage="https://cdn.builder.io/o/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faf32686a3c3d417994a2e2311560fea3?alt=media&token=cd0a67ee-b882-4eaa-a103-6640da4da97e&apiKey=0eb7afe56fd645b8b4ca090471cef081"
      backgroundAlt="Group selection background"
      title="คุณอยู่ในกลุ่มอายุไหน?"
      buttons={[
        {
          text: "18-25 ���ี",
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
