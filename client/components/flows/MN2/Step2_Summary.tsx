/**
 * UK PACK - MN2 Step 2: Policy Summary
 * Fixed responsive design for icons and text
 */

import { useEffect, useState } from "react";
import { useSession } from "../../../hooks/useSession";
import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout";

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
        "https://api.builder.io/api/v1/image/assets/TEMP/a7ee1168c07ae5401b45929d0d4fde9e6584ca73?width=188",
    },
    locals: {
      label: "คนในพื้นที่",
      iconSrc:
        "https://api.builder.io/api/v1/image/assets/TEMP/7466a6d8ca4a47a6e90476e9f11efff972ddd262?width=140",
    },
    elderly: {
      label: "ผู้สูงอายุ",
      iconSrc:
        "https://api.builder.io/api/v1/image/assets/TEMP/a8a5176ee5947e2d351bcf255e32cb057477ac56?width=100",
    },
    students: {
      label: "นักเรียน/นักศึกษา",
      iconSrc:
        "https://api.builder.io/api/v1/image/assets/TEMP/c7725aab330bcb8ed4f1c73461ddfdbe0270b371?width=118",
    },
    disabled: {
      label: "คนพิการ",
      iconSrc:
        "https://api.builder.io/api/v1/image/assets/TEMP/7466a6d8ca4a47a6e90476e9f11efff972ddd262?width=140",
    },
    other: {
      label: "อื่นๆ",
      iconSrc:
        "https://api.builder.io/api/v1/image/assets/TEMP/a7ee1168c07ae5401b45929d0d4fde9e6584ca73?width=188",
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
      const beneficiaryObjects = beneficiaryIds.map((id: string) => ({
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
        const beneficiaryObjects = (s.beneficiaries || []).map(
          (id: string) => ({
            id,
            label: (beneficiaryMapping as any)[id]?.label || "ทุกคน",
            iconSrc:
              (beneficiaryMapping as any)[id]?.iconSrc ||
              beneficiaryMapping.everyone.iconSrc,
          }),
        );
        return {
          priority: s.priority || "(ไม่ระบุ)",
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

  return (
    <FigmaStyle1Layout
      backgroundImage={""} // disabled decorative background for debugging
      className="mn2-summary-page mn2-summary-minimal figma-style1-ukpack1 fake-news-page"
      imageLoading="eager"
      title={<span style={{ color: "#000D59" }}>นโยบายที่คุณเสนอ</span>}
    >
      <div
        className="relative z-10 w-full max-w-full mx-auto px-4 py-6"
        style={{ paddingTop: "clamp(80px, 18vh, 140px)" }}
      >
        {/* Policy Cards */}
        <div className="space-y-6 mb-12">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="w-full max-w-[903px] mx-auto rounded-[20px] border-2 border-[#000D59] bg-transparent"
              style={{
                minHeight: "clamp(200px, 25vw, 328px)",
                padding: "clamp(16px, 3vw, 24px)",
              }}
            >
              {/* Policy Title */}
              <div className="text-center mb-6">
                <h2
                  className="font-prompt font-bold text-center"
                  style={{
                    color: "#000D59",
                    fontSize: "clamp(18px, 3.7vw, 40px)",
                    fontWeight: 700,
                    letterSpacing: "0.4px",
                  }}
                >
                  {card.priority}
                </h2>
              </div>

              {/* Beneficiary Icons - Responsive Grid */}
              <div
                className={`grid justify-items-center items-center ${
                  card.beneficiaries.length <= 2
                    ? "grid-cols-2 gap-4"
                    : card.beneficiaries.length === 3
                      ? "grid-cols-3 gap-3"
                      : "grid-cols-2 md:grid-cols-4 gap-3"
                }`}
                style={{
                  maxWidth: "100%",
                  margin: "0 auto",
                  padding: "0 clamp(8px, 2vw, 16px)",
                }}
              >
                {card.beneficiaries.map((beneficiary, beneficiaryIndex) => (
                  <div
                    key={beneficiaryIndex}
                    className="flex flex-col items-center justify-center"
                    style={{
                      width: "100%",
                      maxWidth: "clamp(120px, 15vw, 176px)",
                    }}
                  >
                    {/* Circle with icon - Responsive SVG */}
                    <div className="relative mb-3">
                      {beneficiary.iconSrc && (
                        <img
                          src={beneficiary.iconSrc}
                          alt={beneficiary.label}
                          className="object-contain"
                          style={{
                            width: "clamp(80px, 12vw, 132px)",
                            height: "clamp(80px, 12vw, 132px)",
                            display: "block",
                            margin: "0 auto",
                          }}
                        />
                      )}
                    </div>
                    {/* Label - Responsive Text */}
                    <span
                      className="font-prompt font-bold text-center whitespace-pre-line"
                      style={{
                        color: "#000D59",
                        fontSize: "clamp(12px, 2.2vw, 30px)",
                        fontWeight: 700,
                        letterSpacing: "0.4px",
                        lineHeight: "1.2",
                        maxWidth: "100%",
                        wordBreak: "break-word",
                      }}
                    >
                      {beneficiary.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Question Section */}
        <div className="text-center mb-8">
          <h2
            className="font-prompt font-bold text-center"
            style={{
              color: "#000D59",
              fontSize: "clamp(24px, 5.6vw, 60px)",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            คุณพอใจหรือไม่
          </h2>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step2_Summary;
