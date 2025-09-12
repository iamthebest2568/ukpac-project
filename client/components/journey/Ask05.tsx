/**
 * Ask05 - Policy Suggestion Page
 * Updated to match Figma design with FigmaStyle1Layout
 */

import { useState, useEffect } from "react";
import { logEvent } from "../../services/dataLogger.js";
import FigmaStyle1Layout from "../layouts/FigmaStyle1Layout";

interface Ask05Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData?: any;
}

const Ask05 = ({ sessionID, onNavigate, journeyData }: Ask05Props) => {
  const [suggestion, setSuggestion] = useState("");

  const handleContinue = () => {
    const data = {
      suggestion: suggestion.trim(),
      type: "policy_suggestion_feedback",
    };

    // Log the policy suggestion
    logEvent({
      event: "POLICY_SUGGESTION_SUBMITTED",
      payload: {
        suggestion: suggestion.trim(),
        suggestionLength: suggestion.trim().length,
        sessionID,
      },
    });

    // Also track to server
    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "ASK05_COMMENT",
        payload: { comment: suggestion.trim() },
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
    // Navigate to the next step
    onNavigate("fakeNews", data);
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Feb2f14480a1349a6bc6b76594e26c7b5?format=webp&width=2160"
      title="คุณคิดว่ารัฐควรทำอะไรที่จะทำให้นโยบายนี้เกิดขึ้นได้และเป็นประโยชน์ต่อประชาชนอย่างแท้จริง"
      className="source-selection-page ask05-page"
      imageLoading="eager"
    >
      {/* Content matching Figma design */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ paddingTop: '4%', paddingBottom: '20%' }}>
        {/* Text Input Box */}
        <div
          className="relative bg-white rounded-[20px] border-[5px] flex items-start justify-center p-6"
          style={{
            borderColor: '#000D59',
            width: '82.4%', // 890/1080
            height: '40.625%', // 780/1920
            maxWidth: '890px',
            maxHeight: '780px'
          }}
        >
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="พิมพ์ข้อความของคุณที่นี่..."
            className="w-full h-full bg-transparent border-none outline-none resize-none font-prompt text-center placeholder-gray-500"
            style={{
              fontSize: 'clamp(16px, 3.7vw, 40px)',
              fontWeight: 300,
              color: 'rgba(0, 0, 0, 0.7)',
              lineHeight: '1.2'
            }}
            rows={8}
          />
        </div>
      </div>

      {/* Button at bottom */}
      <div className="w-full flex justify-center items-end" style={{ paddingBottom: '8.9%' }}>
        <div className="relative flex justify-center" style={{ width: '78.2%', maxWidth: '845px' }}>
          <button
            onClick={handleContinue}
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
              ไปต่อ
            </span>
          </button>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Ask05;
