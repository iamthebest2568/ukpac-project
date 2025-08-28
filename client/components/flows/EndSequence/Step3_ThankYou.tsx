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
              background: "rgba(0, 0, 0, 0.90)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-center items-center px-8">
            {/* Content Container */}
            <div className="w-full max-w-[325px]">
              {/* Title */}
              <div className="text-center mb-40">
                <h1
                  className="text-white text-center font-kanit text-[30px] font-normal leading-normal"
                >
                  ขอบคุณที่ร่วมเป็นส่วนหนึ่ง<br />
                  ในการพัฒนาเมือง<br /><br />
                  เราจะประกาศรางวัลทาง<br />
                  xxxxxxxxxxxxxxxxxx<br />
                  วันที่ xxxx xxxxx xxxx
                </h1>
              </div>

              {/* Action buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleShare}
                  className="figma-style1-button"
                  aria-describedby="share-button-description"
                >
                  <span className="figma-style1-button-text" id="share-button-description">
                    แชร์เกมนี้ให้เพื่อน
                  </span>
                </button>
                
                <button
                  onClick={handleFinish}
                  className="figma-style1-button--secondary"
                >
                  <span className="figma-style1-button-text">
                    จบเกม
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3_ThankYou;
