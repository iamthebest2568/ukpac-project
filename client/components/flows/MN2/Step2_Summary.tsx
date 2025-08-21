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

const Step2_Summary = ({ sessionID, onNext, onBack, journeyData }: Step2_SummaryProps) => {
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);

  // Beneficiary mapping for icons and labels
  const beneficiaryMapping = {
    'everyone': { label: 'ทุกคน', icon: '👥' },
    'locals': { label: 'คนในพื้นที่', icon: '🏘️' },
    'elderly': { label: 'ผู้สูง���ายุ', icon: '👴' },
    'students': { label: 'นักเรียนนักศึกษา', icon: '🎓' },
    'disabled': { label: 'คนพิการ', icon: '♿' },
    'other': { label: 'อื่นๆ', icon: '❓' }
  };

  useEffect(() => {
    // Extract data from journey
    const prioritiesData = journeyData?.priorities?.selectedPriorities || [];
    const beneficiariesData = journeyData?.beneficiaries?.selectedGroups || [];

    // Convert beneficiary IDs to display objects with icons and labels
    const beneficiaryObjects = beneficiariesData.map((id: string) =>
      beneficiaryMapping[id as keyof typeof beneficiaryMapping] || { label: id, icon: '❓' }
    );

    // Create summary cards - map each priority to the selected beneficiaries
    const cards: SummaryCard[] = prioritiesData.map((priority: string) => ({
      priority,
      beneficiaries: beneficiaryObjects
    }));

    setSummaryCards(cards);
  }, [journeyData]);

  const handleNext = () => {
    const data = { summary: { summaryReviewed: true, summaryCards } };
    onNext(data);
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2 text-center text-black">
            นโยบายเพิ่มเติมที่คุณเสนอ
          </h1>
        </div>
        
        {/* Summary Cards Section */}
        <div className="answer-section">
          <div className="space-y-6">
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-xl p-6 shadow-sm border border-gray-200"
              >
                {/* Policy Name - Sub-header */}
                <h3 className="text-h3 font-semibold text-black mb-6">
                  {card.priority}
                </h3>

                {/* Beneficiary Icons Row */}
                <div className="flex flex-wrap gap-4">
                  {card.beneficiaries.map((beneficiary, beneficiaryIndex) => (
                    <div
                      key={beneficiaryIndex}
                      className="flex flex-col items-center"
                    >
                      {/* Black Circular Icon */}
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-2">
                        <span className="text-xl text-white" role="img" aria-label={beneficiary.label}>
                          {beneficiary.icon}
                        </span>
                      </div>
                      {/* Label underneath */}
                      <span className="text-caption text-black font-medium text-center">
                        {beneficiary.label}
                      </span>
                    </div>
                  ))}
                  {/* Add placeholder icons to maintain visual consistency */}
                  {Array.from({ length: Math.max(0, 4 - card.beneficiaries.length) }, (_, i) => (
                    <div
                      key={`placeholder-${i}`}
                      className="flex flex-col items-center"
                    >
                      {/* Black Circular Icon - Placeholder */}
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mb-2">
                        <span className="text-xl text-white" role="img" aria-label="placeholder">
                          ❓
                        </span>
                      </div>
                      {/* Label underneath */}
                      <span className="text-caption text-gray-500 font-medium text-center">
                        XXXX
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 1 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 2 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 3 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 4 เสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="ขั้นตอนที่ 5 กำลังดำเนินการ"></div>
          </div>
          <p className="text-caption text-black">ขั้นตอนที่ 5 จาก 5</p>
        </div>

        {/* Completion Zone */}
        <div className="completion-zone">
          {onBack && (
            <button 
              className="btn btn-secondary mb-4"
              onClick={onBack}
            >
              ← กลับ
            </button>
          )}
          
          <button 
            className="btn btn-primary"
            onClick={handleNext}
          >
            ต่อไป
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2_Summary;
