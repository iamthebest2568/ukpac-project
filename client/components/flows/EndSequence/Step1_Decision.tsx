/*
 * UK PACK - End Sequence Step 1: Reward Decision
 * Standardized layout to match other pages (no absolute positioning)
 */

import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout.ukpack1";

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

  const onParticipate = () => {
    trackDecision("participate", "ลุ้นรับรางวัล");
    handleChoice("participate");
  };

  const onDecline = () => {
    trackDecision("decline", "ไม่");
    handleChoice("decline");
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F263a25a7969444fca1a6d9586554800e?format=webp&width=800"
      backgroundAlt="รางวัลสำหรับคุณ"
      className="source-selection-page end-sequence-page fake-news-page"
      imageLoading="eager"
    >
      <div
        className="w-full max-w-[980px] mx-auto px-4 py-8 text-center"
        style={{
          paddingTop:
            "calc(clamp(157px, 33vh, 285px) - clamp(28px, 6.5vw, 70px))",
          color: "#000D59",
        }}
      >
        <h1
          className="font-prompt"
          style={{ color: "#000D59", fontWeight: 700, lineHeight: "1" }}
        >
          <span
            style={{
              display: "block",
              fontSize: "clamp(28px, 6.5vw, 70px)",
              lineHeight: 1,
            }}
          >
            <span style={{ fontWeight: 700 }}>ขอบคุณ</span>
            <span
              style={{
                fontWeight: 400,
                fontSize: "clamp(24px, 5.6vw, 60px)",
                marginLeft: "8px",
              }}
            >
              ที่ร่วมเป็นส่วนหนึ่ง
            </span>
          </span>

          <span
            style={{
              display: "block",
              fontSize: "clamp(24px, 5.6vw, 60px)",
              fontWeight: 400,
            }}
          >
            ในการพัฒนาเมือง
          </span>
        </h1>

        <h2
          className="font-prompt mt-6"
          style={{
            color: "#000D59",
            fontSize: "18px",
            fontWeight: 700,
          }}
        >
          คุณอยากกรอกข้อมูลเพิ่มเพื่อลุ้นรับรางวัล
          <br />
          บัตรขนส่งสาธารณะ 300 บาท หรือไม่
        </h2>

        <div
          className="mt-4 flex flex-col items-center gap-4"
          style={{ width: "100%", maxWidth: 874, margin: "0 auto" }}
        >
          <button
            onClick={onParticipate}
            className="btn-large"
            aria-label="เข้าร่วมโครงการและกรอกข้อมูลเพื่อรับรางวัล"
          >
            ลุ้นรับรางวัล
          </button>
          <button
            onClick={onDecline}
            className="btn-large"
            aria-label="ไม่เข้าร่วมโครงการรับรางวัล"
          >
            ไม่
          </button>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step1_Decision;
