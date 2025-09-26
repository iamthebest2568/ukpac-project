/**
 * UK PACK - MN2 Step 2: Policy Summary
 * Fixed responsive design for icons and text
 */

import { useEffect, useState } from "react";
import { useSession } from "../../../hooks/useSession";
import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout.ukpack1";

interface Step2_SummaryProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
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
      label: "นักเรียน/นักศึกษา",
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
      const beneficiaryIds = lookup[priority] || [];
      const beneficiaryObjects = beneficiaryIds
        .filter((id: string) => id !== "other")
        .map((id: string) => ({
          id,
          label: (beneficiaryMapping as any)[id]?.label || "ทุกคน",
          iconSrc:
            (beneficiaryMapping as any)[id]?.iconSrc ||
            beneficiaryMapping.everyone.iconSrc,
        }));

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
          .filter((id: string) => id !== "other")
          .map((id: string) => ({
            id,
            label: (beneficiaryMapping as any)[id]?.label || "ทุกคน",
            iconSrc:
              (beneficiaryMapping as any)[id]?.iconSrc ||
              beneficiaryMapping.everyone.iconSrc,
          }));
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

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F25b8952408b845a2b91a92498b93f24a?format=webp&width=800"
      backgroundAlt="พื้นหลังสรุปนโยบาย"
      useBlueOverlay={false}
      className="ask04-page mn2-summary-page mn2-summary-minimal figma-style1-ukpack1 fake-news-page"
      imageLoading="eager"
    >
      <div
        className="relative w-full max-w-full mx-auto px-4 py-6"
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          zIndex: 9999,
          paddingBottom: "100px", // ensure content not covered by footer
        }}
      >
        {/* Policy Cards */}
        <div style={{ flex: 1, paddingRight: 8 }}>
          <div className="space-y-6 mb-6">
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className="w-full max-w-[903px] mx-auto rounded-[20px] border-2 border-[#000D59] bg-transparent"
                style={{
                  minHeight: "clamp(180px, 22vw, 300px)",
                  padding: "clamp(12px, 2.6vw, 20px)",
                }}
              >
                {/* Policy Title */}
                <div className="text-center mb-4">
                  <h2
                    className="font-prompt font-bold text-center"
                    style={{
                      color: "#000D59",
                      fontSize: "clamp(18px, 3.2vw, 36px)",
                      fontWeight: 700,
                      letterSpacing: "0.4px",
                    }}
                  >
                    {card.priority}
                  </h2>
                </div>

                {/* Beneficiary Icons - 3 per row, tighter spacing, slightly larger icons */}
                <div
                  className={`grid justify-items-center items-center grid-cols-3 gap-2`}
                  style={{
                    maxWidth: "100%",
                    margin: "0 auto",
                    padding: "0 clamp(6px, 1.6vw, 12px)",
                  }}
                >
                  {card.beneficiaries.map((beneficiary, beneficiaryIndex) => (
                    <div
                      key={beneficiaryIndex}
                      className="flex flex-col items-center justify-center"
                      style={{
                        width: "100%",
                        maxWidth: "clamp(100px, 30vw, 160px)",
                      }}
                    >
                      {/* Circle with icon - slightly larger responsive size */}
                      <div className="relative mb-1">
                        {beneficiary.iconSrc && (
                          <img
                            src={beneficiary.iconSrc}
                            alt={beneficiary.label}
                            className="object-contain"
                            style={{
                              width: "clamp(64px, 16vw, 110px)",
                              height: "clamp(64px, 16vw, 110px)",
                              display: "block",
                              margin: "0 auto",
                            }}
                          />
                        )}
                      </div>
                      {/* Visually hide textual label (accessible to screen-readers) */}
                      <span className="sr-only">{beneficiary.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Question Section */}
        <div
          className="text-center mb-2"
          style={{ marginTop: "auto", paddingBottom: "8px" }}
        >
          <h2
            className="font-prompt font-bold text-center"
            style={{
              color: "#000D59",
              fontSize: "clamp(22px, 4.6vw, 44px)",
              fontWeight: 700,
              lineHeight: "1.2",
            }}
          >
            นโยบายเพิ���มเติมที่คุณเสนอตรงใจคุณแล้วหรือไม่
          </h2>
        </div>
      </div>

      {/* Footer with action buttons (fixed to viewport bottom) */}
      <div
        className="mn2-summary-footer"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          height: 76,
          background: "transparent",
          padding: "10px 16px",
          display: "flex",
          justifyContent: "center",
          boxShadow: "none",
        }}
      >
        <div
          style={{
            maxWidth: 420,
            width: "100%",
            display: "flex",
            gap: 12,
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleEndGame}
            className="figma-style1-button"
            aria-label="ใช่, ไปต่อ"
            style={{ flex: 1 }}
          >
            <span className="figma-style1-button-text">ใช่, ไปต่อ</span>
          </button>

          <button
            onClick={() => {
              // Log and navigate back to MN1 to try again
              logEvent({
                event: "MINIGAME_MN2_SUMMARY_RETRY",
                payload: { sessionID, summaryCards },
              });
              try {
                navigateToPage("/minigame-mn1");
              } catch (e) {
                console.warn("navigate to mn1 failed", e);
              }
            }}
            className="figma-style1-button"
            aria-label="ไม่ใช่, ลองอีกครั้ง"
            style={{ flex: 1 }}
          >
            <span className="figma-style1-button-text">
              ไม่ใช่, ลองอีกครั้ง
            </span>
          </button>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step2_Summary;
