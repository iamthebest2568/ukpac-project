/**
 * UK PACK - MN3 Step 3: Budget Result Display
 * Updated to match Figma design exactly
 */

import { useEffect, useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";

interface Step3_ResultProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
}

interface ResultSummary {
  priority: string;
  allocation: number;
  percentage: number;
  icon: string;
}

const Step3_Result = ({
  sessionID,
  onNext,
  onBack,
  journeyData,
}: Step3_ResultProps) => {
  const [resultSummary, setResultSummary] = useState<ResultSummary[]>([]);

  // Icons mapping for priorities
  const priorityIcons: { [key: string]: string } = {
    ลดค่าโดยสารรถไฟฟ้า: "🚇",
    ปรับปรุงคุณภาพรถเมล์: "🚌",
    ตั๋วร่วม: "🎫",
    เพิ่มความถี่รถเมล์: "🚍",
    เพิ่มความถี่รถไฟฟ้า: "🚊",
    เพิ่มที่จอดรถ: "🅿️",
    "เพิ่ม Feeder ในซอย": "🚐",
  };

  useEffect(() => {
    // Get data from the previous step
    const allocationData =
      journeyData?.budget_step2_allocation?.budgetAllocation || {};
    const selectedPriorities =
      journeyData?.budget_step2_allocation?.selectedPriorities || [];
    const totalBudget = 100;

    // Create summary with percentages
    const summary: ResultSummary[] = selectedPriorities.map(
      (priority: string) => ({
        priority,
        allocation: allocationData[priority] || 0,
        percentage: ((allocationData[priority] || 0) / totalBudget) * 100,
        icon: priorityIcons[priority] || "📋",
      }),
    );

    // Sort by allocation amount (highest first)
    summary.sort((a, b) => b.allocation - a.allocation);
    setResultSummary(summary);
  }, [journeyData]);

  const handleYes = () => {
    // Log the complete MN3 minigame with satisfaction = Yes
    logEvent({
      event: "MINIGAME_MN3_COMPLETE",
      payload: {
        top3Choices: journeyData?.budget_step1_choice?.top3BudgetChoices || [],
        budgetAllocation:
          journeyData?.budget_step2_allocation?.budgetAllocation || {},
        resultSummary,
        satisfaction: "ใช่",
        sessionID,
      },
    });

    const data = {
      budget_step3_result: {
        budgetResultReviewed: true,
        satisfaction: "ใช่",
        resultSummary,
      },
    };

    // Try beacon logging
    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "MN3_RESULT",
        payload: { satisfaction: "ใช่", resultSummary },
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

  const handleNo = () => {
    // Log the complete MN3 minigame with satisfaction = No
    logEvent({
      event: "MINIGAME_MN3_COMPLETE",
      payload: {
        top3Choices: journeyData?.budget_step1_choice?.top3BudgetChoices || [],
        budgetAllocation:
          journeyData?.budget_step2_allocation?.budgetAllocation || {},
        resultSummary,
        satisfaction: "ไม่ใช่",
        sessionID,
      },
    });

    const data = {
      budget_step3_result: {
        budgetResultReviewed: true,
        satisfaction: "ไม่ใช่",
        resultSummary,
      },
    };

    // Try beacon logging
    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "MN3_RESULT",
        payload: { satisfaction: "ไม่ใช่", resultSummary },
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
    <div className="w-full min-h-screen mn3-result-bg figma-style1-main relative">
      <div className="mn3-result-content figma-style1-content-area">
        {/* Title Section */}
        <div className="text-center w-full max-w-none px-4 mb-6">
          <h1
            className="font-prompt text-center leading-normal"
            style={{
              color: '#000D59',
              fontSize: 'clamp(28px, 5.5vw, 60px)',
              lineHeight: '1.2',
              fontWeight: 700,
              width: '100%',
              margin: '0 auto'
            }}
          >
            จากงบประมาณของคุณ<br />
            นี้คือสิ่งที่จะเกิดขึ้นในอนาคต
          </h1>
        </div>

        {/* Transport Illustration */}
        <div className="w-full px-4 mb-8 flex justify-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/40ffac7fde4a30bb13050c151fbeed8c7c4fae41?width=1500"
            alt="Transport policy outcomes illustration"
            className="mn3-result-image"
          />
        </div>

        {/* Question Section */}
        <div className="text-center w-full max-w-none px-4 mb-8">
          <h2
            className="font-prompt text-center leading-normal"
            style={{
              color: '#000D59',
              fontSize: 'clamp(28px, 5.5vw, 60px)',
              lineHeight: '1.2',
              fontWeight: 700,
              width: '100%',
              margin: '0 auto'
            }}
          >
            คุณพอใจหรือไม่
          </h2>
        </div>
        {/* Response Buttons - use design-system button classes for consistent appearance */}
        <div className="figma-style1-button-container">
          <button onClick={handleYes} className="figma-style1-button" aria-label="ตอบใช่ - พอใจกับผลลัพธ์">
            <span className="figma-style1-button-text">ใช่</span>
          </button>

          <button onClick={handleNo} className="figma-style1-button" aria-label="ตอบไม่ใช่ - ไม่พอใจกับผลลัพธ์">
            <span className="figma-style1-button-text">ไม่ใช่</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3_Result;
