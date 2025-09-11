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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/0842afec566676b980dab55ae09fcdf365869e23?width=2158"
          alt="Transportation scene"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* White Curved Overlay - positioned at top with bottom curve */}
      <svg
        className="absolute top-0 left-0 w-full z-10"
        viewBox="0 0 1000 577"
        preserveAspectRatio="none"
        style={{ height: '57.7%' }}
        aria-hidden="true"
      >
        <path d="M0,0 L1000,0 L1000,437 C750,517 250,517 0,437 Z" fill="#FFFFFF" />
      </svg>

      {/* Blue Background - bottom half */}
      <div 
        className="absolute bottom-0 left-0 w-full z-10"
        style={{ 
          height: '42.3%',
          background: '#04D9F9'
        }}
      />

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 pt-8 pb-24">
          
          {/* Title Section - positioned in blue area */}
          <div className="text-center mb-8 max-w-4xl mt-auto">
            <h1 
              className="font-prompt font-bold text-center leading-normal mb-8"
              style={{ 
                color: '#000000',
                fontSize: 'clamp(24px, 5.6vw, 60px)',
                lineHeight: '1.2'
              }}
            >
              ตอนนี้มีข้อมูลที่ขัดแย้งกันของนโยบาย<br />
              เช่น บ้างก็บอกว่าเก็บ 20 บ้างก็ 80<br />
              บ้างก็บอกไปว่าไม่เก็บรถ 4 ที่นั่ง<br />
              บ้างก็เก็บหมดคุณคิดว่าจะทำอย่างไร
            </h1>
          </div>

          {/* Button Section */}
          <div className="w-full max-w-[874px] space-y-6">
            {/* Button 1 */}
            <button
              onClick={() => handleAction("ignore")}
              className="w-full h-[118px] rounded-[50px] border transition-all duration-200 bg-[#FFE000] border-black hover:bg-black hover:scale-105 group flex items-center justify-center"
            >
              <span 
                className="font-prompt font-normal text-black group-hover:text-[#FFE000] text-center"
                style={{ 
                  fontSize: 'clamp(20px, 4.6vw, 50px)',
                  letterSpacing: '0.4px'
                }}
              >
                ไม่ทำอะไร ถึงเวลาก็รู้เอง
              </span>
            </button>

            {/* Button 2 */}
            <button
              onClick={() => handleAction("search")}
              className="w-full h-[118px] rounded-[50px] border transition-all duration-200 bg-[#FFE000] border-black hover:bg-black hover:scale-105 group flex items-center justify-center"
            >
              <span 
                className="font-prompt font-normal text-black group-hover:text-[#FFE000] text-center"
                style={{ 
                  fontSize: 'clamp(20px, 4.6vw, 50px)',
                  letterSpacing: '0.4px'
                }}
              >
                หาข่าวต่อ
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeNewsTest;
