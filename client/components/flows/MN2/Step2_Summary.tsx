/**
 * UK PACK - MN2 Step 2: Policy Summary
 * Completely redesigned to match new Figma specifications
 */

import { useEffect, useState } from "react";
import { useSession } from "../../../hooks/useSession";

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

  // Beneficiary mapping with exact Figma images
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
        label: (beneficiaryMapping as any)[id]?.label || id,
        iconSrc: (beneficiaryMapping as any)[id]?.iconSrc || "",
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
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
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
            height: "clamp(1200px, 74vh, 1420px)",
            borderBottomLeftRadius: "clamp(400px, 50vw, 800px)",
            borderBottomRightRadius: "clamp(400px, 50vw, 800px)",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1080px] mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1
            className="font-prompt font-bold text-center"
            style={{
              color: "#000D59",
              fontSize: "clamp(30px, 5.6vw, 60px)",
              fontWeight: 700,
              lineHeight: "normal"
            }}
          >
            นโยบายที่คุณเสนอ
          </h1>
        </div>

        {/* Policy Cards */}
        <div className="space-y-8 mb-16">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="w-full max-w-[903px] mx-auto rounded-[20px] border-[5px] border-[#000D59] bg-transparent p-6"
              style={{
                height: "clamp(250px, 30vw, 328px)"
              }}
            >
              {/* Policy Title */}
              <div className="text-center mb-8">
                <h2
                  className="font-prompt font-bold text-center"
                  style={{
                    color: "#000D59",
                    fontSize: "clamp(20px, 3.7vw, 40px)",
                    fontWeight: 700,
                    letterSpacing: "0.4px"
                  }}
                >
                  {card.priority}
                </h2>
              </div>

              {/* Beneficiary Icons */}
              <div className="flex justify-center items-center gap-8 flex-wrap">
                {card.beneficiaries.map((beneficiary, beneficiaryIndex) => (
                  <div
                    key={beneficiaryIndex}
                    className="flex flex-col items-center"
                    style={{ width: "176px" }}
                  >
                    {/* Circle with icon */}
                    <div className="relative mb-4">
                      <svg
                        width="132"
                        height="132"
                        viewBox="0 0 133 133"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-[#000D59]"
                        strokeWidth="5"
                      >
                        <circle cx="66.5" cy="66.5" r="63.6" stroke="#000D59" strokeWidth="5" />
                      </svg>
                      {beneficiary.iconSrc && (
                        <img
                          src={beneficiary.iconSrc}
                          alt={beneficiary.label}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain"
                          style={{
                            maxWidth: "clamp(50px, 8vw, 94px)",
                            maxHeight: "clamp(45px, 7vw, 93px)"
                          }}
                        />
                      )}
                    </div>
                    {/* Label */}
                    <span
                      className="font-prompt font-bold text-center whitespace-pre-line"
                      style={{
                        color: "#000D59",
                        fontSize: "clamp(16px, 2.8vw, 30px)",
                        fontWeight: 700,
                        letterSpacing: "0.4px",
                        lineHeight: "normal"
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
        <div className="text-center mb-12">
          <h2
            className="font-prompt font-bold text-center"
            style={{
              color: "#000D59",
              fontSize: "clamp(30px, 5.6vw, 60px)",
              fontWeight: 700,
              lineHeight: "normal"
            }}
          >
            คุณพอใจหรือไม่
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-[874px] mx-auto space-y-6">
          {/* Share Game Button */}
          <div className="relative">
            <div
              className="rounded-[50px] bg-[#FFE000] mx-auto"
              style={{
                width: "min(845px, 90vw)",
                height: "clamp(80px, 10.9vw, 118px)"
              }}
            />
            <button
              onClick={handleShareGame}
              className="absolute inset-0 w-full transition-all duration-200 hover:scale-105 flex items-center justify-center"
              style={{
                background: "transparent",
                border: "none",
                height: "clamp(80px, 10.9vw, 118px)"
              }}
            >
              <span
                className="font-prompt text-black text-center font-normal"
                style={{
                  fontSize: "clamp(24px, 4.6vw, 50px)",
                  fontWeight: 400,
                  letterSpacing: "0.4px"
                }}
              >
                แชร์เกมนี้ให้เพื่อน
              </span>
            </button>
          </div>

          {/* End Game Button */}
          <div className="relative">
            <div
              className="rounded-[50px] bg-[#FFE000] mx-auto"
              style={{
                width: "min(845px, 90vw)",
                height: "clamp(80px, 10.9vw, 118px)"
              }}
            />
            <button
              onClick={handleEndGame}
              className="absolute inset-0 w-full transition-all duration-200 hover:scale-105 flex items-center justify-center"
              style={{
                background: "transparent",
                border: "none",
                height: "clamp(80px, 10.9vw, 118px)"
              }}
            >
              <span
                className="font-prompt text-black text-center font-normal"
                style={{
                  fontSize: "clamp(24px, 4.6vw, 50px)",
                  fontWeight: 400,
                  letterSpacing: "0.4px"
                }}
              >
                จบเกม
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_Summary;
