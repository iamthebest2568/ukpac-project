import { useEffect, useState } from "react";

interface BudgetStep3ResultProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData?: any;
}

interface ResultSummary {
  priority: string;
  allocation: number;
  percentage: number;
  icon: string;
}

const BudgetStep3Result = ({ sessionID, onNavigate, journeyData }: BudgetStep3ResultProps) => {
  const [resultSummary, setResultSummary] = useState<ResultSummary[]>([]);

  // Icons mapping for priorities
  const priorityIcons: { [key: string]: string } = {
    'ลดค่าโดยสารรถไฟฟ้า': '🚇',
    'ปรับปรุงคุณภาพรถเมล์': '🚌',
    'ตั๋��ร่วม': '🎫',
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
    const data = { budgetResultReviewed: true };
    onNavigate('ask04', data);
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Illustration Panel - Future City Collage */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg relative overflow-hidden p-6">
            <div className="text-center">
              <h2 className="text-h3 text-black mb-4">ภาพเมืองในอนาคต</h2>
              
              {/* Polaroid-style photos representing choices */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
                {resultSummary.map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white p-3 rounded-lg shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-300"
                    style={{ 
                      transform: `rotate(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                    }}
                  >
                    <div className="bg-gray-100 rounded aspect-square flex items-center justify-center mb-2">
                      <div className="text-4xl" role="img" aria-label={item.priority}>
                        {item.icon}
                      </div>
                    </div>
                    <div className="text-caption text-black text-center font-medium">
                      {item.priority}
                    </div>
                    <div className="text-caption text-gray-600 text-center">
                      {item.allocation} หน่วย ({item.percentage.toFixed(0)}%)
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Future city elements */}
              <div className="mt-6 flex justify-center space-x-4 text-3xl opacity-70">
                <span role="img" aria-label="อาคารสูง">🏢</span>
                <span role="img" aria-label="ต้นไม้">🌳</span>
                <span role="img" aria-label="รถไฟฟ้า">🚊</span>
                <span role="img" aria-label="ผู้คน">👥</span>
                <span role="img" aria-label="โครงสร้างพื้นฐาน">🌉</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="question-section">
          <h1 className="text-h2 text-center text-black">
            สรุปการจัดสรรงบประมาณของคุณ
          </h1>
        </div>

        {/* Results Display */}
        <div className="answer-section">
          <div className="space-y-4">
            {resultSummary.map((item, index) => (
              <div 
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl" role="img" aria-label={item.priority}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-body font-semibold text-black">
                      {item.priority}
                    </h3>
                    <p className="text-caption text-gray-600">
                      อันดับที่ {index + 1} ในความสำคัญ
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-body font-semibold text-black">
                    {item.allocation} หน่วย
                  </div>
                  <div className="text-caption text-gray-600">
                    {item.percentage.toFixed(1)}% ของงบทั้งหมด
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Message */}
        <div className="context-info">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-body text-black">
              <strong>ยอดเยี่ยม!</strong> คุณได้วางแผนการใช้งบประมาณเพื่อพัฒนาเมืองในอนาคตแล้ว
            </p>
            <p className="text-caption text-gray-600 mt-2">
              การจัดสรรงบประมาณนี้จะช่วยให้เมืองของเรามีการพัฒนาที่ตอบสนองความต้องการของประชาชน
            </p>
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

export default BudgetStep3Result;
