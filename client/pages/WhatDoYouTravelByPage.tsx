import { useState } from "react";
import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";
import { logEvent } from "../services/dataLogger.js";
import { useState } from "react";

export default function WhatDoYouTravelByPage() {
  const { navigateToPage, sessionID } = useSession();
  const [textInput, setTextInput] = useState("");

  const handleContinue = () => {
    // Log explicit travel method
    logEvent({
      event: "TRAVEL_METHOD",
      payload: { method: textInput, sessionID },
    });
    // Navigate to the opinion page after user submits travel method
    navigateToPage("/how-do-you-think", {
      from: "what_do_you_travel_by",
      sessionID,
      travelMethod: textInput,
    });
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F54f76900fd8c46ffbaa090c8234dbd22?format=webp&width=800"
      className="what-do-you-travel-by-page"
      imageLoading="eager"
      title={`บอกเราหน่อยว่าคุณเดินทางเข้าเมือง\nด้วยวิธีการใดบ่อยที่สุด`}
    >
      <div className="wdytb-content">
        <div className="w-full max-w-[890px] mx-auto">
          <div
            className="wdytb-textarea-box relative w-full rounded-[20px] border-[5px] border-[#000D59] bg-white"
            style={{
              minHeight: "clamp(320px, 35vh, 560px)",
              padding: "clamp(20px, 4vw, 32px)",
            }}
          >
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="พิมพ์ข้อความของคุณที่นี่..."
              className="w-full h-full resize-none border-none outline-none font-prompt bg-transparent"
              style={{
                padding: "clamp(12px, 2.5vw, 24px)",
                fontSize: "clamp(16px, 3.2vw, 36px)",
                fontWeight: 400,
                minHeight: "clamp(260px, 30vh, 480px)",
                color: "#000",
                boxSizing: "border-box",
                lineHeight: 1.4,
                verticalAlign: "top",
                display: "block",
                overflow: "auto",
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
}
