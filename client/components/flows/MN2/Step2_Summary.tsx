/**
 * UK PACK - MN2 Step 2: Policy Summary
 * Fixed responsive design for icons and text
 */

import { useEffect, useState } from "react";
import { useSession } from "../../../hooks/useSession";
import { logEvent } from "../../../services/dataLogger.js";

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
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/a7ee1168c07ae5401b45929d0d4fde9e6584ca73?width=188",
    },
    locals: {
      label: "คนในพื้นที่",
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/7466a6d8ca4a47a6e90476e9f11efff972ddd262?width=140",
    },
    elderly: {
      label: "ผู้สูงอายุ",
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/a8a5176ee5947e2d351bcf255e32cb057477ac56?width=100",
    },
    students: {
      label: "นักเรียน\nนักศึกษา",
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/c7725aab330bcb8ed4f1c73461ddfdbe0270b371?width=118",
    },
    disabled: {
      label: "คนพิการ",
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/7466a6d8ca4a47a6e90476e9f11efff972ddd262?width=140",
    },
    other: {
      label: "อื่นๆ",
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/a7ee1168c07ae5401b45929d0d4fde9e6584ca73?width=188",
    },
  };

  useEffect(() => {
    // Extract priorities from journey data
    const prioritiesData: string[] =
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

    // Build lookup map
    const lookup: Record<string, string[]> = {};
    beneficiariesSelections.forEach((s: any) => {
      lookup[s.priority] = Array.isArray(s.beneficiaries) ? s.beneficiaries : [];
    });

    // Create summary cards
    const cards: SummaryCard[] = prioritiesData.map((priority: string) => {
      const beneficiaryIds = lookup[priority] || [];
      const beneficiaryObjects = beneficiaryIds.map((id: string) => ({
        id,
        label: (beneficiaryMapping as any)[id]?.label || "ทุกคน",
        iconSrc: (beneficiaryMapping as any)[id]?.iconSrc || beneficiaryMapping.everyone.iconSrc,
      }));

      return {
        priority,
        beneficiaries: beneficiaryObjects,
      };
    });

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
    <div className="mn2-summary-page min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Background with curved blue bottom */}
      <div className="absolute inset-0">
        {/* Blue background */}
        <div
          className="absolute inset-0 bg-[#04D9F9]"
          style={{ width: "100%", height: "100%" }}
        />
        {/* White curved top section */}
        <div
          className="absolute top-0 left-0 right-0 bg-white"
          style={{
            height: "clamp(1000px, 70vh, 1420px)",
            borderBottomLeftRadius: "clamp(300px, 40vw, 800px)",
            borderBottomRightRadius: "clamp(300px, 40vw, 800px)",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1080px] mx-auto px-4 py-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h1
            className="font-prompt font-bold text-center"
            style={{
              color: "#000D59",
              fontSize: "clamp(24px, 5.6vw, 60px)",
              fontWeight: 700,
              lineHeight: "normal"
            }}
          >
            นโยบายที่คุณเสนอ
          </h1>
        </div>

        {/* Policy Cards */}
        <div className="space-y-6 mb-12">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="w-full max-w-[903px] mx-auto rounded-[20px] border-[5px] border-[#000D59] bg-transparent"
              style={{
                minHeight: "clamp(200px, 25vw, 328px)",
                padding: "clamp(16px, 3vw, 24px)"
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
                    letterSpacing: "0.4px"
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
                  padding: "0 clamp(8px, 2vw, 16px)"
                }}
              >
                {card.beneficiaries.map((beneficiary, beneficiaryIndex) => (
                  <div
                    key={beneficiaryIndex}
                    className="flex flex-col items-center justify-center"
                    style={{
                      width: "100%",
                      maxWidth: "clamp(120px, 15vw, 176px)"
                    }}
                  >
                    {/* Circle with icon - Responsive SVG */}
                    <div className="relative mb-3">
                      <svg
                        viewBox="0 0 133 133"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-[#000D59]"
                        style={{
                          width: "clamp(80px, 12vw, 132px)",
                          height: "clamp(80px, 12vw, 132px)",
                          strokeWidth: "clamp(3, 0.5vw, 5)"
                        }}
                      >
                        <circle 
                          cx="66.5" 
                          cy="66.5" 
                          r="63.6" 
                          stroke="#000D59" 
                          strokeWidth="5"
                          fill="none"
                        />
                      </svg>
                      {beneficiary.iconSrc && (
                        <img
                          src={beneficiary.iconSrc}
                          alt={beneficiary.label}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain"
                          style={{
                            maxWidth: "clamp(35px, 6vw, 75px)",
                            maxHeight: "clamp(30px, 5.5vw, 70px)"
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
                        wordBreak: "break-word"
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
              lineHeight: "normal"
            }}
          >
            คุณพอใจหรือไม่
          </h2>
        </div>

        {/* Satisfaction Buttons - Responsive */}
        <div className="w-full max-w-[874px] mx-auto space-y-4">
          {/* Yes (ใช่) */}
          <div className="relative">
            <div
              className="rounded-[50px] bg-[#FFE000] mx-auto"
              style={{
                width: "min(845px, 85vw)",
                height: "clamp(60px, 8vw, 118px)"
              }}
            />
            <button
              onClick={() => {
                logEvent({
                  event: "SATISFACTION_CHOICE",
                  payload: { choice: "พอใจ", path: "MN1_MN2", sessionID },
                });
                navigateToPage("/fake-news");
              }}
              className="absolute inset-0 w-full transition-all duration-200 hover:scale-105 flex items-center justify-center"
              style={{
                background: "transparent",
                border: "none",
                height: "clamp(60px, 8vw, 118px)"
              }}
            >
              <span
                className="font-prompt text-black text-center font-normal px-4"
                style={{
                  fontSize: "clamp(16px, 3.5vw, 50px)",
                  fontWeight: 400,
                  letterSpacing: "0.4px"
                }}
              >
                ใช่
              </span>
            </button>
          </div>

          {/* No (ไม่ใช่) */}
          <div className="relative">
            <div
              className="rounded-[50px] bg-[#FFE000] mx-auto"
              style={{
                width: "min(845px, 85vw)",
                height: "clamp(60px, 8vw, 118px)"
              }}
            />
            <button
              onClick={() => {
                logEvent({
                  event: "SATISFACTION_CHOICE",
                  payload: { choice: "ไม่พอใ��", path: "MN1_MN2", sessionID },
                });
                navigateToPage("/ask05");
              }}
              className="absolute inset-0 w-full transition-all duration-200 hover:scale-105 flex items-center justify-center"
              style={{
                background: "transparent",
                border: "none",
                height: "clamp(60px, 8vw, 118px)"
              }}
            >
              <span
                className="font-prompt text-black text-center font-normal px-4"
                style={{
                  fontSize: "clamp(16px, 3.5vw, 50px)",
                  fontWeight: 400,
                  letterSpacing: "0.4px"
                }}
              >
                ไม่ใช่
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_Summary;
