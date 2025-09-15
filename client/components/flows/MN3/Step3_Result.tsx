/**
 * UK PACK - MN3 Step 3: Budget Result Display
 * Refactored to use FigmaStyle1Layout for consistent behavior
 */

import { useEffect, useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout";

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

const Step3_Result = ({ sessionID, onNext, onBack, journeyData }: Step3_ResultProps) => {
  const [resultSummary, setResultSummary] = useState<ResultSummary[]>([]);

  const priorityIcons: { [key: string]: string } = {
    ลดค่าโดยสารรถไฟฟ้า: "🚇",
    ปร���บปรุงคุณภาพรถเมล์: "🚌",
    ตั๋วร่วม: "🎫",
    เพิ่มความถี่รถเมล์: "🚍",
    เพิ่มความถี่รถไฟฟ้า: "🚊",
    เพิ่มที่จอดรถ: "🅿️",
    "เพิ่ม Feeder ในซอย": "🚐",
  };

  useEffect(() => {
    const allocationData = journeyData?.budget_step2_allocation?.budgetAllocation || {};
    const selectedPriorities = journeyData?.budget_step2_allocation?.selectedPriorities || [];
    const totalBudget = 100;

    const summary: ResultSummary[] = selectedPriorities.map((priority: string) => ({
      priority,
      allocation: allocationData[priority] || 0,
      percentage: ((allocationData[priority] || 0) / totalBudget) * 100,
      icon: priorityIcons[priority] || "📋",
    }));

    summary.sort((a, b) => b.allocation - a.allocation);
    setResultSummary(summary);
  }, [journeyData]);

  const handleYes = () => {
    logEvent({
      event: "MINIGAME_MN3_COMPLETE",
      payload: {
        top3Choices: journeyData?.budget_step1_choice?.top3BudgetChoices || [],
        budgetAllocation: journeyData?.budget_step2_allocation?.budgetAllocation || {},
        resultSummary,
        satisfaction: "ใ���่",
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
    logEvent({
      event: "MINIGAME_MN3_COMPLETE",
      payload: {
        top3Choices: journeyData?.budget_step1_choice?.top3BudgetChoices || [],
        budgetAllocation: journeyData?.budget_step2_allocation?.budgetAllocation || {},
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

  const backgroundImage = "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F44cf16d8ccf64321b16d01722cbc8356?format=webp&width=1500";

  return (
    <FigmaStyle1Layout
      backgroundImage={backgroundImage}
      title={"จากงบประมาณของคุณ\nนี้คือสิ่งที่จะเกิดขึ้นในอนาคต"}
      buttons={[
        { text: "ใช่", onClick: handleYes, ariaLabel: "ตอบใช่ - พอใจกับผลลัพธ์" },
        { text: "ไม่ใช่", onClick: handleNo, ariaLabel: "ตอบไม่ใช่ - ไม่พอใจกับผลลัพธ���" },
      ]}
      className="mn3-result-page"
      useBlueOverlay={false}
    >
      {/* Illustration */}
      <div className="w-full px-4 mb-8 flex justify-center">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/40ffac7fde4a30bb13050c151fbeed8c7c4fae41?width=1500"
          alt="Transport policy outcomes illustration"
          className="mn3-result-image"
        />
      </div>

      {/* Question subtitle */}
      <div className="text-center w-full max-w-none px-4 mb-8">
        <h2 className="font-prompt text-center leading-normal mn3-result-subtitle">คุณพอใจหรือไม่</h2>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step3_Result;
