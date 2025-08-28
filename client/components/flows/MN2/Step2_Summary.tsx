/**
 * UK PACK - MN2 Step 2: Policy Summary
 * Redesigned to match Figma layout exactly
 */

import { useEffect, useState } from "react";

interface Step2_SummaryProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
}

interface SummaryCard {
  priority: string;
  beneficiaries: { label: string; iconSrc: string }[];
}

const Step2_Summary = ({
  sessionID,
  onNext,
  onBack,
  journeyData,
}: Step2_SummaryProps) => {
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);

  // Beneficiary mapping for icons and labels
  const beneficiaryMapping = {
    everyone: { 
      label: "ทุกคน", 
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/7cd80c386515c5c0009d1e49c28ba822cd0082f8?width=80"
    },
    locals: { 
      label: "คนในพื้นที่", 
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/272cf40c4b39c458339f5b7e24299b2d553f4837?width=74"
    },
    elderly: { 
      label: "ผู้สูงอายุ", 
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/085fb4ec7bf18e454a0e6b40dcba092aeb888728?width=70"
    },
    students: { 
      label: "นักเรียน\nนักศึกษา", 
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/c18a9a787fb93083a959b16fd6684229df17250f?width=52"
    },
    disabled: { 
      label: "คนพิการ", 
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/9633f8bb6d0c953adb33a0769227522a310bb01f?width=88"
    },
    other: { 
      label: "อื่นๆ", 
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/5a8e81b8e50e6e0ed69f435d1c09e3de070df984?width=82"
    },
  };

  useEffect(() => {
    // Be flexible with incoming data shapes from different parts of the app.
    const prioritiesData: string[] =
      journeyData?.priorities?.selectedPriorities ||
      journeyData?.mn1?.priorities?.selectedPriorities ||
      journeyData?.mn1?.selectedPriorities ||
      journeyData?.selectedPriorities ||
      [];

    let beneficiariesSelections: { priority: string; beneficiaries: string[] }[] =
      journeyData?.beneficiaries?.selections ||
      journeyData?.mn2?.beneficiaries?.selections ||
      journeyData?.mn2?.beneficiaries?.selectedGroups ||
      journeyData?.beneficiaries?.selectedGroups ||
      [];

    // If beneficiariesSelections is an array of ids (legacy: flat selectedGroups) convert to per-priority mapping
    if (
      Array.isArray(beneficiariesSelections) &&
      beneficiariesSelections.length > 0 &&
      typeof beneficiariesSelections[0] === "string"
    ) {
      const flatIds = beneficiariesSelections as unknown as string[];
      beneficiariesSelections = prioritiesData.map((p) => ({ priority: p, beneficiaries: flatIds }));
    }

    if (
      (journeyData?.beneficiaries?.selectedGroups && Array.isArray(journeyData.beneficiaries.selectedGroups)) &&
      (!beneficiariesSelections || beneficiariesSelections.length === 0) &&
      prioritiesData.length > 0
    ) {
      const flat = journeyData.beneficiaries.selectedGroups as string[];
      beneficiariesSelections = prioritiesData.map((p) => ({ priority: p, beneficiaries: flat }));
    }

    // Build a lookup map for beneficiaries by priority
    const lookup: Record<string, string[]> = {};
    beneficiariesSelections.forEach((s: any) => {
      lookup[s.priority] = Array.isArray(s.beneficiaries) ? s.beneficiaries : [];
    });

    // Create summary cards
    const cards: SummaryCard[] = prioritiesData.map((priority: string) => {
      const beneficiaryIds = lookup[priority] || [];
      const beneficiaryObjects = beneficiaryIds.map((id: string) => 
        (beneficiaryMapping as any)[id] || { 
          label: id, 
          iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/5a8e81b8e50e6e0ed69f435d1c09e3de070df984?width=82"
        }
      );

      return {
        priority,
        beneficiaries: beneficiaryObjects,
      };
    });

    setSummaryCards(cards);
  }, [journeyData]);

  const handleYes = () => {
    const data = { summary: { summaryReviewed: true, summaryCards, confirmed: true } };
    onNext(data);
  };

  const handleNo = () => {
    const data = { summary: { summaryReviewed: true, summaryCards, confirmed: false } };
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-white overflow-hidden relative mx-auto">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/800ce747c7dddce8b9f8a83f983aeec3551ce472?width=956"
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-90"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-8 py-11">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-white font-kanit text-[28px] font-normal leading-normal">
            นี้คือนโยบายที่คุณเสนอ
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="flex-1 space-y-4 mb-6">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="relative w-full h-[155px] rounded-[10px] border-[1.5px] border-[#EFBA31]"
            >
              {/* Policy Name */}
              <div className="absolute top-3 left-0 right-0">
                <h3 className="text-[#EFBA31] font-kanit text-[18px] font-normal text-center leading-normal">
                  {card.priority}
                </h3>
              </div>

              {/* Beneficiary Icons */}
              <div className="absolute top-12 left-0 right-0 flex justify-center gap-4 px-4">
                {card.beneficiaries.map((beneficiary, beneficiaryIndex) => (
                  <div
                    key={beneficiaryIndex}
                    className="flex flex-col items-center"
                  >
                    {/* Circular Icon Background */}
                    <div className="w-[60px] h-[60px] rounded-full bg-[#EFBA31] flex items-center justify-center mb-1">
                      <img
                        src={beneficiary.iconSrc}
                        alt={beneficiary.label}
                        className="w-[40px] h-[29px] object-contain"
                      />
                    </div>
                    {/* Label */}
                    <span className="text-[#EFBA31] font-prompt text-[12px] font-medium text-center leading-3 whitespace-pre-line max-w-[86px]">
                      {beneficiary.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Question */}
        <div className="text-center mb-6">
          <h2 className="text-white font-kanit text-[28px] font-normal leading-normal">
            คุณพอใจหรือไม่
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Yes Button */}
          <button
            onClick={handleYes}
            className="w-full h-[52px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <span className="text-black font-prompt text-[18px] font-medium leading-7 tracking-[0.4px]">
              ใช่
            </span>
          </button>

          {/* No Button */}
          <button
            onClick={handleNo}
            className="w-full h-[52px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <span className="text-black font-prompt text-[18px] font-medium leading-7 tracking-[0.4px]">
              ไม่ใช่
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2_Summary;
