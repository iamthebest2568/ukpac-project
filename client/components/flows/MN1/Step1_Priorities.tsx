/**
 * UK PACK - MN1 Step 1: Priorities Selection
 * Redesigned to match Figma specifications
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
    "เพิ่ม Feeder ในซอ���",
  ];

  const handlePriorityToggle = (priority: string) => {
    setSelectedPriorities((prev) => {
      const isSelected = prev.includes(priority);

      if (isSelected) {
        // Remove if already selected
        return prev.filter((p) => p !== priority);
      } else {
        // Add if not selected and under limit
        if (prev.length < maxSelections) {
          return [...prev, priority];
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    // Log the minigame completion
    logEvent({
      event: "MINIGAME_MN1_COMPLETE",
      payload: {
        selectedPolicies: selectedPriorities,
        sessionID,
      },
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

    const data = { priorities: { selectedPriorities } };
    onNext(data);
  };

  const isSelectionDisabled = (priority: string) => {
    return (
      selectedPriorities.length >= maxSelections &&
      !selectedPriorities.includes(priority)
    );
  };

  return (
    <div className="w-full min-h-screen bg-white overflow-hidden relative" style={{maxWidth: '1080px'}}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-white">
          <div className="relative w-full h-full flex justify-center items-center">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/3b287c4c812ae9bc78f9c5a8da49d3845fd1887f?width=2158"
              alt="Transportation background"
              className="w-full h-full object-cover"
              style={{aspectRatio: '9/16'}}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen justify-center items-center px-4 py-8">
        
        {/* Title */}
        <div className="text-center mb-6" style={{width: '1080px', height: '242px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h1 
            className="font-prompt font-bold text-center leading-normal"
            style={{
              color: '#000D59',
              fontSize: 'clamp(32px, 8vw, 80px)',
              fontWeight: 700,
              lineHeight: 'normal'
            }}
          >
            คุณคิดว่าควรใช้เงินที่ได้<br />จากการเก็บไปพัฒนาอะไร
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-8" style={{width: '1080px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <p 
            className="font-prompt font-bold text-center"
            style={{
              color: '#000D59',
              fontSize: 'clamp(20px, 4vw, 40px)',
              fontWeight: 700,
              lineHeight: 'normal'
            }}
          >
            ไม่เกิน 3 นโยบาย
          </p>
        </div>

        {/* Options Grid */}
        <div className="mb-12" style={{width: 'min(984px, 90vw)', height: '318px'}}>
          {/* Row 1 */}
          <div className="flex gap-[19px] mb-[24px] justify-start">
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 ${
                selectedPriorities.includes("ลดค่าโดยสารรถไฟฟ้า")
                  ? "bg-[#FFE000]"
                  : isSelectionDisabled("ลดค่าโดยสารรถไฟฟ้า")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#E9E9E9] hover:bg-[#FFE000]"
              }`}
              style={{width: '465px', height: '90px'}}
              onClick={() =>
                !isSelectionDisabled("ลดค่าโดยสารรถไฟฟ้า") &&
                handlePriorityToggle("ลดค่าโดยสารรถไฟฟ้า")
              }
              disabled={isSelectionDisabled("ลดค่าโดยสารรถไฟฟ้า")}
            >
              <span
                className="font-prompt text-black text-center font-bold"
                style={{
                  fontSize: 'clamp(18px, 4vw, 40px)',
                  fontWeight: 700,
                  letterSpacing: '0.4px'
                }}
              >
                ลดค่าโดยสารรถไฟฟ้า
              </span>
            </button>
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 ${
                selectedPriorities.includes("ปรับปรุงคุณภาพรถเมล์")
                  ? "bg-[#FFE000]"
                  : isSelectionDisabled("ปรับปรุงคุณภาพรถเมล์")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#FFE000] hover:bg-[#E9E9E9]"
              }`}
              style={{width: '500px', height: '90px'}}
              onClick={() =>
                !isSelectionDisabled("ปรับปรุงคุณภาพรถเมล์") &&
                handlePriorityToggle("ปรับปรุงคุณภาพรถเมล์")
              }
              disabled={isSelectionDisabled("ปรับปรุงคุณภาพรถเมล์")}
            >
              <span
                className="font-prompt text-black text-center font-bold"
                style={{
                  fontSize: 'clamp(18px, 4vw, 40px)',
                  fontWeight: 700,
                  letterSpacing: '0.4px'
                }}
              >
                ปรับปรุงคุณภาพรถเมล์
              </span>
            </button>
          </div>

          {/* Row 2 */}
          <div className="flex gap-[29px] mb-[24px] justify-start">
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 ${
                selectedPriorities.includes("ตั๋วร่วม")
                  ? "bg-[#FFE000]"
                  : isSelectionDisabled("ตั๋วร่วม")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#E9E9E9] hover:bg-[#FFE000]"
              }`}
              style={{width: '248px', height: '90px'}}
              onClick={() =>
                !isSelectionDisabled("ตั๋วร่วม") &&
                handlePriorityToggle("ตั๋วร่วม")
              }
              disabled={isSelectionDisabled("ตั๋วร่วม")}
            >
              <span
                className="font-prompt text-black text-center font-bold"
                style={{
                  fontSize: 'clamp(18px, 4vw, 40px)',
                  fontWeight: 700,
                  letterSpacing: '0.4px'
                }}
              >
                ตั๋วร่วม
              </span>
            </button>
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 ${
                selectedPriorities.includes("เพิ่มความถี่รถเมล์")
                  ? "bg-[#FFE000]"
                  : isSelectionDisabled("เพิ่มความถ���่รถเมล์")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#FFE000] hover:bg-[#E9E9E9]"
              }`}
              style={{width: '385px', height: '90px'}}
              onClick={() =>
                !isSelectionDisabled("เพิ่มความถี่รถเมล์") &&
                handlePriorityToggle("เพิ่มความถี่รถเมล์")
              }
              disabled={isSelectionDisabled("เพิ่มความถี่รถเมล์")}
            >
              <span
                className="font-prompt text-black text-center font-bold"
                style={{
                  fontSize: 'clamp(18px, 4vw, 40px)',
                  fontWeight: 700,
                  letterSpacing: '0.4px'
                }}
              >
                เพิ่มความถี่รถเมล์
              </span>
            </button>
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 ${
                selectedPriorities.includes("เพิ่มที่จอดรถ")
                  ? "bg-[#FFE000]"
                  : isSelectionDisabled("เพิ่มที่จอดรถ")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#E9E9E9] hover:bg-[#FFE000]"
              }`}
              style={{width: '293px', height: '90px'}}
              onClick={() =>
                !isSelectionDisabled("เพิ่มที่จอดรถ") &&
                handlePriorityToggle("เพิ่มที่จอดรถ")
              }
              disabled={isSelectionDisabled("เพิ่มที่จอดรถ")}
            >
              <span
                className="font-prompt text-black text-center font-bold"
                style={{
                  fontSize: 'clamp(18px, 4vw, 40px)',
                  fontWeight: 700,
                  letterSpacing: '0.4px'
                }}
              >
                เพิ่มที่จอดรถ
              </span>
            </button>
          </div>

          {/* Row 3 */}
          <div className="flex gap-[38px] justify-start">
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 ${
                selectedPriorities.includes("เพิ่มความถี่รถไฟฟ้า")
                  ? "bg-[#FFE000]"
                  : isSelectionDisabled("เพิ่มความถี่รถไฟฟ้า")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#E9E9E9] hover:bg-[#FFE000]"
              }`}
              style={{width: '465px', height: '90px'}}
              onClick={() =>
                !isSelectionDisabled("เพิ่มความถี่รถไฟฟ้า") &&
                handlePriorityToggle("เพิ่มความถี่รถไฟฟ้า")
              }
              disabled={isSelectionDisabled("เพิ่มความถี่รถไฟฟ้า")}
            >
              <span
                className="font-prompt text-black text-center font-bold"
                style={{
                  fontSize: 'clamp(18px, 4vw, 40px)',
                  fontWeight: 700,
                  letterSpacing: '0.4px'
                }}
              >
                เพิ่มความถี่รถไฟฟ้า
              </span>
            </button>
            <button
              className={`rounded-[40px] border-0 transition-all duration-200 ${
                selectedPriorities.includes("เพิ่ม Feeder ในซอย")
                  ? "bg-[#FFE000]"
                  : isSelectionDisabled("เพิ่ม Feeder ในซอย")
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-[#E9E9E9] hover:bg-[#FFE000]"
              }`}
              style={{width: '480px', height: '90px'}}
              onClick={() =>
                !isSelectionDisabled("เพิ่ม Feeder ในซอย") &&
                handlePriorityToggle("เพิ่ม Feeder ในซอย")
              }
              disabled={isSelectionDisabled("เพิ่ม Feeder ในซอย")}
            >
              <span
                className="font-prompt text-black text-center font-bold"
                style={{
                  fontSize: 'clamp(18px, 4vw, 40px)',
                  fontWeight: 700,
                  letterSpacing: '0.4px'
                }}
              >
                เพิ่ม Feeder ในซอย
              </span>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <div style={{width: '1154px', height: '118px', position: 'relative'}}>
          <div 
            className="rounded-[50px] bg-[#FFE000]"
            style={{
              width: '845px',
              height: '118px',
              position: 'absolute',
              left: '155px',
              top: '0px'
            }}
          />
          <button
            onClick={handleNext}
            disabled={selectedPriorities.length === 0}
            className={`transition-all duration-200 hover:scale-105 ${
              selectedPriorities.length === 0
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-opacity-80"
            }`}
            style={{
              width: '1154px',
              height: '118px',
              position: 'absolute',
              left: '0px',
              top: '0px',
              background: 'transparent',
              border: 'none'
            }}
            aria-describedby="next-button-description"
          >
            <span
              className="font-prompt text-black text-center font-normal"
              style={{
                fontSize: 'clamp(24px, 5vw, 50px)',
                fontWeight: 400,
                letterSpacing: '0.4px'
              }}
            >
              ไปต่อ
            </span>
          </button>

          {selectedPriorities.length === 0 && (
            <div
              id="next-button-description"
              className="text-center text-[#000D59] text-sm mt-4"
              style={{
                position: 'absolute',
                top: '130px',
                width: '100%',
                fontSize: 'clamp(14px, 3vw, 18px)'
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
