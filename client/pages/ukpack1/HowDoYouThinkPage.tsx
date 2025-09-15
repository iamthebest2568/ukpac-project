/**
 * How Do You Think Page - Opinion selection based on Figma design
 */

import { useState, useEffect } from "react";
import { useSession } from "../../hooks/useSession";
import { logEvent } from "../../services/dataLogger.js";

const HowDoYouThinkPage = () => {
  const { sessionID, navigateToPage } = useSession();
  const [selectedOption, setSelectedOption] = useState<string>("");

  useEffect(() => {
    // Preload next potential pages
    import("./Ask05Page").catch(() => {});
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    
    // Log the selection
    logEvent({
      event: "HOW_DO_YOU_THINK_SELECTION",
      payload: {
        selectedOption: option,
        sessionID,
      },
    });

    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "OPINION_SELECT",
        payload: { selectedOption: option },
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

    // Navigate to next page after a short delay
    setTimeout(() => {
      navigateToPage("/ask05");
    }, 300);
  };

  return (
    <div className="w-full min-h-screen relative bg-white flex flex-col" style={{ maxWidth: 1080, margin: "0 auto" }}>
      {/* Background Section - White curved top with train image */}
      <div 
        className="relative w-full flex-shrink-0"
        style={{ 
          height: 'clamp(260px, 38vw, 420px)',
          borderRadius: '0',
          overflow: 'hidden',
          background: 'transparent'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F6d4ecad8056e45b0b7375a0e5a009530?format=webp&width=800"
            alt="Transportation background"
            className="w-full h-full object-cover"
            style={{ aspectRatio: "9/16" }}
          />
        </div>
      </div>

      {/* Blue Background Section with Question and Options */}
      <div
        className="flex-1 flex flex-col items-center justify-start px-4 py-8"
        style={{ background: '#FFFFFF', minHeight: 'auto' }}
      >
        {/* Question Text */}
        <div className="text-center mt-6 mb-8 max-w-4xl">
          <h1 
            className="font-prompt text-black text-center leading-normal"
            style={{
              fontSize: 'clamp(32px, 7.4vw, 80px)',
              fontWeight: 600,
              lineHeight: 'normal'
            }}
          >
            จากข้อความดังกล่าว<br />
            คุณมีความคิดเห็นอย่างไร
          </h1>
        </div>

        {/* Options */}
        <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
          {[
            { key: "agree", text: "เห็นด้วย" },
            { key: "neutral", text: "เฉยๆ" },
            { key: "disagree", text: "ไม่เห็นด้วย" }
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => handleOptionSelect(option.key)}
              className="w-full max-w-[845px] transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center"
              style={{
                height: 'clamp(60px, 11vw, 119px)',
                borderRadius: '50px',
                background: '#FFE000',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label={`เลือก: ${option.text}`}
            >
              <span
                className="font-prompt text-black text-center"
                style={{
                  fontSize: 'clamp(20px, 4.6vw, 50px)',
                  fontWeight: 400,
                  letterSpacing: '0.4px',
                  lineHeight: 'normal'
                }}
              >
                {option.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowDoYouThinkPage;
