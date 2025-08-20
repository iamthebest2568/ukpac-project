import { useState, useEffect } from "react";

interface BudgetAllocationProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const BudgetAllocation = ({ sessionID, onNavigate }: BudgetAllocationProps) => {
  const [budgetAllocation, setBudgetAllocation] = useState({
    trainDiscount: 0,
    busQuality: 0,
    parking: 0
  });

  const totalBudget = 100;
  const allocatedBudget = budgetAllocation.trainDiscount + budgetAllocation.busQuality + budgetAllocation.parking;
  const remainingBudget = totalBudget - allocatedBudget;

  const budgetItems = [
    { 
      key: 'trainDiscount', 
      label: 'ลดค่าโดยสารรถไฟฟ้า',
      description: 'การให้ส่วนลดค่าโดยสารระบบรถไฟฟ้า',
      icon: '🚇'
    },
    { 
      key: 'busQuality', 
      label: 'ปรับปรุงคุณภาพรถเมล์',
      description: 'การปรับปรุงและพัฒนาคุณภาพรถโดยสารประจำทาง',
      icon: '🚌'
    },
    { 
      key: 'parking', 
      label: 'ที่จอดรถ',
      description: 'การจัดหาและพัฒนาพื้นที่จอดรถ',
      icon: '🅿️'
    }
  ];

  const handleBudgetChange = (key: keyof typeof budgetAllocation, value: string) => {
    const numValue = parseInt(value) || 0;
    const currentTotal = Object.entries(budgetAllocation)
      .filter(([k]) => k !== key)
      .reduce((sum, [, v]) => sum + v, 0);
    
    // Ensure the new value doesn't exceed remaining budget
    const maxAllowable = totalBudget - currentTotal;
    const finalValue = Math.min(Math.max(0, numValue), maxAllowable);

    setBudgetAllocation(prev => ({
      ...prev,
      [key]: finalValue
    }));
  };

  const handleNext = () => {
    const data = { budgetAllocation };
    onNavigate('ask04', data);
  };

  const isComplete = allocatedBudget === totalBudget;
  const isOverBudget = allocatedBudget > totalBudget;

  return (
    <div className="theme-dark min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2">
            คุณจะให้งบประมาณแต่ละข้อเท่าไร
          </h1>
        </div>
        
        {/* Budget Status Display - Enhanced Visibility */}
        <div className="budget-display">
          <div className="budget-item">
            งบทั้งหมด: <span className="text-text-primary">{totalBudget} บาท</span>
          </div>
          <div className={`budget-remaining ${
            remainingBudget < 0 ? 'negative' : remainingBudget > 0 ? 'positive' : ''
          }`}>
            งบที่เหลือ: {remainingBudget} บาท
          </div>
          
          {/* Visual progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  isOverBudget ? 'bg-error' : allocatedBudget === totalBudget ? 'bg-success' : 'bg-primary-action'
                }`}
                style={{ width: `${Math.min((allocatedBudget / totalBudget) * 100, 100)}%` }}
                role="progressbar"
                aria-valuenow={allocatedBudget}
                aria-valuemin={0}
                aria-valuemax={totalBudget}
                aria-label={`ใช้งบประมาณไปแล้ว ${allocatedBudget} จาก ${totalBudget} บาท`}
              ></div>
            </div>
            <div className="text-caption mt-2 text-center">
              ใช้งบประมาณ {((allocatedBudget / totalBudget) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Answer Section */}
        <div className="answer-section">
          <div className="space-y-6">
            {budgetItems.map((item) => (
              <div key={item.key} className="border border-gray-600 rounded-lg p-4 bg-gray-800 bg-opacity-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3" role="img" aria-label={item.description}>
                      {item.icon}
                    </span>
                    <div>
                      <label 
                        htmlFor={`budget-${item.key}`}
                        className="text-body font-medium text-white block"
                      >
                        {item.label}
                      </label>
                      <div className="text-caption text-gray-300">{item.description}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    id={`budget-${item.key}`}
                    type="number"
                    min="0"
                    max={totalBudget}
                    value={budgetAllocation[item.key as keyof typeof budgetAllocation]}
                    onChange={(e) => handleBudgetChange(item.key as keyof typeof budgetAllocation, e.target.value)}
                    className="input-field w-24 text-center"
                    placeholder="0"
                    aria-describedby={`budget-${item.key}-description`}
                  />
                  <span className="text-body text-gray-300">บาท</span>
                  
                  {/* Visual indicator of allocation percentage */}
                  <div className="flex-1 bg-gray-600 rounded-full h-2 ml-4">
                    <div 
                      className="h-2 bg-primary-action rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((budgetAllocation[item.key as keyof typeof budgetAllocation] / totalBudget) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-caption text-gray-400 w-12 text-right">
                    {((budgetAllocation[item.key as keyof typeof budgetAllocation] / totalBudget) * 100).toFixed(0)}%
                  </span>
                </div>
                
                <div 
                  id={`budget-${item.key}-description`}
                  className="text-caption text-gray-400 mt-2"
                >
                  จัดสรร: {budgetAllocation[item.key as keyof typeof budgetAllocation]} บาท
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Messages - Error Prevention */}
        {isOverBudget && (
          <div className="status-message error">
            <strong>งบประมาณเกินที่กำหนด!</strong> กรุณาปรับลดจำนวนให้อยู่ในงบประมาณ {totalBudget} บาท
          </div>
        )}

        {remainingBudget > 0 && remainingBudget < totalBudget && (
          <div className="status-message warning">
            คุณยังม��งบประมาณเหลือ <strong>{remainingBudget} บาท</strong> กรุณาจัดสรรให้ครบ
          </div>
        )}

        {isComplete && (
          <div className="status-message success">
            <strong>เยี่ยม!</strong> คุณจัดสรรงบประมาณครบ {totalBudget} บาทแล้ว
          </div>
        )}

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 1 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 2 เสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="ขั้นตอนที่ 3 กำลังดำเนินการ"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 4"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 5"></div>
          </div>
          <p className="text-caption">ขั้นตอนที่ 3 จาก 5</p>
        </div>

        {/* Completion Zone */}
        <div className="completion-zone">
          <button 
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isComplete}
            aria-describedby="next-button-description"
          >
            ต่อไป
          </button>
          
          {!isComplete && (
            <div id="next-button-description" className="status-message info mt-4">
              กรุณาจัดสรรงบประมาณให้ครบ {totalBudget} บาทเพื่อดำเนินการต่อ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetAllocation;
