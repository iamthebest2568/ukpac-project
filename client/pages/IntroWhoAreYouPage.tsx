import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroWhoAreYouPage = () => {
  const { navigateToPage } = useSession();

  const handleNext = () => {
    navigateToPage("/intro-gender");
  };

  const handleBack = () => {
    navigateToPage("/intro-start");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/o/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faf32686a3c3d417994a2e2311560fea3?alt=media&token=cd0a67ee-b882-4eaa-a103-6640da4da97e&apiKey=0eb7afe56fd645b8b4ca090471cef081"
      backgroundAlt="Who are you background"
      isVideo={true}
      title="คุณเป็นใคร?"
      buttons={[
        {
          text: "นักเรียน/นักศึกษา",
          onClick: handleNext,
          ariaLabel: "เลือกนักเรียน/นักศึกษา"
        },
        {
          text: "พนักงาน",
          onClick: handleNext,
          ariaLabel: "เลือกพนักงาน"
        },
        {
          text: "อื่นๆ",
          onClick: handleNext,
          ariaLabel: "เลือกอื่นๆ"
        }
      ]}
    />
  );
};

export default IntroWhoAreYouPage;
