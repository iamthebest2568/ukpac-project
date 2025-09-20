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
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fd9c1a6911df5490f8357c04f8c6ab1d8?format=webp&width=800"
      title="ตอนนี้มีข้อมูลที่ขัดแย้งกันของนโยบาย
เช่น บ้างก็บอกว่าเก็บ 20 บ้างก็ 80 บ���างก็บอกไปว่าไม่เก็บรถ 4 ที่นั่ง บ้างก็เก็บหมดคุณคิดว่าจะทำอย่างไร"
      buttons={buttons}
      className="fake-news-page"
      imageLoading="eager"
    />
  );
};

export default FakeNewsTest;
