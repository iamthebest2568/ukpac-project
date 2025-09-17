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
    ลดค่าโดยสารรถไฟฟ้า: "🚇",
    ปรับปรุงคุณภาพรถเมล์: "🚌",
    ตั๋วร่วม: "🎫",
    เพิ่มความถี่รถเมล์: "🚍",
    เพิ่มความถี่รถไฟฟ้า: "🚊",
    เพิ่มที่จอดรถ: "🅿️",
    "เพิ่ม Feeder ในซอย": "🚐",
  };

  // Map priorities to illustrative images (attachments provided)
  const priorityImageMap: { [key: string]: string } = {
    "ตั๋วร่วม": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F2f0106ff48a44f03b71429502944e9f2?format=webp&width=720",
    "เพิ่มที่จอดรถ": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F79ac3a2ac5e84e88b4015fd66aaebe04?format=webp&width=720",
    "เพิ่มความถี่รถไฟฟ้า": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fd90beaca642d4cceba685d933aeb644f?format=webp&width=720",
    "ปรับปรุงคุณภาพรถเมล์": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F602cfdd852a147ed852d50b2ed05772d?format=webp&width=720",
    "เพิ่มความถี่รถเมล์": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4e921e92e2c44db7a2ad24ee299e9a6d?format=webp&width=720",
    "เพิ่ม Feeder ในซอย": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbb907b894b5a44b3bde47b685f00caca?format=webp&width=720",
    "ลดค่าโดยสารรถไฟฟ้า": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F902c640032bd41f3b30e4ce96330d938?format=webp&width=720",
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

  // Use empty backgroundImage to avoid decorative background while keeping layout structure
  const backgroundImage = "";

  return (
    <FigmaStyle1Layout
      backgroundImage={backgroundImage}
      className="mn3-step3-page figma-style1-ukpack1 fake-news-page"
      imageLoading="eager"
      title={"จากงบประมาณของคุณ นี่คือสิ่งที่จะเกิดขึ้นในอนาคต"}
    >
      {/* Minimal content -- only elements required for flow and logic */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {/* Intentionally empty: removed decorative mockup image */}
      </div>

      <div style={{ textAlign: "center", width: "100%", marginTop: 20 }}>
        <h2 style={{ marginBottom: 12 }}>คุณพอใจหรือไม่</h2>

        <div className="figma-style1-button-container" style={{ width: "100%", maxWidth: 360, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={handleYes}
            aria-pressed={selected === "yes"}
            className="figma-style1-button"
            style={{ width: "100%" }}
          >
            <span className="figma-style1-button-text">ใช่</span>
          </button>

          <button
            onClick={handleNo}
            aria-pressed={selected === "no"}
            className="figma-style1-button"
            style={{ width: "100%" }}
          >
            <span className="figma-style1-button-text">ไม่ใช่</span>
          </button>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step3_Result;
