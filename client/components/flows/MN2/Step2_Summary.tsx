/**
 * UK PACK - MN2 Step 2: Policy Summary
 * Fixed responsive design for icons and text
 */

import { useEffect, useState, useRef } from "react";
import { useSession } from "../../../hooks/useSession";
import Uk1Button from "../../shared/Uk1Button";
import { uploadFileToStorage, saveMinigameSummaryImageUrl, initFirebase } from "../../../lib/firebase";

interface Step2_SummaryProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
  useUk1Button?: boolean;
}

interface SummaryCard {
  priority: string;
  beneficiaries: { label: string; iconSrc: string; id: string }[];
}

const Step2_Summary = ({
  sessionID,
  onNext,
  onBack,
  journeyData,
  useUk1Button = false,
}: Step2_SummaryProps) => {
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);
  const { navigateToPage } = useSession();

  // Cleared: do not reference external images or mappings. Keep only textual labels.

  useEffect(() => {
    // Extract priorities from journey data
    let prioritiesData: string[] =
      journeyData?.priorities?.selectedPriorities ||
      journeyData?.mn1?.priorities?.selectedPriorities ||
      [];

    // Extract beneficiary selections
    let beneficiariesSelections: {
      priority: string;
      beneficiaries: string[];
    }[] =
      journeyData?.beneficiaries?.selections ||
      journeyData?.mn2?.beneficiaries?.selections ||
      [];

    // If priorities missing, derive from beneficiaries selections order
    if (!prioritiesData || prioritiesData.length === 0) {
      prioritiesData = (beneficiariesSelections || []).map(
        (s: any) => s.priority,
      );
    }

    // Build lookup map
    const lookup: Record<string, string[]> = {};
    beneficiariesSelections.forEach((s: any) => {
      lookup[s.priority] = Array.isArray(s.beneficiaries)
        ? s.beneficiaries
        : [];
    });

    // Create summary cards
    let cards: SummaryCard[] = prioritiesData.map((priority: string) => {
      const entries = lookup[priority] || [];
      const beneficiaryObjects = entries
        .filter((entry: any) => entry !== "other")
        .map((entry: any) => {
          if (entry && typeof entry === "object" && entry.id) {
            return {
              id: entry.id,
              label: entry.label || String(entry.id),
              iconSrc: (entry as any).iconSrc || null,
            };
          }
          const id = String(entry || "");
          return {
            id,
            label: id || "(ไม่ได้ระบุ)",
            iconSrc: null,
          };
        });

      return {
        priority,
        beneficiaries: beneficiaryObjects,
      };
    });

    // If no priorities found but there are beneficiary selections, build cards from selections order
    if (
      (!cards || cards.length === 0) &&
      Array.isArray(beneficiariesSelections) &&
      beneficiariesSelections.length > 0
    ) {
      cards = beneficiariesSelections.map((s: any) => {
        const beneficiaryObjects = (s.beneficiaries || [])
          .filter((entry: any) => entry !== "other")
          .map((entry: any) => {
            if (entry && typeof entry === "object" && entry.id) {
              return {
                id: entry.id,
                label: entry.label || String(entry.id),
                iconSrc: (entry as any).iconSrc || null,
              };
            }
            const id = String(entry || "");
            return {
              id,
              label: id || "(ไม่ได้ระบุ)",
              iconSrc: null,
            };
          });
        return {
          priority: s.priority || "(ไม่ได้ระบุ)",
          beneficiaries: beneficiaryObjects,
        };
      });
    }

    setSummaryCards(cards);
  }, [journeyData]);

  // Auto-capture and upload the main content as an image (runs once when summaryCards first available)
  const hasCapturedRef = useRef(false);

  useEffect(() => {
    if (summaryCards && summaryCards.length > 0 && !hasCapturedRef.current) {
      hasCapturedRef.current = true;
      // small delay to ensure DOM settled and fonts/images loaded
      const t = setTimeout(() => {
        (async () => {
          try {
            await initFirebase();
          } catch (_) {}
          try {
            await captureAndUpload();
          } catch (e) {
            console.warn("captureAndUpload failed", e);
          }
        })();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [summaryCards]);

  const handleShareGame = () => {
    // Handle share game logic
    console.log("Share game");
  };

  const handleEndGame = () => {
    const data = {
      summary: { summaryReviewed: true, summaryCards, confirmed: true },
    };
    onNext(data);
  };

  const handleNo = () => {
    // User is not satisfied — navigate to ask05 for feedback
    const data = {
      summary: { summaryReviewed: true, summaryCards, confirmed: false },
    };

    try {
      onNext(data);
    } catch (e) {}

    navigateToPage("ask05", data);
  };

  // Capture helper: serialize DOM to SVG -> rasterize to canvas -> resize to 3:4 (portrait) -> upload
  async function captureAndUpload() {
    try {
      const el = document.getElementById("mn2-step2-content");
      if (!el) {
        console.warn("mn2-step2-content element not found");
        return;
      }

      // Clone the node to avoid modifying the live DOM
      const clone = el.cloneNode(true) as HTMLElement;

      // Ensure the clone has explicit width/height styles matching layout
      const rect = el.getBoundingClientRect();
      const elemW = Math.ceil(rect.width) || 800;
      const elemH = Math.ceil(rect.height) || Math.ceil((elemW * 4) / 3);

      clone.style.boxSizing = "border-box";
      clone.style.width = `${elemW}px`;
      clone.style.height = `${elemH}px`;
      clone.style.margin = "0";

      // Inline background to ensure white backdrop
      const wrapper = document.createElement("div");
      wrapper.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
      wrapper.style.width = `${elemW}px`;
      wrapper.style.height = `${elemH}px`;
      wrapper.style.background = "#ffffff";
      wrapper.appendChild(clone);

      const serialized = new XMLSerializer().serializeToString(wrapper);

      const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${elemW}' height='${elemH}'>\n  <foreignObject width='100%' height='100%'>\n    ${serialized}\n  </foreignObject>\n</svg>`;

      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

      await new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => res(true);
        img.onerror = (e) => rej(e);
        img.crossOrigin = "anonymous";
        img.src = url;
      });

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;

      await new Promise((res, rej) => {
        img.onload = () => res(true);
        img.onerror = (e) => rej(e);
      });

      // Target canvas size: portrait 3:4 (width:height = 3:4). Choose a sensible width for quality.
      const targetWidth = 900; // px
      const targetHeight = Math.round((targetWidth * 4) / 3); // 1200px

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      // Fill background white
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Compute scaling to fit the element into the target canvas while preserving aspect and centering
      const imgAspect = elemW / elemH;
      const canvasAspect = targetWidth / targetHeight; // 0.75
      let drawW = 0;
      let drawH = 0;
      if (imgAspect > canvasAspect) {
        // image is wider than canvas aspect -> fit by width
        drawW = targetWidth;
        drawH = Math.round(targetWidth / imgAspect);
      } else {
        // fit by height
        drawH = targetHeight;
        drawW = Math.round(targetHeight * imgAspect);
      }
      const dx = Math.round((targetWidth - drawW) / 2);
      const dy = Math.round((targetHeight - drawH) / 2);

      ctx.drawImage(img as any, 0, 0, elemW, elemH, dx, dy, drawW, drawH);

      // Convert to blob (JPEG for balanced quality & size)
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve as any, "image/jpeg", 0.86));
      if (!blob) throw new Error("Failed to create image blob");

      // Prepare path and upload
      const ts = Date.now();
      const filename = `mn2-step2-summary_${ts}.jpg`;
      const storagePath = `minigame-summary-captures/${filename}`;

      const storageUrl = await uploadFileToStorage(blob, storagePath);

      // Save record to Firestore with required fields
      try {
        await saveMinigameSummaryImageUrl(storageUrl);
      } catch (e) {
        console.warn("saveMinigameSummaryImageUrl failed", e);
      }

      return storageUrl;
    } catch (e) {
      console.warn("captureAndUpload error", e);
      throw e;
    }
  }

  // Minimal cleared UI: no external layout components, no external classes.
  return (
    <div className="figma-style1-container figma-style1-ukpack1"
      style={{
        boxSizing: "border-box",
        color: "#000",
        padding: "clamp(8px, 3vw, 16px)",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <header style={{ marginBottom: 12, textAlign: "center" }}>
        <h1 style={{ margin: "0 auto", fontSize: 22, fontWeight: 700 }}>นโยบายที่คุณเสนอ</h1>
      </header>

      <main id="mn2-step2-content" style={{ flex: 1, overflow: "auto", paddingBottom: "calc(env(safe-area-inset-bottom, 12px) + 120px)" }}>
        {summaryCards && summaryCards.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {summaryCards.map((card, i) => (
              <section key={i} style={{ border: "1px solid #0A2A66", borderRadius: 12, padding: 12, background: "#fff" }}>
                <div style={{ textAlign: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0A2A66" }}>{card.priority}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, justifyItems: "center" }}>
                  {card.beneficiaries.map((b) => (
                    <div key={b.id} style={{ width: "100%", maxWidth: 88, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
                      {/* icon only - no visible label */}
                      {((b as any).iconSrc as string) ? (
                        <img src={(b as any).iconSrc} alt="" style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 8 }} />
                      ) : (
                        <div style={{ width: 64, height: 64, borderRadius: 8, background: "#eee" }} aria-hidden />
                      )}
                      {/* Hidden text for screen readers only */}
                      <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", border: 0 }}>{b.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p>No summary cards available</p>
        )}
      </main>

      <footer style={{ position: "sticky", bottom: "calc(env(safe-area-inset-bottom, 12px))", marginTop: 24, zIndex: 1000 }}>
        <div style={{ maxWidth: 325, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 12, padding: "0 var(--space-sm)", boxSizing: "border-box" }}>
          <Uk1Button onClick={() => { try { handleEndGame(); } catch (_) {} }} style={{ height: 53, borderRadius: 40 }}>
            ใช่, ไปต่อ
          </Uk1Button>
          <Uk1Button variant="secondary" onClick={() => { try { navigateToPage && (navigateToPage("/minigame-mn1") as any); } catch (_) {} }} style={{ height: 53, borderRadius: 40 }}>
            ไม่ใช่, ลองอีกครั้ง
          </Uk1Button>
        </div>
      </footer>
    </div>
  );
};

export default Step2_Summary;
