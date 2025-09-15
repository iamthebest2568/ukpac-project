/**
 * UK PACK - MN3 Step 3: Budget Result Display
 * Refactored to use FigmaStyle1Layout for consistent behavior
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [resultSummary, setResultSummary] = useState<ResultSummary[]>([]);
  const [selected, setSelected] = useState<'yes' | 'no' | null>(null);

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

  const proceedAfterSelect = (route: string, data: any) => {
    // keep a short delay so user sees selected state change before navigation
    setTimeout(() => {
      try {
        onNext(data);
      } catch (e) {}
      navigate(route);
    }, 140);
  };

  const handleYes = () => {
    setSelected('yes');

    logEvent({
      event: "MINIGAME_MN3_COMPLETE",
      payload: {
        top3Choices: journeyData?.budget_step1_choice?.top3BudgetChoices || [],
        budgetAllocation: journeyData?.budget_step2_allocation?.budgetAllocation || {},
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

    proceedAfterSelect('/ukpack1/fake-news', data);
  };

  const handleNo = () => {
    setSelected('no');

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

    proceedAfterSelect('/ukpack1/ask05', data);
  };

  const backgroundImage = "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F733fd61d7f8e4a3ebfc2f76078fff7ee?format=webp&width=1500";

  return (
    <FigmaStyle1Layout
      backgroundImage={backgroundImage}
      buttons={[]}
      className="mn3-result-page"
      useBlueOverlay={false}
    >
      <div className="figma-style1-title-container">
        <h1 className="figma-style1-title" style={{ color: '#000D59' }}>
          จากงบประมาณของคุณ<br />
          นี้คือสิ่งที่จะเกิดขึ้นในอนาคต
        </h1>
      </div>

      {/* Result summary list (icon-focused, no charts) */}
      <div className="mn3-summary-list w-full px-4 mb-4">
        {resultSummary && resultSummary.length > 0 ? (
          resultSummary.map((item, idx) => {
            const colorClass = idx === 0 ? 'mn3-summary-card--green' : idx === 1 ? 'mn3-summary-card--yellow' : 'mn3-summary-card--red';
            return (
              <div key={item.priority} className={`mn3-summary-card ${colorClass} mb-3`}>
                <div className="mn3-summary-card-left">
                  <div className="mn3-summary-icon" aria-hidden>
                    {item.icon}
                  </div>
                </div>
                <div className="mn3-summary-card-body">
                  <div className="mn3-summary-card-title">{item.priority}</div>
                  <div className="mn3-summary-card-meta">
                    <span className="mn3-summary-amount">{item.allocation}</span>
                    <span className="mn3-summary-percent"> ({Math.round(item.percentage)}%)</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : null}
      </div>

      <div className="text-center w-full max-w-none px-4 mb-6">
        <h2 className="figma-style1-subtitle" style={{ color: '#000D59' }}>คุณพอใจหรือไม่</h2>
      </div>

      <div className="figma-style1-button-container">
        <button
          onClick={handleYes}
          className={`figma-style1-button ${selected === 'yes' ? 'figma-style1-button--selected' : ''}`}
          aria-label="ตอบใช่ - พอใจกับผลลัพธ์"
          aria-pressed={selected === 'yes'}
        >
          <span className="figma-style1-button-text">ใช่</span>
        </button>

        <button
          onClick={handleNo}
          className={`figma-style1-button ${selected === 'no' ? 'figma-style1-button--selected' : ''}`}
          aria-label="ตอบไม่ใช่ - ไม่พอใจกับผลลัพธ์"
          aria-pressed={selected === 'no'}
        >
          <span className="figma-style1-button-text">ไม่ใช่</span>
        </button>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step3_Result;
