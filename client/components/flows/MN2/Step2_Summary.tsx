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

  // Complete beneficiary mapping with exact Figma images
  const beneficiaryMapping = {
    everyone: {
      label: "ทุกคน",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb51d5d0d87d5482cbe4ae3a2df0c65c9?format=webp&width=188",
    },
    locals: {
      label: "คนในพื้นที่",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fd0e13c552a39418eb25993c7d87905c8?format=webp&width=140",
    },
    elderly: {
      label: "ผู้สูงอายุ",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fd3f59501f48a452c9298801a0aefebe1?format=webp&width=100",
    },
    students: {
      label: "นักเรี��น/นักศึกษา",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F0cd82b7996e641ee9cf3aaa0ab1cb9f8?format=webp&width=118",
    },
    disabled: {
      label: "คนพิการ",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F70716074f73c4374a1f9295afdf5f5b2?format=webp&width=140",
    },
  };

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
              label:
                entry.label ||
                (beneficiaryMapping as any)[entry.id]?.label ||
                "ทุกคน",
              iconSrc:
                entry.iconSrc ||
                (beneficiaryMapping as any)[entry.id]?.iconSrc ||
                beneficiaryMapping.everyone.iconSrc,
            };
          }
          const id = String(entry);
          return {
            id,
            label: (beneficiaryMapping as any)[id]?.label || "ทุกคน",
            iconSrc:
              (beneficiaryMapping as any)[id]?.iconSrc ||
              beneficiaryMapping.everyone.iconSrc,
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
                label:
                  entry.label ||
                  (beneficiaryMapping as any)[entry.id]?.label ||
                  "ทุกคน",
                iconSrc:
                  entry.iconSrc ||
                  (beneficiaryMapping as any)[entry.id]?.iconSrc ||
                  beneficiaryMapping.everyone.iconSrc,
              };
            }
            const id = String(entry);
            return {
              id,
              label: (beneficiaryMapping as any)[id]?.label || "ทุกคน",
              iconSrc:
                (beneficiaryMapping as any)[id]?.iconSrc ||
                beneficiaryMapping.everyone.iconSrc,
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
    // User is not satisfied — record and navigate to ask05 for feedback
    const data = {
      summary: { summaryReviewed: true, summaryCards, confirmed: false },
    };

    logEvent({
      event: "MINIGAME_MN2_SUMMARY_NOT_SATISFIED",
      payload: { summaryCards, sessionID },
    });

    try {
      onNext(data);
    } catch (e) {}

    navigateToPage("ask05", data);
  };

  // Minimal cleared UI: no external layout components, no external classes.
  return (
    <div
      style={{
        all: "initial",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        color: "#000",
        padding: 16,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>MN2 — สรุปนโยบาย ( cleared )</h1>
        <p style={{ margin: "6px 0 0 0", color: "#333" }}>
          หน้านี้ถูกล้างดีไซน์เพื่อการทดสอบเฉพาะหน้านี้เท่านั้น
        </p>
      </header>

      <main style={{ flex: 1, overflow: "auto" }}>
        {summaryCards && summaryCards.length > 0 ? (
          <ul style={{ paddingLeft: 16 }}>
            {summaryCards.map((card, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                <strong style={{ display: "block", marginBottom: 6 }}>{card.priority}</strong>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {card.beneficiaries.map((b) => (
                    <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {b.iconSrc ? (
                        // lightweight inline image
                        <img src={b.iconSrc} alt={b.label} style={{ width: 48, height: 48, objectFit: "contain" }} />
                      ) : null}
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
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
              logEvent({ event: "MINIGAME_MN2_SUMMARY_RETRY", payload: { sessionID, summaryCards } });
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
