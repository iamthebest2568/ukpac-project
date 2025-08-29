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
      backgroundImage="" // Will be replaced with video background
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
          ariaLabel: "เลือกเดือนละไม่กี่���รั้ง"
        }
      ]}
    />
  );
};

export default IntroTravelFreqCityPage;
