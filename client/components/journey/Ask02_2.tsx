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
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Feb2f14480a1349a6bc6b76594e26c7b5?format=webp&width=2160"
      title="อื่นๆ คืออะไรช่วยบอกเราหน่อยได้ไหม"
      className="source-selection-page ask02-2-page"
      imageLoading="eager"
    >
      {/* Children: custom content identical to previous implementation but rendered inside layout */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ paddingTop: '4%', paddingBottom: '20%' }}>
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
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
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

      <div className="w-full flex justify-center items-end" style={{ paddingBottom: '8.9%' }}>
        <div className="relative flex justify-center" style={{ width: '78.2%', maxWidth: '845px' }}>
          <button
            onClick={handleNext}
            disabled={textInput.trim().length === 0}
            className={`w-full rounded-[50px] flex items-center justify-center transition-all duration-200 ${
              textInput.trim().length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FFE000] hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
            }`}
            style={{
              height: 'clamp(50px, 6.1vw, 118px)',
              minHeight: '50px'
            }}
          >
            <span
              className={`font-prompt text-center ${
                textInput.trim().length === 0
                  ? "text-gray-600"
                  : "text-black group-hover:text-[#FFE000] group-active:text-[#FFE000]"
              }`}
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

        {textInput.trim().length === 0 && (
          <div
            className="absolute text-center font-prompt"
            style={{
              color: '#000D59',
              fontSize: 'clamp(12px, 1.67vw, 18px)',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '16px'
            }}
          >
            กรุณากรอกข้อความเพื่อดำเนินการต่อ
          </div>
        )}
      </div>
    </FigmaStyle1Layout>
  );
};

export default Ask02_2;
