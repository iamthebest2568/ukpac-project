import { logEvent } from "../../services/dataLogger.js";
import FigmaStyle1Layout from "../layouts/FigmaStyle1Layout.ukpack1";
import Uk1Button from "../shared/Uk1Button";
import React, { useEffect, useState } from "react";

interface Ask04BudgetProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData?: any;
  useUk1Button?: boolean;
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
  useUk1Button = false,
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
    // accept both variants for reduced fare
    ลดค่าโดยสารรถไฟฟ้า:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F902c640032bd41f3b30e4ce96330d938?format=webp&width=720",
    "ลดค่าโดยสารไฟฟ้า":
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F902c640032bd41f3b30e4ce96330d938?format=webp&width=720",
  };

  const collageOffsets = [
    { left: "8%", top: "0%", rotate: "-6deg", z: 1, scale: 0.98 },
    { left: "30%", top: "6%", rotate: "6deg", z: 2, scale: 1 },
    { left: "52%", top: "-6%", rotate: "-2deg", z: 3, scale: 0.94 },
  ];

  useEffect(() => {
    // Prefer journeyData if available, otherwise fallback to sessionStorage (set by MN3 Step3)
    const allocationData =
      journeyData?.budget_step2_allocation?.budgetAllocation || {};
    const selectedPriorities =
      journeyData?.budget_step2_allocation?.selectedPriorities || [];

    // If no selectedPriorities in journeyData, try to read from sessionStorage (mn3_resultSummary)
    if (
      (!selectedPriorities || selectedPriorities.length === 0) &&
      typeof window !== "undefined"
    ) {
      try {
        const stored = sessionStorage.getItem("mn3_resultSummary");
        if (stored) {
          const parsed: ResultSummary[] = JSON.parse(stored);
          setResultSummary(parsed);
          return;
        }
      } catch (e) {
        // noop
      }
    }

    const totalBudget = 100;

    const summary: ResultSummary[] = selectedPriorities.map(
      (priority: string) => ({
        priority,
        allocation: allocationData[priority] || 0,
        percentage: ((allocationData[priority] || 0) / totalBudget) * 100,
        icon: (priorityIcons as any)[priority] || "📋",
      }),
    );

    summary.sort((a, b) => b.allocation - a.allocation);
    setResultSummary(summary);
  }, [journeyData]);

  // Persist displayed collage images to Firestore (once per session) under collection 'beforecitychange-imageshow-events'
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const key = 'beforecitychange_images_sent';
      const existingRaw = sessionStorage.getItem(key);
      let sentUrls: Record<string, any> = existingRaw ? JSON.parse(existingRaw) : {};

      const displaySummary = resultSummary && resultSummary.length > 0 ? resultSummary : [
        {
          priority: 'เพิ่มความถี่รถเมล์',
          allocation: 0,
          percentage: 0,
          icon: '',
        },
        {
          priority: 'เพิ่มที่จอดรถ',
          allocation: 0,
          percentage: 0,
          icon: '',
        },
        {
          priority: 'ลดค่าโดยสารรถไฟฟ้า',
          allocation: 0,
          percentage: 0,
          icon: '',
        },
      ];

      const urls: string[] = displaySummary.map((s) => priorityImageMap[s.priority] || '').filter(Boolean);
      // dedupe
      const unique = Array.from(new Set(urls));

      // Send image URLs to server to write via Admin SDK (avoids Firestore client rules)
      (async () => {
        try {
          for (const u of unique) {
            if (sentUrls[u]) continue;
            try {
              const resp = await fetch('/api/write-image-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: u, collection: 'beforecitychange-imageshow-events' }),
              });
              if (resp.ok) {
                const j = await resp.json();
                sentUrls[u] = { ok: true, id: j?.id || null, ts: Date.now() };
                try { sessionStorage.setItem(key, JSON.stringify(sentUrls)); } catch (_) {}
              } else {
                const txt = await resp.text().catch(() => null);
                sentUrls[u] = { ok: false, error: `HTTP ${resp.status} ${txt || ''}` };
                try { sessionStorage.setItem(key, JSON.stringify(sentUrls)); } catch (_) {}
              }
            } catch (e) {
              sentUrls[u] = { ok: false, error: String(e) };
              try { sessionStorage.setItem(key, JSON.stringify(sentUrls)); } catch (_) {}
            }
          }
        } catch (e) {
          // ignore
        }
      })();
    } catch (e) {}
  }, [resultSummary]);

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4eb00ae35ec74ef5928b78875a49f859?format=webp&width=800"
      backgroundAlt="พื้นหลังรูปนโยบาย"
      title={`คุณพอใจภาพเมืองในอนาคตที่อาจจะเกิดขึ้นหรือไม่`}
      className="ask04-page ask04-budget-page mn3-step2-minimal"
    >
      {/* Children: use MN3 Step3_Result style collage + stacked buttons (scoped copy) */}

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {/* placeholder area (kept minimal to match MN3 layout) */}
      </div>

      {/* Overlapping collage (copied from MN3 Step3_Result) */}
      <div className="w-full px-4 mb-6">
        <div
          className="max-w-[980px] mx-auto relative mn3-result-collage"
          style={{
            minHeight: "65vh",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: "translateY(45px)",
          }}
        >
          {(() => {
            const displaySummary =
              resultSummary && resultSummary.length > 0
                ? resultSummary
                : [
                    {
                      priority: "เพิ่มความถี่รถเมล์",
                      allocation: 0,
                      percentage: 0,
                      icon: "",
                    },
                    {
                      priority: "เพิ่มที่จอดรถ",
                      allocation: 0,
                      percentage: 0,
                      icon: "",
                    },
                    {
                      priority: "ลดค่าโดยสารรถไฟฟ้า",
                      allocation: 0,
                      percentage: 0,
                      icon: "",
                    },
                  ];

            return displaySummary.map((s, i) => {
              // Try direct map, otherwise attempt a fuzzy/normalized match to handle stored keys with minor corruption
              const rawKey = s.priority || '';
              let imgSrc = priorityImageMap[rawKey];
              if (!imgSrc) {
                const normalize = (str: string) =>
                  String(str || '')
                    .replace(/[\s\u00A0\uFEFF]+/g, '')
                    .replace(/[^\p{L}\p{N}]/gu, '')
                    .toLowerCase();
                const nk = normalize(rawKey);
                for (const k of Object.keys(priorityImageMap)) {
                  const kk = normalize(k);
                  if (!kk || !nk) continue;
                  if (kk.includes(nk) || nk.includes(kk)) {
                    imgSrc = priorityImageMap[k];
                    break;
                  }
                }
              }
              if (!imgSrc) imgSrc = "https://cdn.builder.io/api/v1/image/assets/TEMP/placeholder.png?width=720";
              const offset = collageOffsets[i] || {
                left: `50%`,
                top: `50%`,
                rotate: `0deg`,
                z: i + 1,
                scale: 1,
              };
              const count = displaySummary.length;
              const spacing = count === 1 ? 0 : count === 2 ? 40 : -60; // smaller/negative spacing to create overlay
              const offsetX = Math.round((i - (count - 1) / 2) * spacing);
              const width = count === 1 ? "68%" : count === 2 ? "55%" : "46%";
              return (
                <div
                  key={`${s.priority}-${i}`}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: `calc(50% + ${offset.top})`,
                    transform: `translate(calc(-50% + ${offsetX}px), -50%) rotate(${offset.rotate}) scale(${offset.scale * 1.15 * 1.15 * 1.1})` /* match Step3_Result scaling */,
                    width,
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
            });
          })()}
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
            transform:
              "translateY(30px)" /* shift buttons down 30px for Ask04Budget */,
          }}
        >
          {useUk1Button ? (
            <>
              <Uk1Button
                onClick={() => handleChoice("satisfied")}
                style={{ width: "100%" }}
                aria-label="พอใจ"
              >
                <span className="figma-style1-button-text">พอใจ</span>
              </Uk1Button>
              <Uk1Button
                onClick={() => handleChoice("unsatisfied")}
                style={{ width: "100%" }}
                aria-label="ไม่พอใจ"
              >
                <span className="figma-style1-button-text">ไม่พอใจ</span>
              </Uk1Button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleChoice("satisfied")}
                className="figma-style1-button"
                style={{ width: "100%" }}
                aria-label="พอใจ"
              >
                <span className="figma-style1-button-text">พอใจ</span>
              </button>

              <button
                onClick={() => handleChoice("unsatisfied")}
                className="figma-style1-button"
                style={{ width: "100%" }}
                aria-label="ไม่พอใจ"
              >
                <span className="figma-style1-button-text">ไม่พอใจ</span>
              </button>
            </>
          )}
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Ask04Budget;
