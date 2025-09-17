/**
 * UK PACK - MN2 Step 1: Beneficiaries Selection
 * Now shows one priority question per page for better UX
 */

import { useState, useEffect } from "react";
import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout";

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
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F2ec46a7af92d4823b0f7a3811d503497?format=webp&width=100",
    },
    {
      id: "locals",
      label: "คนในพื้นที่",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F80dacf98db464f3ab5ee072638adeab3?format=webp&width=100",
    },
    {
      id: "elderly",
      label: "ผู้สูง��า���ุ",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F27d0ed309a3847dcbb81fc45f1a01235?format=webp&width=100",
    },
    {
      id: "students",
      label: "นักเรียนนักศึกษา",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbb5f14f791d7491184a2c2f0f5f44c34?format=webp&width=100",
    },
    {
      id: "disabled",
      label: "คนพิการ",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe7622c6277264a06b3b7f875af1a342a?format=webp&width=100",
    },
    {
      id: "other",
      label: "อื่นๆ",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F11dc2218b328411c8cf995f911ba9055",
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

  const titleText = currentPriority === 'ลดค่าโดยสารรถไฟฟ้า'
    ? 'คุณคิดว่าใครควรได้รับ  การลดค่าโดยสารรถไฟฟ้าบ้าง'
    : `คุณคิดว่าใครควรได้รับประโยชน์จาก ${currentPriority} ?`;

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Faad14e063d78407fb534dc6eacb5f6dd?format=webp&width=800"
      className="mn2-step1-page"
      imageLoading="eager"
      title={<span style={{ color: "#000D59" }}>{titleText}</span>}
    >
      {/* Content Area (selection grid & button) */}
      <div className="w-full max-w-[334px] mb-8">
        {/* Top Row */}
        <div className="flex justify-center items-center mb-4" style={{ gap: "16px" }}>
          {beneficiaryGroups.slice(0, 3).map((group) => {
            const isSelected = selectedGroups.includes(group.id);
            const isDisabled = isSelectionDisabled(group.id);

            return (
              <div
                key={group.id}
                className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105 w-[92px] flex-shrink-0"
                onClick={() => !isDisabled && handleGroupToggle(group.id)}
                role="checkbox"
                aria-checked={isSelected}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
                    e.preventDefault();
                    handleGroupToggle(group.id);
                  }
                }}
              >
                  <div className={`w-[68px] h-[68px] mb-2 flex items-center justify-center ${isSelected ? 'rounded-full bg-[#EFBA31]' : ''}`}>
                  <img src={group.iconSrc} alt={group.label} className="w-[68px] h-[68px] object-contain" />
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Row */}
        <div className="flex justify-center items-center" style={{ gap: "24px" }}>
          {beneficiaryGroups.slice(3, 6).map((group) => {
            const isSelected = selectedGroups.includes(group.id);
            const isDisabled = isSelectionDisabled(group.id);

            return (
              <div
                key={group.id}
                className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105 w-[92px] flex-shrink-0"
                onClick={() => !isDisabled && handleGroupToggle(group.id)}
                role="checkbox"
                aria-checked={isSelected}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
                    e.preventDefault();
                    handleGroupToggle(group.id);
                  }
                }}
              >
                  <div className={`w-[68px] h-[68px] mb-2 flex items-center justify-center ${isSelected ? 'rounded-full bg-[#EFBA31]' : ''}`}>
                  <img src={group.iconSrc} alt={group.label} className="w-[68px] h-[68px] object-contain" />
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Selection Summary */}
      <div className="text-center mb-6">
        <p className="text-white font-prompt text-sm">เลือกแล้ว: {selectedGroups.length} จาก {maxSelections} กลุ่ม</p>
        {selectedGroups.length > 0 && (
          <p className="text-[#EFBA31] font-prompt text-xs mt-1">
            {selectedGroups
              .map((id) => beneficiaryGroups.find((g) => g.id === id)?.label)
              .join(", ")}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="w-full max-w-[325px]">
        <button
          onClick={handleNext}
          disabled={selectedGroups.length === 0}
          className={`w-full h-[53px] rounded-[40px] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 ${selectedGroups.length === 0 ? "bg-gray-400 cursor-not-allowed" : "figma-style1-button"}`}
          aria-describedby="next-button-description"
        >
          <span className={`figma-style1-button-text ${selectedGroups.length === 0 ? "text-gray-600" : ""}`}>
            ไปต่อ
          </span>
        </button>

        {selectedGroups.length === 0 && (
          <div id="next-button-description" className="text-center text-white text-sm mt-2">กรุณาเลือกอย่างน้อย 1 กลุ่มเพื่อดำเนินการต่อ</div>
        )}
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step1_Beneficiaries;
