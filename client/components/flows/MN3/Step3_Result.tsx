import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout.ukpack1";
import Uk1Button from "../../shared/Uk1Button";
import MN3_MANIFEST from '../../../data/mn3-manifest';

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
  // Prefer manifest-based mapping (more images per priority)

  const priorityImageMap: { [key: string]: string } = {
    // Backwards-compat fallback (kept minimal). Manifest provides better coverage.
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

    try {
      sessionStorage.setItem(
        "mn3_resultSummary",
        JSON.stringify(
          data.budget_step3_result?.resultSummary || resultSummary,
        ),
      );
    } catch (e) {}

    proceedAfterSelect("/beforecitychange/ask04-budget", data);
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

    try {
      sessionStorage.setItem(
        "mn3_resultSummary",
        JSON.stringify(
          data.budget_step3_result?.resultSummary || resultSummary,
        ),
      );
    } catch (e) {}

    // Navigate back to the MN3 page. If already on that route, force a reload to reset the flow.
    try {
      if (
        typeof window !== "undefined" &&
        window.location.pathname === "/beforecitychange/minigame-mn3"
      ) {
        // force full reload to reset state
        window.location.assign("/beforecitychange/minigame-mn3");
      } else {
        navigate("/beforecitychange/minigame-mn3");
      }
    } catch (e) {
      // fallback to proceedAfterSelect as last resort
      proceedAfterSelect("/beforecitychange/minigame-mn3", data);
    }
  };

  // Use provided background image for MN3 final step
  const backgroundImage =
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ffad6c306ff6d4b21802e5245972126b1?format=webp&width=1500";

  return (
    <FigmaStyle1Layout
      backgroundImage={backgroundImage}
      className="mn3-step3-page figma-style1-ukpack1 fake-news-page"
      imageLoading="eager"
      title={"ภาพเมืองในอนาคตใกล้เคียงกับภาพในอุดมคติของคุณแล้วหรือไม่"}
    >
      {/* Minimal content -- only elements required for flow and logic */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {/* Intentionally empty: removed decorative mockup image */}
      </div>

      {/* Selected priorities visual summary - overlapping collage */}
      <div className="w-full px-4 mb-6">
        <div
          className="max-w-[980px] mx-auto relative mn3-result-collage"
          style={{
            minHeight: "65vh" /* center vertically in viewport */,
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform:
              "translateY(75px)" /* move collage down by 75px for this page only */,
          }}
        >
          {resultSummary.map((s, i) => {
            // Determine image source using manifest: robust lookup (exact, normalized, contains)
            const normalize = (str: string) => (str || "").toString().normalize('NFKC').replace(/\s+/g, '').toLowerCase();
            const findManifestFor = (priority: string) => {
              if (!MN3_MANIFEST) return undefined;
              if (MN3_MANIFEST[priority]) return MN3_MANIFEST[priority];
              const norm = normalize(priority);
              // exact normalized key
              for (const k of Object.keys(MN3_MANIFEST)) {
                if (normalize(k) === norm) return MN3_MANIFEST[k];
              }
              // contains or contained
              for (const k of Object.keys(MN3_MANIFEST)) {
                const nk = normalize(k);
                if (nk.includes(norm) || norm.includes(nk)) return MN3_MANIFEST[k];
              }
              return undefined;
            };

            const manifestImgs = findManifestFor(s.priority) || [];
            const rankIndex = i < 3 ? i : 2; // if more than 3, fallback to the smallest
            const imgSrc = manifestImgs[rankIndex] ||
              priorityImageMap[s.priority] ||
              "https://cdn.builder.io/api/v1/image/assets/TEMP/placeholder.png?width=720";

            const offset = collageOffsets[i] || {
              left: `50%`,
              top: `50%`,
              rotate: `0deg`,
              z: i + 1,
              scale: 1,
            };

            const count = resultSummary.length;
            const spacing = count === 1 ? 0 : count === 2 ? 40 : -60; // smaller/negative spacing to create overlay
            const offsetX = Math.round((i - (count - 1) / 2) * spacing);

            // Compute width and scale from actual allocation percentage so budget affects prominence
            const allocation = typeof s.allocation === 'number' ? s.allocation : 0;
            const widthPercent = Math.max(30, Math.min(80, Math.round(30 + allocation * 0.4)));
            const scaleFromAllocation = 0.8 + Math.max(0, Math.min(1, allocation / 100)) * 0.8; // 0.8..1.6
            const finalScale = (offset.scale || 1) * scaleFromAllocation;
            return (
              <div
                key={s.priority}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `calc(50% + ${offset.top})`,
                  transform: `translate(calc(-50% + ${offsetX}px), -50%) rotate(${offset.rotate}) scale(${finalScale})`,
                  width: `${widthPercent}%`,
                  zIndex: offset.z,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    paddingBottom: "80%",
                    position: "relative",
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={s.priority}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center center",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: "center", width: "100%", marginTop: 20 }}>
        <div
          className="figma-style1-button-container"
          style={{
            width: "100%",
            maxWidth: 360,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {useUk1Button ? (
            <>
              <Uk1Button
                onClick={handleYes}
                aria-pressed={selected === "yes"}
                aria-label="ใช่, ไปต่อ"
                style={{ width: "100%" }}
              >
                <span className="figma-style1-button-text">ใช่, ไปต่อ</span>
              </Uk1Button>
              <Uk1Button
                onClick={handleNo}
                aria-pressed={selected === "no"}
                aria-label="ไม่ใช่, ลองอีกครั้ง"
                style={{ width: "100%" }}
              >
                <span className="figma-style1-button-text">
                  ไม่ใช่, ลองอีกครั้ง
                </span>
              </Uk1Button>
            </>
          ) : (
            <>
              <button
                onClick={handleYes}
                aria-pressed={selected === "yes"}
                className="figma-style1-button"
                style={{ width: "100%" }}
                aria-label="ใช่, ไปต่อ"
              >
                <span className="figma-style1-button-text">ใช่, ไปต่อ</span>
              </button>

              <button
                onClick={handleNo}
                aria-pressed={selected === "no"}
                className="figma-style1-button"
                style={{ width: "100%" }}
                aria-label="ไม่ใช่, ลองอีกครั้ง"
              >
                <span className="figma-style1-button-text">
                  ไม่ใช่, ลองอีกครั้ง
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step3_Result;
