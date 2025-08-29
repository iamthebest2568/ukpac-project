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
      backgroundImage="https://cdn.builder.io/o/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faf32686a3c3d417994a2e2311560fea3?alt=media&token=cd0a67ee-b882-4eaa-a103-6640da4da97e&apiKey=0eb7afe56fd645b8b4ca090471cef081"
      backgroundAlt="Travel mode background"
      title="��ุณใช้การเดินทางแบบไหนในเมือง?"
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
