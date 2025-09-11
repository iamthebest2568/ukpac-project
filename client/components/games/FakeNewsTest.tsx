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
      className="relative w-full flex flex-col justify-center items-center"
      style={{
        width: '100%',
        maxWidth: 1080,
        aspectRatio: '1080 / 1920',
        background: '#04D9F9',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Main content container matching Figma positioning (percent-based for responsiveness) */}
      <div className="absolute w-full flex flex-col items-center" style={{ top: '60.9375%', height: '18.958333%' }}>
        {/* Title text - scales with container */}
        <div
          className="text-center mb-8"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <h1
            className="font-prompt text-center leading-normal"
            style={{
              color: '#000000',
              fontSize: 'clamp(20px, 4.5vw, 60px)',
              fontWeight: 600,
              lineHeight: '1.05',
              width: '90%'
            }}
          >
            ตอนนี้มีข้อมูลที่ขัดแย้งกันของนโยบาย<br />
            เช่น บ้างก็บอกว่าเก็บ 20 บ้างก็ 80<br />
            บ้างก็บอกไปว่าไม่เก็บรถ 4 ที่นั่ง<br />
            บ้างก็เก็บหมดคุณคิดว่าจะทำอย่างไร
          </h1>
        </div>
      </div>

      {/* Button container - positioned with percentages relative to 1080x1920 baseline */}
      <div
        className="absolute flex flex-col"
        style={{
          width: '80.925925%', /* 874 / 1080 */
          height: '13.854166%', /* 266 / 1920 */
          left: '9.537037%', /* 103 / 1080 */
          top: '83.020833%', /* 1594 / 1920 */
          gap: '1.5625%'
        }}
      >
        {/* Button 1: ไม่ทำอะไร ถึงเวลาก็รู้เอง */}
        <div className="relative" style={{ width: '100%', height: '44.3609%' }}>
          <button
            onClick={() => handleAction("ignore")}
            className="absolute transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center"
            style={{
              width: '100%',
              height: '100%',
              left: '0%',
              top: '0%',
              borderRadius: '4.6296rem', /* approx 50px at 1080px width */
              background: '#FFE000',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span
              className="font-prompt text-center"
              style={{
                color: '#000000',
                fontSize: 'clamp(18px, 3.8vw, 50px)',
                fontWeight: 400,
                letterSpacing: '0.4px',
                lineHeight: '1'
              }}
            >
              ไม่ทำอะไร ถึงเวลาก็รู้เอง
            </span>
          </button>
        </div>

        {/* Button 2: หาข่าวต่อ */}
        <div className="relative" style={{ width: '100%', height: '44.3609%' }}>
          <button
            onClick={() => handleAction("search")}
            className="absolute transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center"
            style={{
              width: '100%',
              height: '100%',
              left: '0%',
              top: '0%',
              borderRadius: '4.6296rem',
              background: '#FFE000',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span
              className="font-prompt text-center"
              style={{
                color: '#000000',
                fontSize: 'clamp(18px, 3.8vw, 50px)',
                fontWeight: 400,
                letterSpacing: '0.4px',
                lineHeight: '1'
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
