/**
 * Ask05 - Policy Suggestion Page
 * Redesigned to match Ask04 Figma layout
 */

import { useState, useEffect } from "react";
import { logEvent } from "../../services/dataLogger.js";

interface Ask05Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData?: any;
}

const Ask05 = ({ sessionID, onNavigate, journeyData }: Ask05Props) => {
  const [suggestion, setSuggestion] = useState("");
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    setCharacterCount(suggestion.trim().length);
  }, [suggestion]);

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
    <div className="w-full max-w-[390px] min-h-screen bg-white overflow-hidden relative mx-auto">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-90"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Main Content */}
        <div className="flex-1 px-[29px] pt-[165px] pb-8">
          {/* Question Title */}
          <div className="mb-[50px]">
            <h1 className="text-white font-prompt text-[30px] font-normal leading-normal text-center">
              คุณคิดว่ารัฐควรทำอะไร ที่จะทำให้นโยบายนี้เกิดขึ้นได้และ
              เป็นประโยชน์ต่อประชาชน อย่างแท้จริง
            </h1>
          </div>

          {/* Text Input Area */}
          <div className="mb-[65px]">
            <div className="relative">
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="พิมพ์ข้อความของคุณที่นี้..."
                className="w-full h-[290px] rounded-[10px] border border-[#E4E9F2] bg-white px-4 py-4 text-black font-prompt text-[16px] font-normal leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#EFBA31] focus:border-transparent placeholder:text-[rgba(0,0,0,0.7)] placeholder:font-prompt placeholder:text-[16px] placeholder:font-light"
                style={{
                  fontFamily: "Prompt",
                }}
              />
              {/* Character Count */}
              <div className="text-right mt-2 text-white text-sm">
                {characterCount} ตัวอักษร
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="w-full">
            <button
              onClick={handleContinue}
              className="w-full max-w-[325px] mx-auto h-[52px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
              <span className="text-black font-prompt text-[18px] font-medium leading-7 tracking-[0.4px]">
                ไปต่อ
              </span>
            </button>
            {/* Optional Skip Text */}
            <div className="text-center text-white text-sm mt-2">
              คุณสามารถข้ามขั้นตอนนี้ได้หากไม่มีข้อเสนอแนะเพิ่มเติม
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ask05;
