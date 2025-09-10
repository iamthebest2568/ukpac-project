/**
 * UK PACK - MN1 Step 1: Priorities Selection
 * Completely redesigned to match new Figma specifications
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/3b287c4c812ae9bc78f9c5a8da49d3845fd1887f?width=2158"
          alt="Transportation cityscape background"
          className="w-full h-full object-cover"
          style={{ aspectRatio: "9/16" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1080px] flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-6 px-4">
          <h1
            className="font-prompt font-bold text-center leading-normal"
            style={{
              color: "#000D59",
              fontSize: "clamp(32px, 7.4vw, 80px)",
              fontWeight: 700,
              lineHeight: "normal",
              marginBottom: "0"
            }}
          >
            คุณคิดว่าควรใช้เงินที่ได้<br />จากการเก็บไปพัฒนาอะไร
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-12">
          <p
            className="font-prompt font-bold text-center"
            style={{
              color: "#000D59",
              fontSize: "clamp(20px, 3.7vw, 40px)",
              fontWeight: 700,
              lineHeight: "normal"
            }}
          >
            ไม่เกิน 3 นโยบาย
          </p>
        </div>

        {/* Options Grid */}
        <div className="w-full max-w-[984px] mb-16 px-4">
          {/* Row 1 */}
          <div className="flex flex-wrap gap-[19px] mb-6 justify-center lg:justify-start">
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 flex items-center justify-center ${
                selectedPriorities.includes("ลดค่าโดยสารรถไฟฟ้า")
                  ? "bg-[#FFE000]"
                  : isSelectionDisabled("ลดค่าโดยสารรถไฟฟ้า")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#E9E9E9] hover:bg-[#FFE000]"
              }`}
              style={{
                width: "min(465px, 45vw)",
                height: "clamp(60px, 8.3vw, 90px)",
                minWidth: "200px"
              }}
              onClick={() =>
                !isSelectionDisabled("ลดค่าโดยสารรถไฟฟ้า") &&
                handlePriorityToggle("ลดค่าโดยสารรถไฟฟ้า")
              }
              disabled={isSelectionDisabled("ลดค่าโดยสารรถไฟฟ้า")}
            >
              <span
                className="font-prompt text-black text-center font-bold px-2"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px"
                }}
              >
                ลดค่าโดยสารรถไฟฟ้า
              </span>
            </button>
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 flex items-center justify-center ${
                selectedPriorities.includes("ปรับปรุงคุณภาพรถเมล์")
                  ? "bg-[#E9E9E9]"
                  : isSelectionDisabled("ปรับปรุงคุณภาพรถเมล์")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#FFE000] hover:bg-[#E9E9E9]"
              }`}
              style={{
                width: "min(500px, 47vw)",
                height: "clamp(60px, 8.3vw, 90px)",
                minWidth: "220px"
              }}
              onClick={() =>
                !isSelectionDisabled("ปรับปรุงคุณภาพรถเมล์") &&
                handlePriorityToggle("ปรับปรุงคุณภาพรถเมล์")
              }
              disabled={isSelectionDisabled("ปรับปรุงคุณภาพรถเมล์")}
            >
              <span
                className="font-prompt text-black text-center font-bold px-2"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px"
                }}
              >
                ปรับปรุงคุณภาพรถเมล์
              </span>
            </button>
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap gap-[19px] mb-6 justify-center lg:justify-start">
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 flex items-center justify-center ${
                selectedPriorities.includes("ตั๋วร่วม")
                  ? "bg-[#FFE000]"
                  : isSelectionDisabled("ตั๋วร่วม")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#E9E9E9] hover:bg-[#FFE000]"
              }`}
              style={{
                width: "min(248px, 23vw)",
                height: "clamp(60px, 8.3vw, 90px)",
                minWidth: "120px"
              }}
              onClick={() => !isSelectionDisabled("ตั๋วร่วม") && handlePriorityToggle("ตั๋วร่วม")}
              disabled={isSelectionDisabled("ตั๋วร่วม")}
            >
              <span
                className="font-prompt text-black text-center font-bold px-2"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px"
                }}
              >
                ตั๋วร่วม
              </span>
            </button>
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 flex items-center justify-center ${
                selectedPriorities.includes("เพิ่มความถี���รถเมล์")
                  ? "bg-[#E9E9E9]"
                  : isSelectionDisabled("เพิ่มความถี่รถเมล์")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#FFE000] hover:bg-[#E9E9E9]"
              }`}
              style={{
                width: "min(385px, 36vw)",
                height: "clamp(60px, 8.3vw, 90px)",
                minWidth: "180px"
              }}
              onClick={() =>
                !isSelectionDisabled("เพิ่มความถี่รถเมล์") &&
                handlePriorityToggle("เพิ่มความถี่รถเมล์")
              }
              disabled={isSelectionDisabled("เพิ่มความถี่รถเมล์")}
            >
              <span
                className="font-prompt text-black text-center font-bold px-2"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px"
                }}
              >
                เพิ่มความถี่รถเมล์
              </span>
            </button>
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 flex items-center justify-center ${
                selectedPriorities.includes("เพิ่มที่จอดรถ")
                  ? "bg-[#FFE000]"
                  : isSelectionDisabled("เพิ่มที่จอดรถ")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#E9E9E9] hover:bg-[#FFE000]"
              }`}
              style={{
                width: "min(293px, 27vw)",
                height: "clamp(60px, 8.3vw, 90px)",
                minWidth: "140px"
              }}
              onClick={() =>
                !isSelectionDisabled("เพิ่มที่จอดรถ") &&
                handlePriorityToggle("เพิ่มที่จอดรถ")
              }
              disabled={isSelectionDisabled("เพิ่มที่จอดรถ")}
            >
              <span
                className="font-prompt text-black text-center font-bold px-2"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px"
                }}
              >
                เพิ่มที่จอดรถ
              </span>
            </button>
          </div>

          {/* Row 3 */}
          <div className="flex flex-wrap gap-[19px] justify-center lg:justify-start">
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 flex items-center justify-center ${
                selectedPriorities.includes("เพิ่มความถี่รถไฟฟ้า")
                  ? "bg-[#FFE000]"
                  : isSelectionDisabled("เพิ่มความถี่รถไฟฟ้า")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#E9E9E9] hover:bg-[#FFE000]"
              }`}
              style={{
                width: "min(465px, 45vw)",
                height: "clamp(60px, 8.3vw, 90px)",
                minWidth: "200px"
              }}
              onClick={() =>
                !isSelectionDisabled("เพิ่มความถี่รถไฟฟ้า") &&
                handlePriorityToggle("เพิ่มความถี่รถไฟฟ้า")
              }
              disabled={isSelectionDisabled("เพิ่มความถี่รถไฟฟ้า")}
            >
              <span
                className="font-prompt text-black text-center font-bold px-2"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px"
                }}
              >
                เพิ่มความถี่รถไฟฟ้า
              </span>
            </button>
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 flex items-center justify-center ${
                selectedPriorities.includes("เพิ่ม Feeder ในซอย")
                  ? "bg-[#FFE000]"
                  : isSelectionDisabled("เพิ่ม Feeder ในซอย")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#E9E9E9] hover:bg-[#FFE000]"
              }`}
              style={{
                width: "min(480px, 46vw)",
                height: "clamp(60px, 8.3vw, 90px)",
                minWidth: "200px"
              }}
              onClick={() =>
                !isSelectionDisabled("เพิ่ม Feeder ในซอย") &&
                handlePriorityToggle("เพิ่ม Feeder ในซอย")
              }
              disabled={isSelectionDisabled("เพิ่ม Feeder ในซอย")}
            >
              <span
                className="font-prompt text-black text-center font-bold px-2"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px"
                }}
              >
                เพิ่ม Feeder ในซอย
              </span>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <div className="relative w-full max-w-[1154px] px-4">
          {/* Yellow background */}
          <div
            className="rounded-[50px] bg-[#FFE000] mx-auto"
            style={{
              width: "min(845px, 80vw)",
              height: "clamp(80px, 10.9vw, 118px)"
            }}
          />
          {/* Button overlay */}
          <button
            onClick={handleNext}
            disabled={selectedPriorities.length === 0}
            className={`absolute inset-0 w-full transition-all duration-200 hover:scale-105 flex items-center justify-center ${
              selectedPriorities.length === 0
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-opacity-80"
            }`}
            style={{
              background: "transparent",
              border: "none",
              height: "clamp(80px, 10.9vw, 118px)"
            }}
            aria-describedby="next-button-description"
          >
            <span
              className="font-prompt text-black text-center font-normal"
              style={{
                fontSize: "clamp(24px, 4.6vw, 50px)",
                fontWeight: 400,
                letterSpacing: "0.4px"
              }}
            >
              ไปต่อ
            </span>
          </button>

          {selectedPriorities.length === 0 && (
            <div
              id="next-button-description"
              className="text-center mt-4"
              style={{
                color: "#000D59",
                fontSize: "clamp(14px, 2.8vw, 18px)"
              }}
            >
              กรุณาเลือกอย่างน้อย 1 ข้อเพื่อดำเนินการต่อ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1_Priorities;
