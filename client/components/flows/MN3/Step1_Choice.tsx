/**
 * UK PACK - MN3 Step 1: Budget Choice Selection
 * Updated to match Figma design exactly with blue background and responsive layout
 */

import { useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";

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
    "เพิ่มความถี่รถ��มล์",
    "ปรับปรุงคุณภาพรถเมล์",
    "เพิ่มที่จอดรถ",
    "เพิ่มรถเล็กเชื่อมต่อรถไฟฟ้าในซอย",
  ];

  // Small image map so we can send image URLs immediately when user selects a priority
  const priorityImageMap: { [key: string]: string } = {
    "ตั๋วร่วม": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F2f0106ff48a44f03b71429502944e9f2?format=webp&width=720",
    "เพิ่มที่จอดรถ": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F79ac3a2ac5e84e88b4015fd66aaebe04?format=webp&width=720",
    "เพิ่มความถี่รถไฟฟ้า": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fd90beaca642d4cceba685d933aeb644f?format=webp&width=720",
    "ปรับปรุงคุณภาพรถเมล์": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F602cfdd852a147ed852d50b2ed05772d?format=webp&width=720",
    "เพิ่มความถี่รถเมล์": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4e921e92e2c44db7a2ad24ee299e9a6d?format=webp&width=720",
    "เพิ่ม Feeder ในซอย": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbb907b894b5a44b3bde47b685f00caca?format=webp&width=720",
    "ลดค่าโดยสารรถไฟฟ้า": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F902c640032bd41f3b30e4ce96330d938?format=webp&width=720",
  };

  const handlePriorityToggle = (priority: string) => {
    setSelectedPriorities((prev) => {
      const isSelected = prev.includes(priority);

      const next = ((): string[] => {
        if (isSelected) return prev.filter((p) => p !== priority);
        if (prev.length < maxSelections) return [...prev, priority];
        return prev;
      })();

      // On selection (not deselect), attempt to send corresponding image URL to server
      if (!isSelected) {
        try {
          let img = priorityImageMap[priority];
          if (!img) {
            const normalize = (s: string) =>
              String(s || '')
                .replace(/[\s\u00A0\uFEFF]+/g, '')
                .replace(/[^\p{L}\p{N}]/gu, '')
                .toLowerCase();
            const nk = normalize(priority);
            for (const k of Object.keys(priorityImageMap)) {
              const kk = normalize(k);
              if (!kk || !nk) continue;
              if (kk.includes(nk) || nk.includes(kk)) {
                img = priorityImageMap[k];
                break;
              }
            }
          }

          if (img) {
            const key = 'beforecitychange_images_sent';
            try {
              const raw = sessionStorage.getItem(key);
              const sent = raw ? JSON.parse(raw) : {};
              if (!sent[img]) {
                // helper to mark sent
                const mark = (payload: any) => {
                  try {
                    sent[img] = payload;
                    sessionStorage.setItem(key, JSON.stringify(sent));
                  } catch (_) {}
                };

                // Try sendBeacon first (fire-and-forget), fallback to fetch
                try {
                  const blob = new Blob([JSON.stringify({ imageUrl: img, collection: 'beforecitychange-imageshow-events' })], { type: 'application/json' });
                  const ok = typeof navigator !== 'undefined' && navigator.sendBeacon && navigator.sendBeacon('/api/write-image-url', blob);
                  if (ok) {
                    mark({ ok: true, beacon: true, ts: Date.now() });
                  } else {
                    // fallback to fetch
                    fetch('/api/write-image-url', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ imageUrl: img, collection: 'beforecitychange-imageshow-events' }),
                    })
                      .then(async (r) => {
                        if (r.ok) {
                          const j = await r.json().catch(() => null);
                          mark({ ok: true, id: j?.id || null, ts: Date.now() });
                        } else {
                          const txt = await r.text().catch(() => null);
                          mark({ ok: false, error: `HTTP ${r.status} ${txt || ''}` });
                        }
                      })
                      .catch((e) => {
                        mark({ ok: false, error: String(e) });
                      });
                  }
                } catch (e) {
                  mark({ ok: false, error: String(e) });
                }
              }
            } catch (e) {}
          }
        } catch (e) {}
      }

      return next;
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
        event: "MN3_SELECT",
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
    "ปรับปรุงคุณภาพรถเมล์", // choice_2
    "เพิ่มความถี่รถเมล์", // choice_4
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
        <div className="text-center w-full max-w-none px-4">
          <h1
            className="font-prompt text-center leading-normal mb-2"
            style={{
              color: "#000D59",
              fontSize: "clamp(22px, 5vw, 44px)",
              lineHeight: "1.2",
              fontWeight: 700,
              width: "100%",
              margin: "0 auto 8px auto",
            }}
          >
            คุณคิดว่าถ้านโยบายนี้จะเกิดขึ้น
            <br />
            ควรมีนโยบายประกอบอะไรบ้าง 3 อันดับแรก
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
            style={{ width: "100%", maxWidth: 980 }}
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
