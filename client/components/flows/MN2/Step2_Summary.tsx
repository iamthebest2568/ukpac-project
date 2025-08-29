/**
 * UK PACK - MN2 Step 2: Policy Summary
 * Redesigned to match Figma layout exactly
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

    // Extract priorities from several possible locations
    const prioritiesData: string[] =
      journeyData?.priorities?.selectedPriorities ||
      journeyData?.mn1?.priorities?.selectedPriorities ||
      [];

    // Extract beneficiary selections (per-priority)
    let beneficiariesSelections: { priority: string; beneficiaries: string[] }[] =
      journeyData?.beneficiaries?.selections ||
      journeyData?.mn2?.beneficiaries?.selections ||
      [];

    // Build a lookup map for beneficiaries by priority
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
        iconSrc: (beneficiaryMapping as any)[id]?.iconSrc || "https://api.builder.io/api/v1/image/assets/TEMP/5a8e81b8e50e6e0ed69f435d1c09e3de070df984?width=82"
      }));

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
    navigateToPage('/ask04');
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
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Results Section */}
        <div className="pt-11 px-0 flex-1">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-white font-kanit text-[28px] font-normal leading-normal">
              นี้คือนโยบายที่คุณเสนอ
            </h1>
          </div>

          {/* Summary Cards */}
          <div className="px-[30px] space-y-4 mb-6">
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className="w-full rounded-[10px] border-[1.5px] border-[#EFBA31] bg-transparent overflow-hidden"
                style={{
                  minHeight: 'auto',
                  paddingBottom: '16px'
                }}
              >
                {/* Policy Name */}
                <div className="pt-3 pb-2 px-4">
                  <h3 className="text-[#EFBA31] font-kanit text-[18px] font-normal text-center leading-normal">
                    {card.priority}
                  </h3>
                </div>

                {/* Beneficiary Icons */}
                <div className="px-4 pb-2">
                  <div
                    className={`${
                      card.beneficiaries.length === 6
                        ? 'grid grid-cols-3 gap-x-3 gap-y-4 max-w-[280px]'
                        : 'flex flex-wrap justify-center items-start gap-x-3 gap-y-3'
                    } ${
                      card.beneficiaries.length <= 3
                        ? 'max-w-[280px]'
                        : 'max-w-[320px]'
                    }`}
                    style={{
                      margin: '0 auto'
                    }}
                  >
                    {card.beneficiaries.map((beneficiary, beneficiaryIndex) => (
                      <div
                        key={beneficiaryIndex}
                        className="flex flex-col items-center justify-start"
                        style={{
                          width: card.beneficiaries.length <= 3 ? '85px' : card.beneficiaries.length <= 4 ? '75px' : card.beneficiaries.length === 6 ? '80px' : '65px'
                        }}
                      >
                        {/* Circular Icon Background */}
                        <div
                          className={`rounded-full bg-[#EFBA31] flex items-center justify-center mb-2 relative flex-shrink-0 ${
                            card.beneficiaries.length <= 3
                              ? 'w-[55px] h-[55px]'
                              : card.beneficiaries.length <= 4
                              ? 'w-[50px] h-[50px]'
                              : card.beneficiaries.length === 6
                              ? 'w-[52px] h-[52px]'
                              : 'w-[45px] h-[45px]'
                          }`}
                        >
                          <img
                            src={beneficiary.iconSrc}
                            alt={beneficiary.label}
                            className={`object-contain ${
                              card.beneficiaries.length <= 3
                                ? 'max-w-[38px] max-h-[34px]'
                                : card.beneficiaries.length <= 4
                                ? 'max-w-[34px] max-h-[30px]'
                                : 'max-w-[30px] max-h-[26px]'
                            }`}
                          />
                        </div>
                        {/* Label */}
                        <span
                          className={`text-[#EFBA31] font-prompt font-medium text-center leading-tight whitespace-pre-line break-words ${
                            card.beneficiaries.length <= 3
                              ? 'text-[12px]'
                              : card.beneficiaries.length <= 4
                              ? 'text-[11px]'
                              : 'text-[10px]'
                          }`}
                          style={{
                            lineHeight: '1.2',
                            maxWidth: card.beneficiaries.length <= 3 ? '85px' : card.beneficiaries.length <= 4 ? '75px' : '65px'
                          }}
                        >
                          {beneficiary.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Question */}
          <div className="text-center mb-6 px-[29px]">
            <h2 className="text-white font-kanit text-[28px] font-normal leading-normal">
              คุณพอใจหรือไม่
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="px-8 space-y-4 pb-8">
            {/* Yes Button */}
            <button
              onClick={handleYes}
              className="w-full max-w-[325px] mx-auto h-[52px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
              <span className="text-black font-prompt text-[18px] font-medium leading-7 tracking-[0.4px]">
                ใช่
              </span>
            </button>

            {/* No Button */}
            <button
              onClick={handleNo}
              className="w-full max-w-[325px] mx-auto h-[52px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
              <span className="text-black font-prompt text-[18px] font-medium leading-7 tracking-[0.4px]">
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
