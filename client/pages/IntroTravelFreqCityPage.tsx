import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroTravelFreqCityPage = () => {
  const { navigateToPage } = useSession();

  const handleNext = () => {
    navigateToPage("/intro-policy-thoughts");
  };

  const handleBack = () => {
    navigateToPage("/intro-travel-mode-city");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/o/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faf32686a3c3d417994a2e2311560fea3?alt=media&token=cd0a67ee-b882-4eaa-a103-6640da4da97e&apiKey=0eb7afe56fd645b8b4ca090471cef081"
      backgroundAlt="Travel frequency background"
      title="คุณเดินทางในเมืองบ่อยแค่ไหน?"
      buttons={[
        {
          text: "ทุกวัน",
          onClick: handleNext,
          ariaLabel: "เลือกทุกวัน"
        },
        {
          text: "สัปดาห์ละ 3-5 วัน",
          onClick: handleNext,
          ariaLabel: "เลือกสัปดาห์ละ 3-5 วัน"
        },
        {
          text: "สัปดาห์ละ 1-2 วัน",
          onClick: handleNext,
          ariaLabel: "เลือกสัปดาห์ละ 1-2 วัน"
        },
        {
          text: "เดือนละไม่กี่ครั้ง",
          onClick: handleNext,
          ariaLabel: "เลือกเดือนละไม่กี่ครั้ง"
        }
      ]}
    />
  );
};

export default IntroTravelFreqCityPage;
