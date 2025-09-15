/**
 * Ask05 - Policy Suggestion Page
 * Restyled to match the new Figma-style pages while preserving existing content and flow
 */

import { useState, useEffect } from "react";
import { logEvent } from "../../services/dataLogger.js";
import FigmaStyle1Layout from "../layouts/FigmaStyle1Layout";

interface Ask05Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData?: any;
}

const Ask05 = ({ sessionID, onNavigate }: Ask05Props) => {
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
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F2027d04252804378a79493387966cef1?format=webp&width=800"
      className="ask05-page"
      imageLoading="eager"
    >
      {/* page-specific override: align content area to top for this page */}
      <style>{`.ask05-page .figma-style1-content-area { justify-content: flex-start !important; padding-top: 12px; } .ask05-page .figma-style1-background { background-position: center top !important; }`}</style>
      {/* Content matching the new pages' structure */}
      <div className="flex flex-col items-center justify-between h-full w-full max-w-[1080px] mx-auto px-4 py-8" style={{minHeight: 'calc(100vh - 160px)'}}>
        {/* Title */}
        <div className="text-center mb-4 mt-2 w-full">
          <h1
            className="font-prompt font-bold text-center"
            style={{
              color: "#000D59",
              fontSize: "clamp(24px, 5.6vw, 60px)",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            คุณคิดว่ารัฐควรทำอะไรที่จะทำให้นโยบายนี้เกิดขึ้นได้และเป็���ประโยชน์ต่อประชาชนอย่างแท้จริง
          </h1>
        </div>

        {/* Text Input Box */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-[890px]">
            <div
              className="relative w-full rounded-[20px] border-[5px] border-[#000D59] bg-white"
              style={{
                minHeight: "clamp(220px, 30vh, 420px)",
                padding: "clamp(12px, 2.2vw, 20px)",
              }}
            >
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="พิมพ์ข้อความของคุณที่นี่..."
                className="w-full h-full resize-none border-none outline-none font-prompt bg-transparent"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 400,
                  minHeight: "clamp(160px, 20vh, 360px)",
                  color: suggestion ? "#000" : "rgba(0, 0, 0, 0.7)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="w-full max-w-[845px]">
          <div className="relative">
            <div
              className="rounded-[50px] bg-[#FFE000] mx-auto"
              style={{
                width: "min(845px, 85vw)",
                height: "clamp(60px, 8vw, 118px)",
              }}
            />
            <button
              onClick={handleContinue}
              className="absolute inset-0 w-full transition-all duration-200 hover:scale-105 flex items-center justify-center"
              style={{
                background: "transparent",
                border: "none",
                height: "clamp(60px, 8vw, 118px)",
              }}
            >
              <span
                className="font-prompt text-black text-center font-normal px-4"
                style={{
                  fontSize: "clamp(16px, 3.5vw, 50px)",
                  fontWeight: 400,
                  letterSpacing: "0.4px",
                }}
              >
                ไปต่อ
              </span>
            </button>
          </div>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Ask05;
