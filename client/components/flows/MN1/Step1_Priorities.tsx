/**
 * UK PACK - MN1 Step 1: Priorities Selection
 * Moved from PolicyPriorities component
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
    <div className="figma-style1-container">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="นโยบายการขนส่ง"
            className="w-full h-full object-cover object-center"
            style={{ minWidth: "100%", aspectRatio: "2/3" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 44.17%)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-end items-center px-6 md:px-8 pb-8 md:pb-12">
            {/* Title */}
            <div className="text-center mb-6 md:mb-8 max-w-[325px]">
              <h1
                className="text-white text-center font-kanit text-3xl font-normal leading-normal mb-4"
                style={{ fontSize: "clamp(24px, 7.5vw, 30px)" }}
              >
                คุณคิดว่าควรใช้เงินที่ได้จากการเก็บไปพัฒนาอะไร
              </h1>
            </div>

            {/* Subtitle */}
            <div className="text-center mb-6">
              <p className="text-white font-kanit text-lg font-normal">
                ไม่เกิน 3 นโยบาย
              </p>
            </div>

            {/* Selection Items - Compact Tag Layout */}
            <div className="w-full max-w-[354px] mb-8">
              {/* Row 1 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {["ลดค่าโดยสารรถไฟฟ้า", "ปรับปรุงคุณภาพรถเมล์"].map((priority, index) => {
                  const isSelected = selectedPriorities.includes(priority);
                  const isDisabled = isSelectionDisabled(priority);

                  return (
                    <button
                      key={index}
                      className={`h-[41px] px-4 rounded-[40px] border transition-all duration-200 ${
                        isSelected
                          ? "bg-[#EFBA31] border-black"
                          : isDisabled
                            ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                            : "bg-white border-[#E4E9F2] hover:bg-gray-50"
                      } ${index === 0 ? "flex-shrink-0" : "flex-1"}`}
                      onClick={() => !isDisabled && handlePriorityToggle(priority)}
                      disabled={isDisabled}
                    >
                      <span className={`font-prompt text-[15px] text-center ${
                        isSelected ? "font-semibold text-black" : "font-medium text-black"
                      }`} style={{ letterSpacing: "0.4px" }}>
                        {priority}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Row 2 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {["ตั๋วร่วม", "เพิ่มความถี่รถเมล์", "เพิ่มที่จอดรถ"].map((priority, index) => {
                  const isSelected = selectedPriorities.includes(priority);
                  const isDisabled = isSelectionDisabled(priority);

                  return (
                    <button
                      key={index}
                      className={`h-[41px] px-4 rounded-[40px] border transition-all duration-200 ${
                        isSelected
                          ? "bg-[#EFBA31] border-black"
                          : isDisabled
                            ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                            : "bg-white border-[#E4E9F2] hover:bg-gray-50"
                      } ${index === 0 ? "w-[75px] flex-shrink-0" : index === 1 ? "flex-1" : "w-[110px] flex-shrink-0"}`}
                      onClick={() => !isDisabled && handlePriorityToggle(priority)}
                      disabled={isDisabled}
                    >
                      <span className={`font-prompt text-[15px] text-center ${
                        isSelected ? "font-semibold text-black" : "font-medium text-black"
                      }`} style={{ letterSpacing: "0.4px" }}>
                        {priority}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Row 3 */}
              <div className="flex flex-wrap gap-2">
                {["เพิ่มความถี่รถไฟฟ้า", "เพิ่ม Feeder ในซอย"].map((priority, index) => {
                  const isSelected = selectedPriorities.includes(priority);
                  const isDisabled = isSelectionDisabled(priority);

                  return (
                    <button
                      key={index}
                      className={`h-[41px] px-4 rounded-[40px] border transition-all duration-200 ${
                        isSelected
                          ? "bg-[#EFBA31] border-black"
                          : isDisabled
                            ? "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                            : "bg-white border-[#E4E9F2] hover:bg-gray-50"
                      } ${index === 0 ? "flex-1" : "flex-1"}`}
                      onClick={() => !isDisabled && handlePriorityToggle(priority)}
                      disabled={isDisabled}
                    >
                      <span className={`font-prompt text-[15px] text-center ${
                        isSelected ? "font-semibold text-black" : "font-medium text-black"
                      }`} style={{ letterSpacing: "0.4px" }}>
                        {priority}
                      </span>
                    </button>
                  );
                })}
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

export default Step1_Priorities;
