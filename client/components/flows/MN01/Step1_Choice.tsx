/**
 * UK PACK - MN01 Step 1: Budget Choice Selection (cloned from MN3)
 */

import { useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";
import "../../../styles/mn3-buttons.css";
import "../../../styles/minigame-mn1-overrides.css";

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

  // Define priorities exactly as in Figma design
  const priorityList = [
    "ลดค่าโดยสารรถไฟฟ้า",
    "เพิ่มความถี่รถไฟฟ้า",
    "ตั๋วร่วม",
    "เพิ่มความถี่รถเมล์",
    "ปรับปรุงคุณภาพรถเมล์",
    "เพิ่มที่จอดรถ",
    "เพิ่มรถเล็กเชื่อมต่อรถไฟฟ้าในซอย",
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
        event: "MN01_SELECT",
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
    "เพิ่มความถี่รถเมล์",
  ]);

  const getButtonClasses = (priority: string, index: number) => {
    let classes = "mn3-policy-button";

    // Add specific width class based on button position
    classes += ` mn3-policy-button--choice-${index + 1}`;

    if (selectedPriorities.includes(priority)) {
      classes += " mn3-policy-button--selected";
    } else if (defaultYellowButtons.has(priority)) {
      classes += " mn3-policy-button--yellow";
    }

    return classes;
  };

  const renderPolicyButton = (priority: string, index: number) => (
    <button
      key={priority}
      onPointerUp={() =>
        !isSelectionDisabled(priority) && handlePriorityToggle(priority)
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!isSelectionDisabled(priority)) handlePriorityToggle(priority);
        }
      }}
      disabled={isSelectionDisabled(priority)}
      className={getButtonClasses(priority, index)}
      aria-label={`เลือกนโยบาย: ${priority}`}
    >
      <span className="mn3-button-text">{priority}</span>
    </button>
  );

  return (
    <div className="w-full min-h-screen mn3-page-bg flex flex-col items-center justify-start relative">
      {/* Main Content Container */}
      <div className="mn3-content">
        {/* Title Section - Optimized for mobile readability */}
        <div
          className="text-center w-full max-w-none px-4"
          style={{ marginTop: "clamp(32px, 8vh, 120px)" }}
        >
          <h1
            className="font-prompt text-center leading-normal mb-4"
            style={{
              color: "#000D59",
              fontSize: "clamp(24px, 6vw, 48px)",
              lineHeight: "1.2",
              fontWeight: 700,
              width: "100%",
              margin: "0 auto 16px auto",
            }}
          >
            คุณคิดว่าควรใช้เงินที่ได้
            <br />
            จากการเก็บไปพัฒนาอะไร
          </h1>
          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <p style={{ color: "#000D59", fontSize: "16px", margin: 0 }}>
              ไม่เกิน 3 นโยบาย
            </p>
          </div>
        </div>

        {/* Policy Options - Improved Grid Layout */}
        <div className="mn3-button-grid">
          {/* Row 1: Two longer options */}
          <div className="mn3-button-row">
            {renderPolicyButton(priorityList[0], 0)}
            {renderPolicyButton(priorityList[1], 1)}
          </div>

          {/* Row 2: Three medium/short options */}
          <div className="mn3-button-row">
            {renderPolicyButton(priorityList[2], 2)}
            {renderPolicyButton(priorityList[3], 3)}
            {renderPolicyButton(priorityList[4], 4)}
          </div>

          {/* Row 3: Two longer options */}
          <div className="mn3-button-row">
            {renderPolicyButton(priorityList[5], 5)}
            {renderPolicyButton(priorityList[6], 6)}
          </div>
        </div>

        {/* Continue Button - displayed directly below the options */}
        <div className="w-full px-4 mt-4 flex justify-center">
          <div
            className="mx-auto flex flex-col items-center space-y-2"
            style={{ width: "100%", maxWidth: 980, marginTop: "-10px" }}
          >
            <button
              onClick={handleNext}
              className="mn3-continue-button"
              aria-label="ดำเนินการต่อไปยังขั้นตอนถัดไป"
            >
              ไปต่อ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_Choice;
