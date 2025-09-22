/**
 * Ask02_2 - Text Input Page
 * Full-bleed implementation matching Figma design with blue background and text input
 */

import { useState } from "react";
import { logEvent } from "../../services/dataLogger.js";
import FigmaStyle1Layout from "../layouts/FigmaStyle1Layout";

interface Ask02_2Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const Ask02_2 = ({ sessionID, onNavigate }: Ask02_2Props) => {
  const [textInput, setTextInput] = useState("");

  const handleNext = () => {
    // Log the user's custom reason
    logEvent({
      event: "ASK02_2_SUBMIT",
      payload: {
        customReason: textInput,
        sessionID,
      },
    });

    const data = { textInput };
    onNavigate("ask05", data);
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F463cb2fbbefd410cac31721ec26e22e5?format=webp&width=800"
      title={
        <>
          <div>เหตุผลอื่นๆ</div>
          <div>คืออะไรช่วยบอกเราหน่อยได้ไหม</div>
        </>
      }
      className="source-selection-page ask02-2-page"
      imageLoading="eager"
    >
      <div className="ask02-2-content">
        <div
          className="w-full max-w-[890px] mx-auto"
          style={{
            marginTop: "clamp(10px, 3vh, 28px)",
            marginBottom: "clamp(8px, 2vh, 20px)",
          }}
        >
          <div
            className="ask02-2-textarea-box relative w-full rounded-[20px] border-2 border-[#000D59] bg-white"
            style={{
              minHeight: "clamp(200px, 28vh, 400px)",
              padding: "clamp(12px, 2.2vw, 20px)",
            }}
          >
            {/* Centered placeholder overlay when input is empty */}
            <div
              onClick={() => {
                const el = document.getElementById("ask02-2-textarea") as HTMLTextAreaElement | null;
                if (el) el.focus();
              }}
              style={{
                display: textInput.trim().length > 0 ? "none" : "flex",
                position: "absolute",
                inset: 0,
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(12px, 2.2vw, 20px)",
                pointerEvents: "auto",
                textAlign: "center",
                color: "#6b7280",
                fontSize: "clamp(16px, 3.6vw, 38px)",
                lineHeight: 1.3,
              }}
              aria-hidden={textInput.trim().length > 0}
            >
              พิมพ์ข้อความของคุณที่นี่...
            </div>

            <textarea
              id="ask02-2-textarea"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={""}
              aria-label={"กรอกเหตุผลอื่นๆ"}
              className="w-full h-full resize-none border-none outline-none font-prompt bg-transparent"
              style={{
                fontSize: "clamp(16px, 3.6vw, 38px)",
                fontWeight: 400,
                minHeight: "clamp(150px, 18vh, 340px)",
                color: "#000D59",
                lineHeight: 1.3,
                // ensure textarea content starts from top when user types
                paddingTop: 0,
              }}
            />
          </div>
        </div>
      </div>

      <div className="figma-style1-button-container">
        <button
          onClick={handleNext}
          className="figma-style1-button"
          disabled={textInput.trim().length === 0}
          aria-disabled={textInput.trim().length === 0}
        >
          <span className="figma-style1-button-text">ไปต่อ</span>
        </button>
      </div>

      {textInput.trim().length === 0 && (
        <div
          className="text-center font-prompt mt-2"
          style={{ color: "#000D59", fontSize: "14px" }}
        >
          กรุณากรอกข้อความเพื่อดำเนินการต่อ
        </div>
      )}
    </FigmaStyle1Layout>
  );
};

export default Ask02_2;
