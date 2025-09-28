import { useSession } from "../../hooks/useSession";
import { logEvent } from "../../services/dataLogger.js";
import React, { useState } from "react";
import FigmaStyle1Layout from "../../components/layouts/FigmaStyle1Layout.ukpack1";

export default function ReasonOther01Page() {
  const { navigateToPage, sessionID } = useSession();
  const [textInput, setTextInput] = useState("");

  const handleContinue = () => {
    // Log explicit reason text
    logEvent({
      event: "REASON_OTHER_01",
      payload: { text: textInput, sessionID },
    });
    navigateToPage("what_do_you_travel_by", {
      from: "reason_other_01",
      sessionID,
      userInput: textInput,
    });
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc904086ef11f4e0d80cf30aad554f788?format=webp&width=800"
      className="reason-other-01-page"
      imageLoading="eager"
    >
      {/* Custom content matching Figma design */}
      <div className="flex flex-col items-center justify-center h-full w-full max-w-full mx-auto px-4 py-6">
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
            อื่นๆ คืออะไรช่วยบอกเราหน่อยได้ไหม
          </h1>
        </div>

        {/* Text Input Box */}
        <div className="w-full max-w-[890px] mb-12">
          <div
            className="relative w-full rounded-[20px] border-[5px] border-[#000D59] bg-white"
            style={{
              minHeight: "clamp(320px, 35vh, 560px)",
              padding: "clamp(20px, 4vw, 32px)",
            }}
          >
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="พิมพ์ข้อความของคุณที่นี้..."
              className="w-full h-full resize-none border-none outline-none font-prompt text-black bg-transparent"
              style={{
                padding: "clamp(12px, 2.5vw, 24px)",
                fontSize: "clamp(16px, 3.2vw, 36px)",
                fontWeight: 400,
                minHeight: "clamp(260px, 30vh, 480px)",
                color: textInput ? "#000" : "rgba(0, 0, 0, 0.7)",
                boxSizing: "border-box",
                lineHeight: 1.4,
                verticalAlign: "top",
                display: "block",
                overflow: "auto",
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
}
