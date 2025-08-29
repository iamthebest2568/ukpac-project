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
      backgroundImage="" // Will be replaced with video background
      backgroundAlt="Who are you background"
      title="คุณเ��็นใคร?"
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
