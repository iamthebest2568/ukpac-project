/**
 * UK PACK - MN3 Step 3: Budget Result Display
 * Moved from BudgetStep3Result component
 */

import { useEffect, useState } from "react";

interface Step3_ResultProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
}

interface ResultSummary {
  priority: string;
  allocation: number;
  percentage: number;
  icon: string;
}

const Step3_Result = ({ sessionID, onNext, onBack, journeyData }: Step3_ResultProps) => {
  const [resultSummary, setResultSummary] = useState<ResultSummary[]>([]);

  // Icons mapping for priorities
  const priorityIcons: { [key: string]: string } = {
    'ลดค่าโดยสารรถไฟฟ้า': '🚇',
    'ปรับปรุงคุณภาพรถเมล์': '🚌',
    'ตั๋วร่วม': '🎫',
    'เพิ่มความถี่รถเมล์': '🚍',
    'เพิ่มความถี่รถไฟฟ้า': '🚊',
    'เพิ่มที่จอดรถ': '🅿️',
    'เพิ่ม feeder ในซอย': '🚐'
  };

  useEffect(() => {
    // Get data from the previous step
    const allocationData = journeyData?.budget_step2_allocation?.budgetAllocation || {};
    const selectedPriorities = journeyData?.budget_step2_allocation?.selectedPriorities || [];
    const totalBudget = 100;

    // Create summary with percentages
    const summary: ResultSummary[] = selectedPriorities.map((priority: string) => ({
      priority,
      allocation: allocationData[priority] || 0,
      percentage: ((allocationData[priority] || 0) / totalBudget) * 100,
      icon: priorityIcons[priority] || '📋'
    }));

    // Sort by allocation amount (highest first)
    summary.sort((a, b) => b.allocation - a.allocation);
    setResultSummary(summary);
  }, [journeyData]);

  const handleNext = () => {
    const data = { budget_step3_result: { budgetResultReviewed: true, resultSummary } };
    onNext(data);
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Header with Refresh Icon */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-h2 text-black">
            ภาพเมืองในอนาคต
          </h1>
          <button 
            className="p-2 text-gray-600 hover:text-black transition-colors"
            aria-label="Refresh"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Main Polaroid Collage */}
        <div className="relative h-96 mb-12 flex items-center justify-center">
          {/* Polaroid Photo 1 - Left */}
          <div 
            className="absolute polaroid-frame"
            style={{
              transform: 'rotate(-12deg) translate(-60px, -20px)',
              zIndex: 1
            }}
          >
            <div className="polaroid-image bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
              <div className="text-6xl">
                {resultSummary[0]?.icon || '🏢'}
              </div>
            </div>
            <div className="polaroid-caption">
              {resultSummary[0]?.priority || 'รถไฟฟ้า'}
            </div>
          </div>

          {/* Polaroid Photo 2 - Center */}
          <div 
            className="absolute polaroid-frame"
            style={{
              transform: 'rotate(8deg) translate(0px, 30px)',
              zIndex: 3
            }}
          >
            <div className="polaroid-image bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
              <div className="text-6xl">
                {resultSummary[1]?.icon || '🚌'}
              </div>
            </div>
            <div className="polaroid-caption">
              {resultSummary[1]?.priority || 'รถเมล์'}
            </div>
          </div>

          {/* Polaroid Photo 3 - Right */}
          <div 
            className="absolute polaroid-frame"
            style={{
              transform: 'rotate(-5deg) translate(70px, -30px)',
              zIndex: 2
            }}
          >
            <div className="polaroid-image bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center">
              <div className="text-6xl">
                {resultSummary[2]?.icon || '🅿️'}
              </div>
            </div>
            <div className="polaroid-caption">
              {resultSummary[2]?.priority || 'ที่จอดรถ'}
            </div>
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
            ไปต่อ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3_Result;
