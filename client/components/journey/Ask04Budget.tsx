import { useEffect, useState } from "react";
import { logEvent } from "../../services/dataLogger.js";
import FigmaStyle1Layout from "../layouts/FigmaStyle1Layout";

interface Ask04BudgetProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData?: any;
}

interface ResultSummary {
  priority: string;
  allocation: number;
  percentage: number;
  icon: string;
}

const Ask04Budget = ({
  sessionID,
  onNavigate,
  journeyData,
}: Ask04BudgetProps) => {
  const [resultSummary, setResultSummary] = useState<ResultSummary[]>([]);

  const handleChoice = (choice: "satisfied" | "unsatisfied") => {
    const choiceText = {
      satisfied: "พอใจ",
      unsatisfied: "ไม่พอใจ",
    }[choice];

    const data = { choice, choiceText };

    // Log the satisfaction choice (for MN3 path)
    logEvent({
      event: "SATISFACTION_CHOICE",
      payload: {
        choice: choiceText,
        choiceKey: choice,
        path: "MN3",
        sessionID,
      },
    });

    if (choice === "satisfied") {
      onNavigate("fakeNews", data);
    } else {
      onNavigate("ask05", data);
    }
  };

  // Define buttons for the FigmaStyle1Layout (we'll render them inside children)
  const buttons = [
    {
      text: "พอใจ",
      onClick: () => handleChoice("satisfied"),
      ariaLabel: "พอใจกับผลลัพธ์ที่ได้จากการตอบคำถาม",
    },
    {
      text: "ไม่พอใจ",
      onClick: () => handleChoice("unsatisfied"),
      ariaLabel: "ไม่พอใจกับผลลัพธ์และต้องการให้ข้อเสนอแนะ",
    },
  ];

  // Reuse the same mappings from Step3_Result to render the collage here
  const priorityIcons: { [key: string]: string } = {
    ลดค่าโดยสารรถไฟฟ้า: "🚇",
    ปรับปรุงคุณภาพรถเมล์: "🚌",
    ตั๋วร่วม: "🎫",
    เพิ่มความถี่รถเมล์: "🚍",
    เพิ่มความถี่รถไฟฟ้า: "🚊",
    เพิ่มที่จอดรถ: "🅿️",
    "เพิ่ม Feeder ในซอย": "🚐",
  };

  const priorityImageMap: { [key: string]: string } = {
    ตั๋วร่วม:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F2f0106ff48a44f03b71429502944e9f2?format=webp&width=720",
    เพิ่มที่จอดรถ:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F79ac3a2ac5e84e88b4015fd66aaebe04?format=webp&width=720",
    เพิ่มความถี่รถไฟฟ้า:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fd90beaca642d4cceba685d933aeb644f?format=webp&width=720",
    ปรับปรุงคุณภาพรถเมล์:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F602cfdd852a147ed852d50b2ed05772d?format=webp&width=720",
    เพิ่มความถี่รถเมล์:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4e921e92e2c44db7a2ad24ee299e9a6d?format=webp&width=720",
    "เพิ่ม Feeder ในซอย":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbb907b894b5a44b3bde47b685f00caca?format=webp&width=720",
    ลดค่าโดยสารรถไฟฟ้า:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F902c640032bd41f3b30e4ce96330d938?format=webp&width=720",
  };

  const collageOffsets = [
    { left: "8%", top: "0%", rotate: "-6deg", z: 1, scale: 0.98 },
    { left: "30%", top: "6%", rotate: "6deg", z: 2, scale: 1 },
    { left: "52%", top: "-6%", rotate: "-2deg", z: 3, scale: 0.94 },
  ];

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

  return (
    <FigmaStyle1Layout
      title={`คุณพอใจภาพเมืองในอนาคตที่อาจจะเกิดขึ้นหรือไม่`}
      className="ask04-budget-page"
    >
      {/* Children: collage + buttons (we render buttons here because providing children disables automatic button rendering) */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {/* Collage container */}
        <div
          className="max-w-[980px] w-full px-4"
          style={{ height: 420, display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <div className="relative w-full" style={{ maxWidth: 980, height: 420 }}>
            {resultSummary.map((s, i) => {
              const imgSrc = priorityImageMap[s.priority] ||
                "https://cdn.builder.io/api/v1/image/assets/TEMP/placeholder.png?width=720";
              const count = resultSummary.length;
              const spacing = count === 1 ? 0 : count === 2 ? 40 : -60;
              const offsetX = Math.round((i - (count - 1) / 2) * spacing);
              const width = count === 1 ? "68%" : count === 2 ? "55%" : "46%";

              return (
                <div
                  key={s.priority}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${offsetX}px), -50%)`,
                    width,
                    zIndex: i + 1,
                  }}
                >
                  <div style={{ width: "100%", paddingBottom: "80%", position: "relative" }}>
                    <img
                      src={imgSrc}
                      alt={s.priority}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center center" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Buttons area (kept consistent with FigmaStyle1Layout styles) */}
      <div style={{ textAlign: "center", width: "100%", marginTop: 20 }}>
        <div
          className="figma-style1-button-container"
          style={{ width: "100%", maxWidth: 360, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}
        >
          {buttons.map((button, index) => (
            <div key={index}>
              <button onClick={button.onClick} className="figma-style1-button" aria-describedby={`button-description-${index}`}>
                <span className="figma-style1-button-text">{button.text}</span>
              </button>
              {button.ariaLabel && (
                <div id={`button-description-${index}`} className="figma-style1-sr-only">{button.ariaLabel}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Ask04Budget;
