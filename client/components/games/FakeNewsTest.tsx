import { logEvent } from "../../services/dataLogger.js";
import FigmaStyle1Layout from "../layouts/FigmaStyle1Layout";

interface FakeNewsTestProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const FakeNewsTest = ({ sessionID, onNavigate }: FakeNewsTestProps) => {
  const handleAction = (action: "search" | "ignore") => {
    const data = { action };

    // Log the fake news interaction
    logEvent({
      event: "FAKENEWS_CHOICE",
      payload: {
        choice: action,
        scenario: "ข่าวเรื่องการเปลี่ยนแปลงค่าโดยสาร",
        sessionID,
      },
    });

    if (action === "search") {
      // Navigate to source selection for the 'Agree' journey
      onNavigate("sourceSelection", data);
    } else {
      // Navigate directly to Flow_EndSequence (reward decision flow)
      onNavigate("Flow_EndSequence", data);
    }
  };

  const buttons = [
    {
      text: "ไม่ทำอะไร ถึงเวลาก็รู้เอง",
      onClick: () => handleAction("ignore"),
    },
    {
      text: "หาข่าวต่อ",
      onClick: () => handleAction("search"),
    },
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/1ca30c44dc55682aa7c0c1273799b2f3f61b5c99?width=2160"
      title="ตอนนี้มีข้อมูลที่ขัดแย้งกันของนโยบาย
เช่น บ้างก็บอกว่าเก็บ 20 บ้างก็ 80 บ้างก็บอกไปว่าไม่เก็บรถ 4 ที่นั่ง บ้างก็เก็บหมดคุณคิดว่าจะทำอย่างไร"
      buttons={buttons}
      className="fake-news-page"
      imageLoading="eager"
    />
  );
};

export default FakeNewsTest;
