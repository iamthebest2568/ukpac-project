/**
 * UK PACK - MN2 Step 1: Beneficiaries Selection
 * Now shows one priority question per page for better UX
 */

import { useState, useEffect } from "react";
import { logEvent } from "../../../services/dataLogger.js";

interface Step1_BeneficiariesProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  currentPriority: string;
  currentStep: number;
  totalPrioritySteps: number;
  initialBeneficiaries?: string[];
}

const Step1_Beneficiaries = ({
  sessionID,
  onNext,
  onBack,
  currentPriority,
  currentStep,
  totalPrioritySteps,
  initialBeneficiaries = [],
}: Step1_BeneficiariesProps) => {
  const [selectedGroups, setSelectedGroups] =
    useState<string[]>(initialBeneficiaries);
  const maxSelections = 6; // Allow up to 6 selections

  // Reset selectedGroups when initialBeneficiaries changes (for new steps)
  useEffect(() => {
    setSelectedGroups(initialBeneficiaries);
  }, [initialBeneficiaries]);

  const beneficiaryGroups = [
    {
      id: "everyone",
      label: "ทุกคน",
      iconSrc:
        "https://api.builder.io/api/v1/image/assets/TEMP/1a7aa898479a915b1d4d0ef1156c80bf95c372af?width=100",
    },
    {
      id: "locals",
      label: "คนในพื้นที่",
      iconSrc:
        "https://api.builder.io/api/v1/image/assets/TEMP/1e470dd8f9f7ac27485f56fba45554979acb2509?width=100",
    },
    {
      id: "elderly",
      label: "ผู้สูงอายุ",
      iconSrc:
        "https://api.builder.io/api/v1/image/assets/TEMP/1b0a18f821ff070a939691646da69e792c28ce55?width=100",
    },
    {
      id: "students",
      label: "นักเรียนนักศึกษา",
      iconSrc:
        "https://api.builder.io/api/v1/image/assets/TEMP/054c6038c235112715becc476723cafe8d55d68f?width=74",
    },
    {
      id: "disabled",
      label: "คนพิการ",
      iconSrc:
        "https://api.builder.io/api/v1/image/assets/TEMP/9633f8bb6d0c953adb33a0769227522a310bb01f?width=88",
    },
    {
      id: "other",
      label: "อื่นๆ",
      iconSrc:
        "https://api.builder.io/api/v1/image/assets/TEMP/5a8e81b8e50e6e0ed69f435d1c09e3de070df984?width=82",
    },
  ];

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups((prev) => {
      const isSelected = prev.includes(groupId);

      if (isSelected) {
        // Remove if already selected
        return prev.filter((g) => g !== groupId);
      } else {
        // Add if not selected and under limit
        if (prev.length < maxSelections) {
          return [...prev, groupId];
        }
        return prev;
      }
    });
  };

  const isSelectionDisabled = (groupId: string) => {
    return (
      selectedGroups.length >= maxSelections &&
      !selectedGroups.includes(groupId)
    );
  };

  const handleNext = () => {
    // Create selections array with this priority's beneficiaries
    const selectionsArray = [
      { priority: currentPriority, beneficiaries: selectedGroups },
    ];
    const data = { beneficiaries: { selections: selectionsArray } };

    // Log the minigame completion
    logEvent({
      event: "MINIGAME_MN2_STEP_COMPLETE",
      payload: {
        priority: currentPriority,
        selectedGroups,
        step: currentStep,
        totalSteps: totalPrioritySteps,
        sessionID,
      },
    });

    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "MN2_STEP",
        payload: {
          priority: currentPriority,
          selectedGroups,
          step: currentStep,
          totalSteps: totalPrioritySteps,
        },
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
    onNext(data);
  };

  return (
    <div className="figma-style1-container">
      <div className="figma-style1-content">
        {/* Background Image with Overlay */}
        <div className="figma-style1-background">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faad14e063d78407fb534dc6eacb5f6dd?format=webp&width=800"
            alt="กลุ่มผู้ได้รับประโยชน์"
            className="figma-style1-background-image"
          />
          <div className="figma-style1-background-overlay" />
        </div>

        {/* Main Content */}
        <div className="figma-style1-main">
          {/* Content Area */}
          <div className="figma-style1-content-area" style={{ paddingTop: "clamp(48px, 12vh, 160px)" }}>
            {/* Title with current priority */}
            <div className="figma-style1-title-container mb-6">
              <h1 className="figma-style1-title" style={{ color: '#000D59' }}>
                คุณคิดว่าใครควรได้รับประโยชน์จาก {currentPriority} ?
              </h1>
            </div>

            {/* Selection Grid - Same layout as original */}
            <div className="w-full max-w-[334px] mb-8">
              {/* Top Row */}
              <div className="flex justify-center items-start mb-8" style={{ gap: '24px' }}>
                {beneficiaryGroups.slice(0, 3).map((group) => {
                  const isSelected = selectedGroups.includes(group.id);
                  const isDisabled = isSelectionDisabled(group.id);

                  return (
                    <div
                      key={group.id}
                      className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105"
                      onClick={() => !isDisabled && handleGroupToggle(group.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      aria-disabled={isDisabled}
                      tabIndex={isDisabled ? -1 : 0}
                      onKeyDown={(e) => {
                        if (
                          (e.key === "Enter" || e.key === " ") &&
                          !isDisabled
                        ) {
                          e.preventDefault();
                          handleGroupToggle(group.id);
                        }
                      }}
                    >
                      {/* Circular Icon Background */}
                      <div
                        className={`w-[68px] h-[68px] rounded-full flex items-center justify-center mb-2 transition-all duration-200 ${
                          isSelected ? "bg-[#EFBA31]" : "bg-black"
                        }`}
                      >
                        <img
                          src={group.iconSrc}
                          alt={group.label}
                          className="w-[50px] h-[50px] object-contain"
                          style={{
                            filter: isSelected
                              ? "brightness(0)" // Black icons on yellow background
                              : "brightness(0) invert(1)", // White icons on black background
                          }}
                        />
                      </div>
                      {/* Label */}
                      <span
                        className={`font-prompt text-lg font-medium text-center transition-all duration-200 ${
                          isSelected ? "text-[#EFBA31]" : "text-[#000D59]"
                        }`}
                      >
                        {group.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Row */}
              <div className="flex justify-center items-start" style={{ gap: '24px' }}>
                {beneficiaryGroups.slice(3, 6).map((group) => {
                  const isSelected = selectedGroups.includes(group.id);
                  const isDisabled = isSelectionDisabled(group.id);

                  return (
                    <div
                      key={group.id}
                      className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105"
                      onClick={() => !isDisabled && handleGroupToggle(group.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      aria-disabled={isDisabled}
                      tabIndex={isDisabled ? -1 : 0}
                      onKeyDown={(e) => {
                        if (
                          (e.key === "Enter" || e.key === " ") &&
                          !isDisabled
                        ) {
                          e.preventDefault();
                          handleGroupToggle(group.id);
                        }
                      }}
                    >
                      {/* Circular Icon Background */}
                      <div
                        className={`w-[68px] h-[68px] rounded-full flex items-center justify-center mb-2 transition-all duration-200 ${
                          isSelected ? "bg-[#EFBA31]" : "bg-black"
                        }`}
                      >
                        <img
                          src={group.iconSrc}
                          alt={group.label}
                          className="w-[50px] h-[50px] object-contain"
                          style={{
                            filter: isSelected
                              ? "brightness(0)" // Black icons on yellow background
                              : "brightness(0) invert(1)", // White icons on black background
                          }}
                        />
                      </div>
                      {/* Label */}
                      <span
                        className={`font-prompt text-lg font-medium text-center transition-all duration-200 ${
                          isSelected ? "text-[#EFBA31]" : "text-[#000D59]"
                        }`}
                      >
                        {group.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selection Summary */}
            <div className="text-center mb-6">
              <p className="text-white font-prompt text-sm">
                เลือกแล้ว: {selectedGroups.length} จาก {maxSelections} กลุ่ม
              </p>
              {selectedGroups.length > 0 && (
                <p className="text-[#EFBA31] font-prompt text-xs mt-1">
                  {selectedGroups
                    .map(
                      (id) => beneficiaryGroups.find((g) => g.id === id)?.label,
                    )
                    .join(", ")}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="w-full max-w-[325px]">
              <button
                onClick={handleNext}
                disabled={selectedGroups.length === 0}
                className={`w-full h-[53px] rounded-[40px] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 ${
                  selectedGroups.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "figma-style1-button"
                }`}
                aria-describedby="next-button-description"
              >
                <span
                  className={`figma-style1-button-text ${
                    selectedGroups.length === 0 ? "text-gray-600" : ""
                  }`}
                >
                  {currentStep === totalPrioritySteps ? "ไปดูสรุป" : "ถัดไป"}
                </span>
              </button>

              {selectedGroups.length === 0 && (
                <div
                  id="next-button-description"
                  className="text-center text-white text-sm mt-2"
                >
                  กรุณาเลือกอย่างน้อย 1 กลุ่มเพื่อดำเนินการต่อ
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_Beneficiaries;
