import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";
import { useEffect } from "react";

const IntroWhoAreYouPage = () => {
  const { navigateToPage } = useSession();

  // Prefetch next screen chunk for smoother transition
  useEffect(() => {
    import("./Uk-stornaway").catch(() => {});
  }, []);

  const handleChoice = (choice: string) => {
    // Fire tracking event
    const label = choice;
    const body = {
      sessionId: sessionStorage.getItem("ukPackSessionID") || "",
      event: "INTRO_WHO_CHOICE",
      payload: { choiceText: label },
    };
    try {
      navigator.sendBeacon?.(
        "/api/track",
        new Blob([JSON.stringify(body)], { type: "application/json" }),
      ) ||
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
    } catch {}
    // Add a small delay to show selection before navigating
    setTimeout(() => {
      navigateToPage("/uk-stornaway");
    }, 300);
  };

  const handleReplay = () => {
    // Replay functionality
    console.log("Replay clicked");
  };

  const buttons = [
    {
      text: "ผู้ที่ต้องเข้ามาทำงาน",
      onClick: () => handleChoice("ผู้ที่ต้องเข้ามาทำงาน"),
      ariaLabel: "เลือกผู้ที่ต้องเข้ามาทำงาน",
    },
    {
      text: "ผู้อยู่อาศัยในพื้นที่",
      onClick: () => handleChoice("ผู้อยู่อาศัยในพื้นที่"),
      ariaLabel: "เลือกผู้อยู่อาศัยในพื้นที่",
    },
    {
      text: "นักศึกษาที่เข้ามาเรียนในพื้นที่",
      onClick: () => handleChoice("นักศึกษาที่เข้ามาเรียนในพื้นที่"),
      ariaLabel: "เลือกนักศึกษาที่เข้ามาเรียนในพื้นที่",
    },
    {
      text: "ผู้ประกอบการที่มาขายของในพื้นที่",
      onClick: () => handleChoice("ผู้ประกอบการที่มาขายของในพื้นที่"),
      ariaLabel: "เลือกผู้ประกอบการที่มาขายของในพื้นที่",
    },
    {
      text: "ผู้ปกครองที่เข้ามาส่งลูกในพื้นที่",
      onClick: () => handleChoice("ผู้ปกครองที่เข้ามาส่งลูกในพื้นที่"),
      ariaLabel: "เลือกผู้ปกครองที่เข้ามาส่งลูกในพื้นที่",
    },
    {
      text: "ผู้เข้ามาช๊อปปิ้ง กินข้าว",
      onClick: () => handleChoice("ผู้เข้ามาช๊อปปิ้ง กินข้าว"),
      ariaLabel: "เลือกผู้เข้ามาช๊อปปิ้ง กินข้าว",
    },
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="/placeholder.svg"
      backgroundAlt="Who are you background"
      title="คุณเป็นใครเป็นในมหานครนี้"
      buttons={buttons}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง",
      }}
    />
  );
};

export default IntroWhoAreYouPage;
