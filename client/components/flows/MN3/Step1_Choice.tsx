/**
 * UK PACK - MN3 Step 1: Budget Choice Selection
 * Redesigned to match Figma design exactly - clean white background
 */

import { useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";

interface Step1_ChoiceProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: string[];
}

const Step1_Choice = ({
  sessionID,
  onNext,
  onBack,
  initialData = [],
}: Step1_ChoiceProps) => {
  const [selectedPriorities, setSelectedPriorities] =
    useState<string[]>(initialData);
  const maxSelections = 3;

  // Define priorities with explicit UTF-8 encoding - matching Figma design
  const priorityList = [
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

      if (isSelected) {
        return prev.filter((p) => p !== priority);
      } else {
        if (prev.length < maxSelections) {
          return [...prev, priority];
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    logEvent({
      event: "BUDGET_STEP1_COMPLETE",
      payload: {
        selectedPolicies: selectedPriorities,
        sessionID,
      },
    });
    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "MN3_SELECT",
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

    const data = { budget_step1_choice: { selectedPriorities } };
    onNext(data);
  };

  const isSelectionDisabled = (priority: string) => {
    return (
      selectedPriorities.length >= maxSelections &&
      !selectedPriorities.includes(priority)
    );
  };

  // Define which buttons should be yellow by default (from Figma design)
  const defaultYellowButtons = new Set([
    "ปรับปรุงคุณภาพรถเมล์",
    "เพิ่มความถี่รถเมล์"
  ]);

  const getButtonColor = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      return "bg-black border-black";
    }
    if (isSelectionDisabled(priority)) {
      return "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50";
    }
    if (defaultYellowButtons.has(priority)) {
      return "bg-[#FFE000] border-black hover:bg-black hover:scale-105 group";
    }
    return "bg-[#E9E9E9] border-black hover:bg-black hover:scale-105 group";
  };

  const getTextColor = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      return "font-bold text-[#FFE000]";
    }
    return "font-bold text-black group-hover:text-[#FFE000]";
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 pt-16 pb-24">
          
          {/* Title Section */}
          <div className="text-center mb-8 max-w-4xl">
            <h1 
              className="font-prompt font-bold text-center leading-normal mb-4"
              style={{ 
                color: '#000D59',
                fontSize: 'clamp(32px, 7.4vw, 80px)',
                lineHeight: '1.1'
              }}
            >
              คุณคิดว่าควรใช้เงินที่ได้<br />จากการเก็บไปพัฒนาอะไร
            </h1>
            <p 
              className="font-prompt font-bold text-center"
              style={{ 
                color: '#000D59',
                fontSize: 'clamp(20px, 3.7vw, 40px)'
              }}
            >
              ไม่เกิน 3 นโยบาย
            </p>
          </div>

          {/* Button Grid - Matching Figma Layout Exactly */}
          <div className="w-full max-w-[984px] mb-8">
            {/* Row 1: Two buttons */}
            <div className="flex gap-[19px] mb-6 justify-center">
              <button
                onClick={() => !isSelectionDisabled(priorityList[0]) && handlePriorityToggle(priorityList[0])}
                disabled={isSelectionDisabled(priorityList[0])}
                className={`h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[0])}`}
                style={{ width: '465px' }}
              >
                <span className={`font-prompt text-[40px] ${getTextColor(priorityList[0])}`} style={{ letterSpacing: '0.4px' }}>
                  {priorityList[0]}
                </span>
              </button>
              <button
                onClick={() => !isSelectionDisabled(priorityList[1]) && handlePriorityToggle(priorityList[1])}
                disabled={isSelectionDisabled(priorityList[1])}
                className={`h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[1])}`}
                style={{ width: '500px' }}
              >
                <span className={`font-prompt text-[40px] ${getTextColor(priorityList[1])}`} style={{ letterSpacing: '0.4px' }}>
                  {priorityList[1]}
                </span>
              </button>
            </div>

            {/* Row 2: Three buttons */}
            <div className="flex gap-[29px] mb-6 justify-center">
              <button
                onClick={() => !isSelectionDisabled(priorityList[2]) && handlePriorityToggle(priorityList[2])}
                disabled={isSelectionDisabled(priorityList[2])}
                className={`h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[2])}`}
                style={{ width: '248px' }}
              >
                <span className={`font-prompt text-[40px] ${getTextColor(priorityList[2])}`} style={{ letterSpacing: '0.4px' }}>
                  {priorityList[2]}
                </span>
              </button>
              <button
                onClick={() => !isSelectionDisabled(priorityList[3]) && handlePriorityToggle(priorityList[3])}
                disabled={isSelectionDisabled(priorityList[3])}
                className={`h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[3])}`}
                style={{ width: '385px' }}
              >
                <span className={`font-prompt text-[40px] ${getTextColor(priorityList[3])}`} style={{ letterSpacing: '0.4px' }}>
                  {priorityList[3]}
                </span>
              </button>
              <button
                onClick={() => !isSelectionDisabled(priorityList[4]) && handlePriorityToggle(priorityList[4])}
                disabled={isSelectionDisabled(priorityList[4])}
                className={`h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[4])}`}
                style={{ width: '293px' }}
              >
                <span className={`font-prompt text-[40px] ${getTextColor(priorityList[4])}`} style={{ letterSpacing: '0.4px' }}>
                  {priorityList[4]}
                </span>
              </button>
            </div>

            {/* Row 3: Two buttons */}
            <div className="flex gap-[38px] justify-center">
              <button
                onClick={() => !isSelectionDisabled(priorityList[5]) && handlePriorityToggle(priorityList[5])}
                disabled={isSelectionDisabled(priorityList[5])}
                className={`h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[5])}`}
                style={{ width: '465px' }}
              >
                <span className={`font-prompt text-[40px] ${getTextColor(priorityList[5])}`} style={{ letterSpacing: '0.4px' }}>
                  {priorityList[5]}
                </span>
              </button>
              <button
                onClick={() => !isSelectionDisabled(priorityList[6]) && handlePriorityToggle(priorityList[6])}
                disabled={isSelectionDisabled(priorityList[6])}
                className={`h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[6])}`}
                style={{ width: '480px' }}
              >
                <span className={`font-prompt text-[40px] ${getTextColor(priorityList[6])}`} style={{ letterSpacing: '0.4px' }}>
                  {priorityList[6]}
                </span>
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <div className="w-full max-w-[845px]">
            <button
              onClick={handleNext}
              disabled={selectedPriorities.length === 0}
              className={`w-full h-[118px] rounded-[50px] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 ${
                selectedPriorities.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FFE000] hover:bg-black hover:scale-105 group"
              }`}
              aria-describedby="next-button-description"
            >
              <span
                className={`font-prompt text-[50px] font-normal ${
                  selectedPriorities.length === 0 
                    ? "text-gray-600" 
                    : "text-black group-hover:text-[#FFE000]"
                }`}
                style={{ letterSpacing: '0.4px' }}
              >
                ไปต่อ
              </span>
            </button>

            {selectedPriorities.length === 0 && (
              <div
                id="next-button-description"
                className="text-center text-[#000D59] text-lg mt-4 font-prompt"
              >
                กรุณาเลือกอย่างน้อย 1 ข้อเพื่อดำเนินการต่อ
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_Choice;
