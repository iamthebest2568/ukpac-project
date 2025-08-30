import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroTravelModeCityPage = () => {
  const { navigateToPage } = useSession();

  const handleChoice = (choice: string) => {
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/intro-travel-freq-city");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality
    console.log("Replay clicked");
  };

  const buttons = [
    {
      text: "รถไฟฟ้า BTS / MRT",
      onClick: () => handleChoice("รถไฟฟ้า BTS / MRT"),
      ariaLabel: "เลือกรถไฟฟ้า BTS / MRT"
    },
    {
      text: "อยู่ในพื้นที่ไม่ต้องเข้าเ���ือง",
      onClick: () => handleChoice("อยู่ในพื้นที่ไม่ต้องเข้าเมือง"),
      ariaLabel: "เลือกอยู่ในพื้นที่ไม่ต้องเข้าเมือง"
    },
    {
      text: "รถยนต์",
      onClick: () => handleChoice("รถยนต์"),
      ariaLabel: "เลือกรถยนต์"
    },
    {
      text: "รถ รับ-ส่ง",
      onClick: () => handleChoice("รถ รับ-ส่ง"),
      ariaLabel: "เลือกรถ รับ-ส่ง"
    },
    {
      text: "รถประจำทาง",
      onClick: () => handleChoice("รถประจำทาง"),
      ariaLabel: "เลือกรถประจำทาง"
    }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="/placeholder.svg"
      backgroundAlt="Travel mode background"
      title="คุณเดินทางเข้าเมือง
ด้วยวิธีไหน"
      buttons={buttons}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง"
      }}
    />
  );
};

export default IntroTravelModeCityPage;
