/**
 * UK PACK - MN1 Step 1: Priorities Selection
 * Mobile-first responsive UI matching Figma
 */

import { useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";

interface Step1_PrioritiesProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: string[];
}

const Step1_Priorities = ({
  sessionID,
  onNext,
  onBack,
  initialData = [],
}: Step1_PrioritiesProps) => {
  const [selectedPriorities, setSelectedPriorities] =
    useState<string[]>(initialData);
  const maxSelections = 3;

  const priorities = [
    "ลดค่าโดยสารรถไฟฟ้า",
    "ปรับปรุงคุณภาพรถเมล์",
    "ตั๋วร่วม",
    "เพิ่มความถี่รถเมล์",
    "เพิ่มที่จอดรถ",
    "เพิ่มความถี่รถไฟฟ้า",
    "เพิ่ม Feeder ในซอย",
  ];

  const handlePriorityToggle = (priority: string) => {
    setSelectedPriorities((prev) => {
      const isSelected = prev.includes(priority);
      if (isSelected) return prev.filter((p) => p !== priority);
      if (prev.length < maxSelections) return [...prev, priority];
      return prev;
    });
  };

  const handleNext = () => {
    logEvent({
      event: "MINIGAME_MN1_COMPLETE",
      payload: { selectedPolicies: selectedPriorities, sessionID },
    });
    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "MN1_COMPLETE",
        payload: { selectedPolicies: selectedPriorities },
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

    onNext({ priorities: { selectedPriorities } });
  };

  const isSelectionDisabled = (priority: string) =>
    selectedPriorities.length >= maxSelections && !selectedPriorities.includes(priority);

  return (
    <div className="figma-style1-container">
      <div className="figma-style1-content">
        {/* Background + overlay for readability */}
        <div className="figma-style1-background">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="ฉากหลังการเดินทางในเมือง"
            className="figma-style1-background-image"
          />
          <div className="figma-style1-background-overlay" />
        </div>

        {/* Main */}
        <div className="figma-style1-main">
          <header className="figma-style1-header" aria-hidden="true" />

          <section className="figma-style1-content-area">
            {/* Title */}
            <div className="figma-style1-title-container">
              <h1 className="figma-style1-title text-white">
                คุณคิดว่าควรใช้เงินที่ได้จากการเก็บไปพัฒนาอะไร
              </h1>
            </div>

            {/* Subtitle */}
            <p className="figma-style1-subtitle text-white mb-6">ไม่เกิน 3 นโยบาย</p>

            {/* Options - exactly arranged for mobile, still responsive */}
            <div className="w-full max-w-[354px] mb-8">
              {/* Row 1 */}
              <div className="flex gap-2 mb-3">
                <button
                  className={`w-[163px] h-[41px] rounded-[40px] border transition-all duration-200 ${
                    selectedPriorities.includes("ลดค่าโดยสารรถไฟฟ้า")
                      ? "bg-black border-black"
                      : isSelectionDisabled("ลดค่าโดยสารรถไฟฟ้า")
                        ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                        : "bg-[#EFBA31] border-black hover:bg-black hover:scale-105 group"
                  }`}
                  onClick={() =>
                    !isSelectionDisabled("ลดค่าโดยสารรถไฟฟ้า") &&
                    handlePriorityToggle("ลดค่าโดยสารรถไฟฟ้า")
                  }
                  disabled={isSelectionDisabled("ลดค่าโดยสารรถไฟฟ้า")}
                >
                  <span
                    className={`figma-style1-button-text text-[15px] ${
                      selectedPriorities.includes("ลดค่าโดยสารรถไฟฟ้า")
                        ? "font-semibold text-[#EFBA31]"
                        : "font-medium text-black group-hover:text-[#EFBA31]"
                    }`}
                    style={{ letterSpacing: "0.4px" }}
                  >
                    ลดค่าโดยสารรถไฟฟ้า
                  </span>
                </button>
                <button
                  className={`w-[179px] h-[41px] rounded-[40px] border transition-all duration-200 ${
                    selectedPriorities.includes("ปรับปรุงคุณภาพรถเมล์")
                      ? "bg-black border-black"
                      : isSelectionDisabled("ปรับปรุงคุณภาพรถเมล์")
                        ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                        : "bg-[#EFBA31] border-black hover:bg-black hover:scale-105 group"
                  }`}
                  onClick={() =>
                    !isSelectionDisabled("ปรับปรุงคุณภาพรถเมล์") &&
                    handlePriorityToggle("ปรับปรุงคุณภาพรถเมล์")
                  }
                  disabled={isSelectionDisabled("ปรับปรุงคุณภาพรถเมล์")}
                >
                  <span
                    className={`figma-style1-button-text text-[15px] ${
                      selectedPriorities.includes("ปรับปรุงคุณภาพรถเมล์")
                        ? "font-semibold text-[#EFBA31]"
                        : "font-medium text-black group-hover:text-[#EFBA31]"
                    }`}
                    style={{ letterSpacing: "0.4px" }}
                  >
                    ปรับปรุงคุณภาพรถเมล์
                  </span>
                </button>
              </div>

              {/* Row 2 */}
              <div className="flex gap-2 mb-3">
                <button
                  className={`w-[75px] h-[41px] rounded-[40px] border transition-all duration-200 ${
                    selectedPriorities.includes("ตั๋วร่วม")
                      ? "bg-black border-black"
                      : isSelectionDisabled("ตั๋วร่วม")
                        ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                        : "bg-[#EFBA31] border-black hover:bg-black hover:scale-105 group"
                  }`}
                  onClick={() => !isSelectionDisabled("ตั๋วร่วม") && handlePriorityToggle("ตั๋วร่วม")}
                  disabled={isSelectionDisabled("ตั๋วร่วม")}
                >
                  <span
                    className={`figma-style1-button-text text-[15px] ${
                      selectedPriorities.includes("ตั๋วร่วม")
                        ? "font-semibold text-[#EFBA31]"
                        : "font-medium text-black group-hover:text-[#EFBA31]"
                    }`}
                    style={{ letterSpacing: "0.4px" }}
                  >
                    ตั๋วร่วม
                  </span>
                </button>
                <button
                  className={`w-[148px] h-[41px] rounded-[40px] border transition-all duration-200 ${
                    selectedPriorities.includes("เพิ่มความถี่รถเมล์")
                      ? "bg-black border-black"
                      : isSelectionDisabled("เพิ่มความถี่รถเมล์")
                        ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                        : "bg-[#EFBA31] border-black hover:bg-black hover:scale-105 group"
                  }`}
                  onClick={() =>
                    !isSelectionDisabled("เพิ่มความถี่รถเมล์") &&
                    handlePriorityToggle("เพิ่มความถี่รถเม��์")
                  }
                  disabled={isSelectionDisabled("เพิ่มความถี่รถเมล์")}
                >
                  <span
                    className={`figma-style1-button-text text-[15px] ${
                      selectedPriorities.includes("เพิ่มความถี่รถเมล์")
                        ? "font-semibold text-[#EFBA31]"
                        : "font-medium text-black group-hover:text-[#EFBA31]"
                    }`}
                    style={{ letterSpacing: "0.4px" }}
                  >
                    เพิ่มความถี่รถเมล์
                  </span>
                </button>
                <button
                  className={`w-[110px] h-[41px] rounded-[40px] border transition-all duration-200 ${
                    selectedPriorities.includes("เพิ่มที่จอดรถ")
                      ? "bg-black border-black"
                      : isSelectionDisabled("เพิ่มที่จอดรถ")
                        ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                        : "bg-[#EFBA31] border-black hover:bg-black hover:scale-105 group"
                  }`}
                  onClick={() =>
                    !isSelectionDisabled("เพิ่มที่จอดรถ") &&
                    handlePriorityToggle("เพิ่มที่จอดรถ")
                  }
                  disabled={isSelectionDisabled("เพิ่มที่จอดรถ")}
                >
                  <span
                    className={`figma-style1-button-text text-[15px] ${
                      selectedPriorities.includes("เพิ่มที่จอดรถ")
                        ? "font-semibold text-[#EFBA31]"
                        : "font-medium text-black group-hover:text-[#EFBA31]"
                    }`}
                    style={{ letterSpacing: "0.4px" }}
                  >
                    เพิ่มที่จอดรถ
                  </span>
                </button>
              </div>

              {/* Row 3 */}
              <div className="flex gap-2">
                <button
                  className={`w-[163px] h-[41px] rounded-[40px] border transition-all duration-200 ${
                    selectedPriorities.includes("เพิ่มความถี่รถไฟฟ้า")
                      ? "bg-black border-black"
                      : isSelectionDisabled("เพิ่มความถี่รถ��ฟฟ้า")
                        ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                        : "bg-[#EFBA31] border-black hover:bg-black hover:scale-105 group"
                  }`}
                  onClick={() =>
                    !isSelectionDisabled("เพิ่มความถี่รถไฟฟ้า") &&
                    handlePriorityToggle("เพิ่มความถี่รถไฟฟ้า")
                  }
                  disabled={isSelectionDisabled("เพิ่มความถี่รถไฟฟ้า")}
                >
                  <span
                    className={`figma-style1-button-text text-[15px] ${
                      selectedPriorities.includes("เพิ่มความถี่รถไฟฟ้า")
                        ? "font-semibold text-[#EFBA31]"
                        : "font-medium text-black group-hover:text-[#EFBA31]"
                    }`}
                    style={{ letterSpacing: "0.4px" }}
                  >
                    เพิ่มความถี่รถไฟฟ้า
                  </span>
                </button>
                <button
                  className={`w-[167px] h-[41px] rounded-[40px] border transition-all duration-200 ${
                    selectedPriorities.includes("เพิ่ม Feeder ในซอย")
                      ? "bg-black border-black"
                      : isSelectionDisabled("เพิ่ม Feeder ในซอย")
                        ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                        : "bg-[#EFBA31] border-black hover:bg-black hover:scale-105 group"
                  }`}
                  onClick={() =>
                    !isSelectionDisabled("เพิ่ม Feeder ในซอย") &&
                    handlePriorityToggle("เพิ่ม Feeder ในซอย")
                  }
                  disabled={isSelectionDisabled("เพิ่ม Feeder ในซอย")}
                >
                  <span
                    className={`figma-style1-button-text text-[15px] ${
                      selectedPriorities.includes("เพิ่ม Feeder ในซอย")
                        ? "font-semibold text-[#EFBA31]"
                        : "font-medium text-black group-hover:text-[#EFBA31]"
                    }`}
                    style={{ letterSpacing: "0.4px" }}
                  >
                    เพิ่ม Feeder ในซอย
                  </span>
                </button>
              </div>
            </div>

            {/* Continue */}
            <div className="w-full max-w-[325px]">
              <button
                onClick={handleNext}
                disabled={selectedPriorities.length === 0}
                className={`w-full h-[53px] rounded-[40px] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 ${
                  selectedPriorities.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "figma-style1-button"
                }`}
                aria-describedby="next-button-description"
              >
                <span
                  className={`figma-style1-button-text ${
                    selectedPriorities.length === 0 ? "text-gray-600" : ""
                  }`}
                >
                  ไปต่อ
                </span>
              </button>

              {selectedPriorities.length === 0 && (
                <div
                  id="next-button-description"
                  className="text-center text-white text-sm mt-2"
                >
                  กรุณาเลือกอย่างน้อย 1 ข้อเพื่อดำเนินการต่อ
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Step1_Priorities;
