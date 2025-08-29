import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroTravelModeCityPage = () => {
  const { navigateToPage } = useSession();

  const handleNext = () => {
    navigateToPage("/intro-travel-freq-city");
  };

  const handleBack = () => {
    navigateToPage("/intro-group-selection");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="" // Will be replaced with video background
      backgroundAlt="Travel mode background"
      title="คุณใช้การเดินทางแบบไหนในเมือง?"
      buttons={[
        {
          text: "รถไฟฟ้า",
          onClick: handleNext,
          ariaLabel: "เลือกรถไฟฟ้า"
        },
        {
          text: "รถเมล์",
          onClick: handleNext,
          ariaLabel: "เลือกรถเมล์"
        },
        {
          text: "รถยนต์ส่วนตัว",
          onClick: handleNext,
          ariaLabel: "เลือกรถยนต์ส่วนตัว"
        },
        {
          text: "จักรยานยนต์",
          onClick: handleNext,
          ariaLabel: "เลือกจักรยานยนต์"
        }
      ]}
    />
  );
};

export default IntroTravelModeCityPage;
