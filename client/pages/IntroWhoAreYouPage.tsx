import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

const IntroWhoAreYouPage = () => {
  const { navigateToPage } = useSession();

  const handleChoice = (choice: string) => {
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/intro-gender");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality - could replay video or audio content
    console.log("Replay clicked");
  };

  const buttons = [
    {
      text: "ผู้ที่ต้องเข้ามาทำงาน",
      onClick: () => handleChoice("ผู้ที่ต้องเข้ามาทำงาน"),
      ariaLabel: "เลือกผู้ที่ต้องเข้ามาทำงาน"
    },
    {
      text: "ผู้อยู่อาศัยในพื้นที่",
      onClick: () => handleChoice("ผู้อยู่อาศัยในพื้นที่"),
      ariaLabel: "เลือกผู้อยู่อาศัยในพื้นที่"
    },
    {
      text: "นักศึกษาที่เข้ามาเรียนในพื้นที่",
      onClick: () => handleChoice("นักศึกษาที่เข้ามาเรียนในพื้นที่"),
      ariaLabel: "เลือกนักศึกษาที่เข้ามาเรียนในพื้นที่"
    },
    {
      text: "ผู้ประกอบการที่มาขายของในพื้นที่",
      onClick: () => handleChoice("ผู้ประกอบการที่มาขายของในพื้นที่"),
      ariaLabel: "เลือกผู้ประกอบการที่มาขายของในพื้นที่"
    },
    {
      text: "ผู้ปกครองที่เข้ามาส่งลูกในพื้นที่",
      onClick: () => handleChoice("ผู้ปกครองที่เข้ามาส่งลูกในพื้นที่"),
      ariaLabel: "เลือกผู้ปกครอ��ที่เข้ามาส่งลูกในพื้นที่"
    },
    {
      text: "ผู้เข้ามาช๊อปปิ้ง กินข้าว",
      onClick: () => handleChoice("ผู้เข้ามาช๊อปปิ้ง กินข้าว"),
      ariaLabel: "เลือกผู้เข้ามาช๊อปปิ้ง กินข้าว"
    }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/o/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faf32686a3c3d417994a2e2311560fea3?alt=media&token=cd0a67ee-b882-4eaa-a103-6640da4da97e&apiKey=0eb7afe56fd645b8b4ca090471cef081"
      backgroundAlt="Who are you background"
      title="คุณเป็นใครเป็นในมหานครนี้"
      buttons={buttons}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง"
      }}
    />
  );
};

export default IntroWhoAreYouPage;
