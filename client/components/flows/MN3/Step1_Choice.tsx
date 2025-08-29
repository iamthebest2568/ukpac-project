/**
 * UK PACK - MN3 Step 1: Budget Choice Selection
 * Cloned exactly from MN1 Step1_Priorities
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

  const priorities = [
    "ลดค่���โดยสารรถไฟฟ้า",
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
    // Log the budget choice selection
    logEvent({
      event: "BUDGET_STEP1_COMPLETE",
      payload: {
        selectedPolicies: selectedPriorities,
        sessionID,
      },
    });

    const data = { budget_step1_choice: { selectedPriorities } };
    onNext(data);
  };

  const isSelectionDisabled = (priority: string) => {
    return (
      selectedPriorities.length >= maxSelections &&
      !selectedPriorities.includes(priority)
    );
  };

  return (
    <div className="figma-style1-container">
      <div className="figma-style1-content">
        {/* Background Image with Overlay */}
        <div className="figma-style1-background">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="งบประมาณการขนส่ง"
            className="figma-style1-background-image"
          />
          <div className="figma-style1-background-overlay" />
        </div>

        {/* Main Content */}
        <div className="figma-style1-main">
          {/* Content Area */}
          <div className="figma-style1-content-area">
            {/* Title */}
            <div className="figma-style1-title-container">
              <h1 className="figma-style1-title">คุณคิดว่าควรใช้เงินที่ได้จากการเก็บไปพัฒนาอะไร</h1>
            </div>

            {/* Subtitle */}
            <div className="text-center mb-6">
              <p className="text-white font-kanit text-lg font-normal">
                ไม่เกิน 3 นโยบาย
              </p>
            </div>

            {/* Selection Items - Exact Figma Layout */}
            <div className="w-full max-w-[354px] mb-8">
              {/* Row 1 */}
              <div className="flex gap-2 mb-3">
                {priorities.slice(0, 2).map((priority) => (
                  <button
                    key={priority}
                    className={`flex-1 h-[41px] rounded-[40px] border transition-all duration-200 ${
                      selectedPriorities.includes(priority)
                        ? "bg-black border-black"
                        : isSelectionDisabled(priority)
                          ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                          : "bg-[#EFBA31] border-black hover:bg-black hover:scale-105 group"
                    }`}
                    onClick={() => !isSelectionDisabled(priority) && handlePriorityToggle(priority)}
                    disabled={isSelectionDisabled(priority)}
                  >
                    <span className={`figma-style1-button-text text-[15px] ${
                      selectedPriorities.includes(priority) ? "font-semibold text-[#EFBA31]" : "font-medium text-black group-hover:text-[#EFBA31]"
                    }`} style={{ letterSpacing: "0.4px" }}>
                      {priority}
                    </span>
                  </button>
                ))}
              </div>

              {/* Row 2 */}
              <div className="flex gap-2 mb-3">
                {priorities.slice(2, 5).map((priority) => (
                  <button
                    key={priority}
                    className={`flex-1 h-[41px] rounded-[40px] border transition-all duration-200 ${
                      selectedPriorities.includes(priority)
                        ? "bg-black border-black"
                        : isSelectionDisabled(priority)
                          ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                          : "bg-[#EFBA31] border-black hover:bg-black hover:scale-105 group"
                    }`}
                    onClick={() => !isSelectionDisabled(priority) && handlePriorityToggle(priority)}
                    disabled={isSelectionDisabled(priority)}
                  >
                    <span className={`figma-style1-button-text text-[15px] ${
                      selectedPriorities.includes(priority) ? "font-semibold text-[#EFBA31]" : "font-medium text-black group-hover:text-[#EFBA31]"
                    }`} style={{ letterSpacing: "0.4px" }}>
                      {priority}
                    </span>
                  </button>
                ))}
              </div>

              {/* Row 3 */}
              <div className="flex gap-2">
                {priorities.slice(5).map((priority) => (
                  <button
                    key={priority}
                    className={`flex-1 h-[41px] rounded-[40px] border transition-all duration-200 ${
                      selectedPriorities.includes(priority)
                        ? "bg-black border-black"
                        : isSelectionDisabled(priority)
                          ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                          : "bg-[#EFBA31] border-black hover:bg-black hover:scale-105 group"
                    }`}
                    onClick={() => !isSelectionDisabled(priority) && handlePriorityToggle(priority)}
                    disabled={isSelectionDisabled(priority)}
                  >
                    <span className={`figma-style1-button-text text-[15px] ${
                      selectedPriorities.includes(priority) ? "font-semibold text-[#EFBA31]" : "font-medium text-black group-hover:text-[#EFBA31]"
                    }`} style={{ letterSpacing: "0.4px" }}>
                      {priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
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
                    selectedPriorities.length === 0
                      ? "text-gray-600"
                      : ""
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_Choice;
