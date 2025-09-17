/**
 * UK PACK - MN3 Step 3: Budget Result Display
 * Refactored to use FigmaStyle1Layout for consistent behavior
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [resultSummary, setResultSummary] = useState<ResultSummary[]>([]);
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);

  const priorityIcons: { [key: string]: string } = {
    "ลดค่าโดยสารรถไฟฟ้า": "🚇",
    "ปรับปรุงคุณภาพรถเมล์": "🚌",
    "ตั๋วร่วม": "🎫",
    "เพิ่มความถี่รถเมล์": "🚍",
    "เพิ่มความถี่รถไฟฟ้า": "🚊",
    "เพิ่มที่จอดรถ": "🅿️",
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
    setSelected("yes");

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

    proceedAfterSelect("/ukpack1/fake-news", data);
  };

  const handleNo = () => {
    setSelected("no");

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

    proceedAfterSelect("/ukpack1/ask05", data);
  };

  const backgroundImage =
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F185e56314d8041d09e93ab98fd2502dd?format=webp&width=1500";

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box', background: 'transparent' }}>
      <div style={{ textAlign: 'center', width: '100%', marginBottom: 16 }}>
        <h1 style={{ color: '#000D59', margin: 0, fontSize: 'clamp(20px, 4.5vw, 32px)', lineHeight: 1.15, fontWeight: 700 }}>
          จากงบประมาณของคุณ
          <br />
          นี่คือสิ่งที่จะเกิดขึ้นในอนาคต
        </h1>
      </div>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff663e24f6aaf435b835af863ed8b00b8?format=webp&width=1200"
          alt="Mockup"
          style={{ maxWidth: '94vw', maxHeight: '60vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}
        />
      </div>

      <div style={{ textAlign: 'center', width: '100%', marginTop: 20 }}>
        <h2 style={{ color: '#000D59', marginBottom: 12 }}>คุณพอใจหรือไม่</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', width: '100%', maxWidth: 360, margin: '0 auto' }}>
          <button onClick={handleYes} aria-pressed={selected === 'yes'} style={{ width: '100%', padding: '14px', borderRadius: 28, background: '#FFE000', border: 'none', fontWeight: 600 }}>ใช่</button>
          <button onClick={handleNo} aria-pressed={selected === 'no'} style={{ width: '100%', padding: '14px', borderRadius: 28, background: '#FFE000', border: 'none', fontWeight: 600 }}>ไม่ใช่</button>
        </div>
      </div>
    </div>
  );
};

export default Step3_Result;
