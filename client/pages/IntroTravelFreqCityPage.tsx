import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroTravelFreqCityPage = () => {
  const { navigateToPage } = useSession();

  const handleChoice = (choice: string) => {
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/intro-policy-thoughts");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality - could replay video or audio content
    console.log("Replay clicked");
  };

  const buttons = [
    {
      text: "ทุกวัน",
      onClick: () => handleChoice("ทุกวัน"),
      ariaLabel: "เลือกทุกวัน"
    },
    {
      text: "ทุกวันธรรมดา",
      onClick: () => handleChoice("ทุกวันธรรมดา"),
      ariaLabel: "เลือกทุกวันธรรมดา"
    },
    {
      text: "สัปดาห์ละครั้ง",
      onClick: () => handleChoice("สัปดาห์ละครั้ง"),
      ariaLabel: "เลือกสัปดาห์ละครั้ง"
    },
    {
      text: "เดือนละครั้ง",
      onClick: () => handleChoice("เดือนละครั้ง"),
      ariaLabel: "เลือกเดือนละครั้ง"
    },
    {
      text: "ไม่ค่อยเข้าเมือง",
      onClick: () => handleChoice("ไม่ค่อยเข้าเมือง"),
      ariaLabel: "เลือกไม่ค่อยเข้าเมือ���"
    }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="/placeholder.svg"
      backgroundAlt="Travel frequency background"
      isVideo={false}
      title="คุณเดินทางเข้าเมือง
บ่อยแค่ไหน"
      buttons={buttons}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง"
      }}
    />
  );
};

export default IntroTravelFreqCityPage;
