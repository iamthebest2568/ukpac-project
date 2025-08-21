import { useEffect, useState } from "react";

interface PolicySummaryProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData?: any;
}

interface SummaryCard {
  priority: string;
  beneficiaries: string[];
}

const PolicySummary = ({ sessionID, onNavigate, journeyData }: PolicySummaryProps) => {
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);

  // Beneficiary mapping for icons and labels
  const beneficiaryMapping = {
    'everyone': { label: 'ทุกคน', icon: '👥' },
    'locals': { label: 'คนในพื้นที่', icon: '🏘️' },
    'elderly': { label: 'ผู้สูงอายุ', icon: '👴' },
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
    const data = { summaryReviewed: true };
    onNavigate('ask04', data);
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
          <div className="space-y-4">
            {summaryCards.map((card, index) => (
              <div 
                key={index}
                className="bg-gray-100 rounded-lg p-6 border border-gray-200"
              >
                {/* Priority Title */}
                <h3 className="text-body font-semibold text-black mb-4">
                  {card.priority}
                </h3>
                
                {/* Beneficiary Labels */}
                <div className="flex flex-wrap gap-2">
                  {card.beneficiaries.map((beneficiary, beneficiaryIndex) => (
                    <span 
                      key={beneficiaryIndex}
                      className="inline-flex items-center px-3 py-1 rounded-full text-caption bg-gray-200 text-gray-700 border border-gray-300"
                    >
                      {beneficiary}
                    </span>
                  ))}
                  {/* Add placeholder labels to match the mockup structure */}
                  {Array.from({ length: Math.max(0, 4 - card.beneficiaries.length) }, (_, i) => (
                    <span 
                      key={`placeholder-${i}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-caption bg-gray-200 text-gray-500 border border-gray-300"
                    >
                      XXXX
                    </span>
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

export default PolicySummary;
