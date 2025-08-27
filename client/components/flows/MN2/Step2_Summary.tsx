/**
 * UK PACK - MN2 Step 2: Policy Summary
 * Moved from PolicySummary component
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
  beneficiaries: { label: string; icon: string }[];
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
    everyone: { label: "ทุกคน", icon: "👥" },
    locals: { label: "คนในพื้นที่", icon: "🏘️" },
    elderly: { label: "ผู้สูงอายุ", icon: "👴" },
    students: { label: "นักเรียนนักศึกษา", icon: "🎓" },
    disabled: { label: "คนพิการ", icon: "♿" },
    other: { label: "อื่นๆ", icon: "❓" },
  };

  useEffect(() => {
    // Extract data from journey
    const prioritiesData = journeyData?.priorities?.selectedPriorities || [];
    const beneficiariesData = journeyData?.beneficiaries?.selectedGroups || [];

    // Convert beneficiary IDs to display objects with icons and labels
    const beneficiaryObjects = beneficiariesData.map(
      (id: string) =>
        beneficiaryMapping[id as keyof typeof beneficiaryMapping] || {
          label: id,
          icon: "❓",
        },
    );

    // Create summary cards - map each priority to the selected beneficiaries
    const cards: SummaryCard[] = prioritiesData.map((priority: string) => ({
      priority,
      beneficiaries: beneficiaryObjects,
    }));

    setSummaryCards(cards);
  }, [journeyData]);

  const handleNext = () => {
    const data = { summary: { summaryReviewed: true, summaryCards } };
    onNext(data);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="นโยบายสรุป"
            className="w-full h-full object-cover object-center"
            style={{ minWidth: "100%", aspectRatio: "2/3" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 44.17%)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-end items-center px-6 md:px-8 pb-8 md:pb-12">
            {/* Title */}
            <div className="text-center mb-6 md:mb-8 max-w-[325px]">
              <h1
                className="text-white text-center font-kanit text-3xl font-normal leading-normal mb-4"
                style={{ fontSize: "clamp(24px, 7.5vw, 30px)" }}
              >
                นโยบายเพิ่มเติมที่คุณเสนอ
              </h1>
            </div>

            {/* Summary Cards Section */}
            <div className="w-full max-w-[325px] space-y-4 mb-6">
              {summaryCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white bg-opacity-90 rounded-[20px] p-4 border-[1.5px] border-black"
                >
                  {/* Policy Name */}
                  <h3 className="font-kanit text-lg font-medium text-black mb-4 text-center">
                    {card.priority}
                  </h3>

                  {/* Beneficiary Icons Row */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {card.beneficiaries.map((beneficiary, beneficiaryIndex) => (
                      <div
                        key={beneficiaryIndex}
                        className="flex flex-col items-center"
                      >
                        {/* Circular Icon */}
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mb-1">
                          <span
                            className="text-lg text-white"
                            role="img"
                            aria-label={beneficiary.label}
                          >
                            {beneficiary.icon}
                          </span>
                        </div>
                        {/* Label underneath */}
                        <span className="text-xs text-black font-prompt text-center max-w-[60px]">
                          {beneficiary.label}
                        </span>
                      </div>
                    ))}
                    {/* Add placeholder icons to maintain visual consistency */}
                    {Array.from(
                      { length: Math.max(0, 3 - card.beneficiaries.length) },
                      (_, i) => (
                        <div
                          key={`placeholder-${i}`}
                          className="flex flex-col items-center opacity-30"
                        >
                          {/* Circular Icon - Placeholder */}
                          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center mb-1">
                            <span
                              className="text-lg text-white"
                              role="img"
                              aria-label="placeholder"
                            >
                              ❓
                            </span>
                          </div>
                          {/* Label underneath */}
                          <span className="text-xs text-gray-500 font-prompt text-center">
                            ----
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="w-full max-w-[325px]">
              <button
                onClick={handleNext}
                className="w-full h-[53px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
              >
                <span className="text-black text-center font-prompt text-lg font-medium leading-7 tracking-[0.4px] group-hover:text-[#EFBA31] group-active:text-[#EFBA31]">
                  ไปต่อ
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_Summary;
