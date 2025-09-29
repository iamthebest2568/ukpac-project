/**
 * UK PACK - MN2 Step 2: Policy Summary
 * Fixed responsive design for icons and text
 */

import { useEffect, useState } from "react";
import { useSession } from "../../../hooks/useSession";
// Cleared design: do not import layout or shared style components here

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

  // Minimal cleared UI: no external layout components, no external classes.
  return (
    <div
      style={{
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        color: "#000",
        padding: "clamp(8px, 3vw, 16px)",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <header style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>นโยบายที่คุณเสนอ</h1>
      </header>

      <main style={{ flex: 1, overflow: "auto" }}>
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

      <footer style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button
          onClick={() => {
            try {
              handleEndGame();
            } catch (_) {}
          }}
          style={{ flex: 1, padding: "10px 12px", background: "#0070f3", color: "#fff", border: "none", borderRadius: 6 }}
        >
          ใช่, ไปต่อ
        </button>
        <button
          onClick={() => {
            try {
              navigateToPage && (navigateToPage("/minigame-mn1") as any);
            } catch (_) {}
          }}
          style={{ flex: 1, padding: "10px 12px", background: "#eaeaea", color: "#000", border: "none", borderRadius: 6 }}
        >
          ไม่ใช่, ลองอีกครั้ง
        </button>
      </footer>
    </div>
  );
};

export default Step2_Summary;
