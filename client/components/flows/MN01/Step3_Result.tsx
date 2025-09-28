/**
 * UK PACK - MN01 Step 3: Budget Result Display (cloned from MN3)
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout.ukpack1";
import Uk1Button from "../../shared/Uk1Button";

interface Step3_ResultProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
  useUk1Button?: boolean;
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
  useUk1Button = false,
}: Step3_ResultProps) => {
  const navigate = useNavigate();
  const [resultSummary, setResultSummary] = useState<ResultSummary[]>([]);

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
    const allocationData =
      journeyData?.budget_step2_allocation?.budgetAllocation || {};
    const selectedPriorities =
      journeyData?.budget_step2_allocation?.selectedPriorities || [];
    const totalBudget = 100;

    const summary: ResultSummary[] = selectedPriorities.map(
      (priority: string) => ({
        priority,
        allocation: allocationData[priority] || 0,
        percentage: ((allocationData[priority] || 0) / totalBudget) * 100,
        icon: priorityIcons[priority] || "📋",
      }),
    );

    summary.sort((a, b) => b.allocation - a.allocation);
    setResultSummary(summary);
  }, [journeyData]);

  const handleYes = () => {
    logEvent({
      event: "MINIGAME_MN01_COMPLETE",
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

    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "MN01_RESULT",
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
    // Navigate to fake-news after recording result
    navigate("/beforecitychange/fake-news");
  };

  const handleNo = () => {
    logEvent({
      event: "MINIGAME_MN01_COMPLETE",
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

    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "MN01_RESULT",
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
    // Navigate to ask05 after recording result
    navigate("/beforecitychange/ask05");
  };

  const backgroundImage =
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F733fd61d7f8e4a3ebfc2f76078fff7ee?format=webp&width=1500";

  return (
    <FigmaStyle1Layout
      backgroundImage={backgroundImage}
      buttons={[
        {
          text: "ใช่",
          onClick: handleYes,
          ariaLabel: "ตอบใช่ - พอใจกับผลลัพธ์",
        },
        {
          text: "ไม่ใช่",
          onClick: handleNo,
          ariaLabel: "ตอบไม่ใช่ - ไม่พอใจกับผลลัพธ์",
        },
      ]}
      className="mn3-result-page figma-style1-ukpack1 minigame-mn1-page"
      useBlueOverlay={false}
    >
      {/* Title (use layout's title container for consistent styling) */}
      <div className="figma-style1-title-container">
        <h1 className="figma-style1-title" style={{ color: "#000D59" }}>
          จากงบประมาณของคุณ
          <br />
          นี้คือสิ่งที่จะเกิดขึ้นในอนาคต
        </h1>
      </div>

      {/* Illustration */}
      <div className="w-full px-4 mb-6 flex justify-center">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/40ffac7fde4a30bb13050c151fbeed8c7c4fae41?width=1500"
          alt="Transport policy outcomes illustration"
          className="mn3-result-image"
        />
      </div>

      {/* Question subtitle */}
      <div className="text-center w-full max-w-none px-4 mb-6">
        <h2 className="figma-style1-subtitle" style={{ color: "#000D59" }}>
          คุณพอใจหรือไม่
        </h2>
      </div>

      {/* Buttons included in children so they show when custom children are used */}
      <div className="figma-style1-button-container">
        {useUk1Button ? (
          <>
            <Uk1Button onClick={handleYes} aria-label="ตอบใช่ - พอใจกับผลลัพธ์">
              <span className="figma-style1-button-text">ใช่</span>
            </Uk1Button>
            <Uk1Button
              onClick={handleNo}
              aria-label="ตอบไม่ใช่ - ไม่พอใจกับผลลัพธ์"
            >
              <span className="figma-style1-button-text">ไม่ใช่</span>
            </Uk1Button>
          </>
        ) : (
          <>
            <button
              onClick={handleYes}
              className="figma-style1-button"
              aria-label="ตอบใช่ - พอใจกับผลลัพธ์"
            >
              <span className="figma-style1-button-text">ใช่</span>
            </button>

            <button
              onClick={handleNo}
              className="figma-style1-button"
              aria-label="ตอบไม่ใช่ - ไม่พอใจกับผลลัพธ์"
            >
              <span className="figma-style1-button-text">ไม่ใช่</span>
            </button>
          </>
        )}
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step3_Result;
