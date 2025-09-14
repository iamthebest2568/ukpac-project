/**
 * Ask05 - Policy Suggestion Page
 * Restyled to match the new Figma-style pages while preserving existing content and flow
 */

import { useState } from "react";
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
      backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/1ca30c44dc55682aa7c0c1273799b2f3f61b5c99?width=2160"
      className="ask05-page"
      imageLoading="eager"
    >
      {/* Content matching the new pages' structure */}
      <div className="flex flex-col items-center justify-center h-full w-full max-w-[1080px] mx-auto px-4 py-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h1
            className="font-prompt font-bold text-center"
            style={{
              color: "#000D59",
              fontSize: "clamp(24px, 5.6vw, 60px)",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            คุณคิดว่ารัฐควรทำอะไรที่จะทำให้นโยบายนี้เกิดขึ้นได้และเป็นประโยชน์ต่อประชาชนอย่างแท้จริง
          </h1>
        </div>

        {/* Text Input Box */}
        <div className="w-full max-w-[890px] mb-12">
          <div
            className="relative w-full rounded-[20px] border-[5px] border-[#000D59] bg-white"
            style={{
              minHeight: "clamp(400px, 40vh, 780px)",
              padding: "clamp(16px, 3vw, 24px)",
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
                minHeight: "clamp(350px, 35vh, 720px)",
                color: suggestion ? "#000" : "rgba(0, 0, 0, 0.7)",
              }}
            />
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
