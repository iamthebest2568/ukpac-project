/**
 * UK PACK - End Sequence Step 1: Reward Decision
 * Moved from RewardDecision component
 */

import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout";

interface Step1_DecisionProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
}

const Step1_Decision = ({
  sessionID,
  onNext,
  onBack,
  initialData,
}: Step1_DecisionProps) => {
  const handleChoice = (choice: "participate" | "decline") => {
    const choiceText = {
      participate: "ลุ้นรับรางวัล",
      decline: "ไม่",
    }[choice];

    // Log the reward decision
    logEvent({
      event: "REWARD_DECISION",
      payload: {
        choice,
        choiceText,
        sessionID,
      },
    });

    const data = { rewardDecision: { choice, choiceText } };
    onNext(data);
  };

  // Define buttons for the FigmaStyle1Layout
  // Track to server
  const trackDecision = (
    choice: "participate" | "decline",
    choiceText: string,
  ) => {
    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "ENDSEQ_DECISION",
        payload: { choice, choiceText },
      };
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
  };

  const buttons = [
    {
      text: "ลุ้นรับรางวัล",
      onClick: () => {
        trackDecision("participate", "ลุ้นรับรางวัล");
        handleChoice("participate");
      },
      ariaLabel: "เข้าร่วมโครงการและกรอกข้อมูลเพื่อรับรางวัล",
    },
    {
      text: "ไม่",
      onClick: () => {
        trackDecision("decline", "ไม่");
        handleChoice("decline");
      },
      ariaLabel: "ไม่เข้าร่วมโครงการรับรางวัล",
    },
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Feb2f14480a1349a6bc6b76594e26c7b5?format=webp&width=2160"
      backgroundAlt="รางวัลสำหรับคุณ"
      className="source-selection-page end-sequence-page"
      imageLoading="eager"
    >
      {/* Custom content with separated title sections matching Figma */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ paddingTop: '4%', paddingBottom: '20%' }}>
        {/* Main thank you message */}
        <div className="text-center mb-8" style={{ width: '100%' }}>
          <h1
            className="font-prompt text-center leading-normal"
            style={{
              color: '#000D59',
              fontSize: 'clamp(24px, 5.5vw, 70px)',
              fontWeight: 700,
              lineHeight: '1.2',
              marginBottom: '2rem'
            }}
          >
            ขอบคุณที่ร่วมเป็นส่วนหนึ่ง<br />
            ในการพัฒนาเมือง
          </h1>

          {/* Question about reward */}
          <h2
            className="font-prompt text-center leading-normal"
            style={{
              color: '#000D59',
              fontSize: 'clamp(20px, 4.6vw, 50px)',
              fontWeight: 700,
              lineHeight: '1.2'
            }}
          >
            คุณอยากกรอกข้อมูลเพิ่มเพื่อลุ้นรับรางวัล<br />
            บัตรขนส่งสาธารณะ 300 บาท หรือไม่
          </h2>
        </div>
      </div>

      {/* Buttons at bottom */}
      <div className="w-full flex flex-col items-center gap-4" style={{ paddingBottom: '8.9%' }}>
        <div className="relative flex justify-center" style={{ width: '78.2%', maxWidth: '845px' }}>
          <button
            onClick={buttons[0].onClick}
            className="w-full rounded-[50px] flex items-center justify-center transition-all duration-200 bg-[#FFE000] hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
            style={{
              height: 'clamp(50px, 6.1vw, 118px)',
              minHeight: '50px',
              marginBottom: '1.5rem'
            }}
          >
            <span
              className="font-prompt text-center text-black group-hover:text-[#FFE000] group-active:text-[#FFE000]"
              style={{
                fontSize: 'clamp(18px, 4.6vw, 50px)',
                fontWeight: 400,
                letterSpacing: '0.4px',
                lineHeight: 'normal'
              }}
            >
              {buttons[0].text}
            </span>
          </button>
        </div>

        <div className="relative flex justify-center" style={{ width: '78.2%', maxWidth: '845px' }}>
          <button
            onClick={buttons[1].onClick}
            className="w-full rounded-[50px] flex items-center justify-center transition-all duration-200 bg-[#FFE000] hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
            style={{
              height: 'clamp(50px, 6.1vw, 118px)',
              minHeight: '50px'
            }}
          >
            <span
              className="font-prompt text-center text-black group-hover:text-[#FFE000] group-active:text-[#FFE000]"
              style={{
                fontSize: 'clamp(18px, 4.6vw, 50px)',
                fontWeight: 400,
                letterSpacing: '0.4px',
                lineHeight: 'normal'
              }}
            >
              {buttons[1].text}
            </span>
          </button>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step1_Decision;
