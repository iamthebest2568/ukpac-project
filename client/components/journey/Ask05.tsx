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
      title={`คุณคิดว่ารัฐควรทำอะไรที่จะทำให้นโยบายนี้เกิดขึ้นได้และเป็นประโยชน์ต่อประชาชนอย่างแท้จริง`}
    >
      <div className="ask05-content">
        <div className="w-full max-w-[890px] mx-auto">
          <div
            className="ask05-textarea-box relative w-full rounded-[20px] border-[5px] border-[#000D59] bg-white"
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

      <div className="figma-style1-button-container">
        <button onClick={handleContinue} className="figma-style1-button">
          <span className="figma-style1-button-text">ไปต่อ</span>
        </button>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Ask05;
