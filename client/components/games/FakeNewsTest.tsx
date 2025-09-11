import { logEvent } from "../../services/dataLogger.js";

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

  const handleReplay = () => {
    // Replay functionality
    logEvent({
      event: "FAKENEWS_REPLAY",
      payload: {
        sessionID,
      },
    });
  };

  return (
    <div 
      className="relative w-full h-screen flex flex-col justify-center items-center"
      style={{ 
        width: '1080px',
        height: '1920px', 
        background: '#04D9F9'
      }}
    >
      {/* Main content container matching Figma positioning */}
      <div className="absolute w-full flex flex-col items-center" style={{ top: '1170px' }}>
        {/* Title text - exactly matching Figma specs */}
        <div 
          className="text-center mb-8"
          style={{ 
            width: '1080px',
            height: '364px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <h1 
            className="font-prompt text-center leading-normal"
            style={{ 
              color: '#000000',
              fontSize: '60px',
              fontWeight: 600,
              lineHeight: 'normal',
              width: '100%'
            }}
          >
            ตอนนี้มีข้อมูลที่ขัดแย้งกันของนโยบาย<br />
            เช่น บ้างก็บอกว่าเก็บ 20 บ้างก็ 80<br />
            บ้างก็บอกไปว่าไม่เก็บรถ 4 ที่นั่ง<br />
            บ้างก็เก็บหมดคุณคิดว่าจะทำอย่างไร
          </h1>
        </div>
      </div>

      {/* Button container - positioned exactly as in Figma */}
      <div 
        className="absolute flex flex-col"
        style={{ 
          width: '874px',
          height: '266px',
          left: '103px',
          top: '1594px',
          gap: '30px'
        }}
      >
        {/* Button 1: ไม่ทำอะไร ถึงเวลาก็รู้เอง */}
        <div className="relative" style={{ width: '874px', height: '118px' }}>
          <button
            onClick={() => handleAction("ignore")}
            className="absolute transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center"
            style={{
              width: '845px',
              height: '118px',
              left: '14px',
              top: '0px',
              borderRadius: '50px',
              background: '#FFE000',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span 
              className="font-prompt text-center"
              style={{ 
                color: '#000000',
                fontSize: '50px',
                fontWeight: 400,
                letterSpacing: '0.4px',
                lineHeight: 'normal'
              }}
            >
              ไม่ทำอะไร ถึงเวลาก็รู้เอง
            </span>
          </button>
        </div>

        {/* Button 2: หาข่าวต่อ */}
        <div className="relative" style={{ width: '874px', height: '118px' }}>
          <button
            onClick={() => handleAction("search")}
            className="absolute transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center"
            style={{
              width: '845px',
              height: '118px',
              left: '14px',
              top: '0px',
              borderRadius: '50px',
              background: '#FFE000',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span 
              className="font-prompt text-center"
              style={{ 
                color: '#000000',
                fontSize: '50px',
                fontWeight: 400,
                letterSpacing: '0.4px',
                lineHeight: 'normal'
              }}
            >
              หาข่าวต่อ
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FakeNewsTest;
