import { logEvent } from '../../services/dataLogger.js';
import FigmaStyle1Layout from '../layouts/FigmaStyle1Layout';

interface FakeNewsTestProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const FakeNewsTest = ({ sessionID, onNavigate }: FakeNewsTestProps) => {
  const handleAction = (action: 'search' | 'ignore') => {
    const data = { action };

    // Log the fake news interaction
    logEvent({
      event: 'FAKENEWS_CHOICE',
      payload: {
        choice: action,
        scenario: 'ข่าวเรื่องการเปลี่ยนแปลงค่าโดยสาร',
        sessionID
      }
    });

    if (action === 'search') {
      // Navigate to source selection for the 'Agree' journey
      onNavigate('sourceSelection', data);
    } else {
      // Navigate directly to Flow_EndSequence (reward decision flow)
      onNavigate('Flow_EndSequence', data);
    }
  };

  const handleReplay = () => {
    // Replay functionality - could be used to replay audio/video content
    logEvent({
      event: 'FAKENEWS_REPLAY',
      payload: {
        sessionID,
      },
    });
  };

  // Define buttons for the FigmaStyle1Layout
  const buttons = [
    {
      text: "ไม่ทำอะไร ถึงเวลาก็รู้เอง",
      onClick: () => handleAction('ignore'),
      ariaLabel: "เลือกที่จะไม่ดำเนินการใดๆ และรอดูผลลัพธ์"
    },
    {
      text: "หาข่าวต่อ",
      onClick: () => handleAction('search'),
      ariaLabel: "เลือกที่จะหาข้อมูลเพิ่มเติมเพื่อตรวจสอบความถูกต้อง"
    }
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
      backgroundAlt="รถไฟในเมืองยามค่ำคืน"
      title={`ตอนนี้มีข้อมูลที่ขัดแย้งกัน
ของนโยบาย เช่นบ้างก็
บอกว่าเก็บ 20 บ้างก็ 80
บ้างก็บอกไปว่า ไม่เก็บ
รถ 4 ที่นั่ง บ้างก็เก็บหมด
คุณคิดว่าจะทำอย่างไร`}
      buttons={buttons}
      replayButton={{
        onClick: handleReplay,
        ariaLabel: "ดูอีกครั้ง"
      }}
    />
  );
};

export default FakeNewsTest;
