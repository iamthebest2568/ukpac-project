/**
 * UK PACK - MN2 Step 1: Beneficiaries Selection
 * Now shows one priority question per page for better UX
 */

import { useState, useEffect } from "react";
import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout.ukpack1";
import Uk1Button from "../../shared/Uk1Button";

interface Step1_BeneficiariesProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  currentPriority: string;
  currentStep: number;
  totalPrioritySteps: number;
  initialBeneficiaries?: string[];
  useUk1Button?: boolean;
}

const Step1_Beneficiaries = ({
  sessionID,
  onNext,
  onBack,
  currentPriority,
  currentStep,
  totalPrioritySteps,
  initialBeneficiaries = [],
  useUk1Button = false,
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
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F6510b478762447b1be81ffa3233d065c?format=webp&width=100",
      iconSelectedSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F1a6c0c50b73f4a6c8b4f30323b386a7b?format=webp&width=100",
    },
    {
      id: "locals",
      label: "คนในพื้นที่",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fd3840fbb73394facb800bcd2ffe94cfd?format=webp&width=800",
      iconSelectedSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9cb3d08206eb4d13a2883d4578700660?format=webp&width=800",
    },
    {
      id: "elderly",
      label: "ผู้สูงอายุ",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc8b4a544d5b8448abed20368aeb08f90?format=webp&width=800",
      iconSelectedSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc44980fda71d41d9bd9a26bed252f944?format=webp&width=800",
    },
    {
      id: "students",
      label: "นักเรียนนักศึกษา",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcef48bc6c6e5483bae9209eef3c44cb3?format=webp&width=800",
      iconSelectedSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff7480943e6b7495d8307dc7e1591b5e6?format=webp&width=800",
    },
    {
      id: "disabled",
      label: "คนพิการ",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F39f620cc58934029a1b2aa4389ad6db4?format=webp&width=800",
      iconSelectedSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fd832a120f8c647c4b252b1cd19b13577?format=webp&width=800",
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

  const titleText =
    currentPriority === "ลดค่าโดยสารรถไฟฟ้า"
      ? "คุณคิดว่าใครควรได้รับการลดค่า���ดยสารรถไฟฟ้าบ้าง"
      : `คุณคิดว่าใครควรได้รับประโยชน์จาก ${currentPriority}`;

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F27759edd1f334fba98515ddd5c397f69?format=webp&width=800"
      className="ask04-page mn2-step1-page figma-style1-ukpack1"
      imageLoading="eager"
      title={<span style={{ color: "#000D59" }}>{titleText}</span>}
    >
      {/* Content Area (selection grid & button) */}
      <div className="w-full max-w-[334px] mb-8">
        {/* Top Row */}
        <div
          className="flex justify-center items-center mb-2"
          style={{ gap: "8px" }}
        >
          {beneficiaryGroups.slice(0, 3).map((group) => {
            const isSelected = selectedGroups.includes(group.id);
            const isDisabled = isSelectionDisabled(group.id);

            return (
              <div
                key={group.id}
                className="flex flex-col items-center cursor-pointer w-[110px] flex-shrink-0"
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
                <div
                  className={`w-[84px] h-[84px] mb-2 flex items-center justify-center`}
                >
                  <img
                    src={
                      isSelected
                        ? group.iconSelectedSrc || group.iconSrc
                        : group.iconSrc
                    }
                    alt={group.label}
                    className="w-[84px] h-[84px] object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Row */}
        <div
          className="flex justify-center items-center"
          style={{ gap: "8px" }}
        >
          {beneficiaryGroups.slice(3, 6).map((group) => {
            const isSelected = selectedGroups.includes(group.id);
            const isDisabled = isSelectionDisabled(group.id);

            return (
              <div
                key={group.id}
                className="flex flex-col items-center cursor-pointer w-[110px] flex-shrink-0"
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
                <div
                  className={`w-[84px] h-[84px] mb-2 flex items-center justify-center`}
                >
                  <img
                    src={
                      isSelected
                        ? group.iconSelectedSrc || group.iconSrc
                        : group.iconSrc
                    }
                    alt={group.label}
                    className="w-[84px] h-[84px] object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="figma-style1-button-container w-full max-w-[325px]">
        {useUk1Button ? (
          <Uk1Button
            onClick={handleNext}
            disabled={selectedGroups.length === 0}
            className={
              selectedGroups.length === 0 ? "cursor-not-allowed opacity-60" : ""
            }
            style={{ width: "100%", height: "53px" }}
          >
            <span className={`figma-style1-button-text`}>ไปต่อ</span>
          </Uk1Button>
        ) : (
          <button
            onClick={handleNext}
            disabled={selectedGroups.length === 0}
            className={`w-full h-[53px] rounded-[40px] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 figma-style1-button ${selectedGroups.length === 0 ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <span className={`figma-style1-button-text`}>ไปต่อ</span>
          </button>
        )}
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step1_Beneficiaries;
