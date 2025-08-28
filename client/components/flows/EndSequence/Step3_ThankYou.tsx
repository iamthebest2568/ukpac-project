/**
 * UK PACK - End Sequence Step 3: Thank You
 * Moved from FinalThankYou component
 */

import { logEvent } from '../../../services/dataLogger.js';

interface Step3_ThankYouProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
}

const Step3_ThankYou = ({ sessionID, onNext, onBack, journeyData }: Step3_ThankYouProps) => {
  const handleShare = () => {
    // Log the share action
    logEvent({
      event: 'FINAL_SHARE_CLICKED',
      payload: {
        action: 'shared',
        sessionID
      }
    });

    onNext({ action: 'shared', completedAt: new Date().toISOString() });
  };

  const handleFinish = () => {
    // Log the finish game action
    logEvent({
      event: 'FINAL_FINISH_CLICKED',
      payload: {
        action: 'finished',
        sessionID
      }
    });

    onNext({ action: 'finished', completedAt: new Date().toISOString() });
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="ขอบคุณสำหรับการมีส่วนร่วม"
            className="w-full h-full object-cover object-center"
            style={{ minWidth: "100%", aspectRatio: "2/3" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 44.17%)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-end items-center px-6 md:px-8 pb-8 md:pb-12">
            
            {/* Celebration Panel */}
            <div className="w-full max-w-[325px] mb-8">
              <div className="bg-white bg-opacity-90 rounded-[20px] p-6 border-[1.5px] border-black relative overflow-hidden">
                {/* Celebration elements */}
                <div className="text-center">
                  <div className="text-6xl mb-3" role="img" aria-label="ขอบคุณ">🎉</div>
                  <div className="font-kanit text-2xl font-medium text-black mb-2">ขอบคุณมากครับ!</div>
                  <div className="font-prompt text-base text-gray-600">การมีส่วนร่วมของคุณมีความหมายมาก</div>
                </div>

                {/* Decorative celebration elements */}
                <div className="absolute top-3 left-3 text-xl animate-bounce" role="img" aria-label="ดาว">⭐</div>
                <div className="absolute top-4 right-4 text-lg animate-pulse" role="img" aria-label="หัวใจ">💖</div>
                <div className="absolute bottom-3 left-4 text-base animate-bounce" role="img" aria-label="ดาว">🌟</div>
                <div className="absolute bottom-3 right-3 text-xl animate-pulse" role="img" aria-label="เพชร">💎</div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6 md:mb-8 max-w-[325px]">
              <h1
                className="text-white text-center font-kanit text-3xl font-normal leading-normal mb-4"
                style={{ fontSize: "clamp(24px, 7.5vw, 30px)" }}
              >
                ขอบคุณที่ร่วมกิจกรรม เราจะประกาศรายชื่อผู้โชคดีวันที่ XXXXXX
              </h1>
            </div>

            {/* Action buttons */}
            <div className="w-full max-w-[325px] space-y-4">
              <button
                onClick={handleShare}
                className="w-full h-[53px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
              >
                <span className="mr-2 text-lg" role="img" aria-label="แชร์">📤</span>
                <span className="text-black text-center font-prompt text-lg font-medium leading-7 tracking-[0.4px] group-hover:text-[#EFBA31] group-active:text-[#EFBA31]">
                  แชร์เกมนี้ให้เพื่อน
                </span>
              </button>
              
              <button
                onClick={handleFinish}
                className="w-full h-[53px] rounded-[40px] bg-white border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
              >
                <span className="text-black text-center font-prompt text-lg font-medium leading-7 tracking-[0.4px] group-hover:text-white group-active:text-white">
                  จบเกม
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3_ThankYou;
