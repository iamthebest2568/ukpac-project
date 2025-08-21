/**
 * UK PACK - MN3 Step 2: Budget Allocation
 * Moved from BudgetStep2Allocation component
 */

import { useState, useEffect } from "react";
import { logEvent } from '../../../services/dataLogger.js';

interface Step2_AllocationProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
}

interface BudgetAllocation {
  [key: string]: number;
}

const Step2_Allocation = ({ sessionID, onNext, onBack, journeyData }: Step2_AllocationProps) => {
  const [budgetAllocation, setBudgetAllocation] = useState<BudgetAllocation>({});
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  const totalBudget = 100;

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
    // Get the top 3 choices from the previous step
    const top3Choices = journeyData?.budget_step1_choice?.top3BudgetChoices || [];
    setSelectedPriorities(top3Choices);
    
    // Initialize budget allocation with 0 for each selected priority
    const initialAllocation: BudgetAllocation = {};
    top3Choices.forEach((priority: string) => {
      initialAllocation[priority] = 0;
    });
    setBudgetAllocation(initialAllocation);
  }, [journeyData]);

  const allocatedBudget = Object.values(budgetAllocation).reduce((sum, value) => sum + value, 0);
  const remainingBudget = totalBudget - allocatedBudget;

  const handleBudgetChange = (priority: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const currentTotal = Object.entries(budgetAllocation)
      .filter(([key]) => key !== priority)
      .reduce((sum, [, v]) => sum + v, 0);
    
    // Ensure the new value doesn't exceed remaining budget
    const maxAllowable = totalBudget - currentTotal;
    const finalValue = Math.min(Math.max(0, numValue), maxAllowable);

    setBudgetAllocation(prev => ({
      ...prev,
      [priority]: finalValue
    }));
  };

  const handleNext = () => {
    // Log the budget allocation completion
    logEvent({
      event: 'BUDGET_STEP2_COMPLETE',
      payload: {
        budgetAllocation,
        allocatedBudget,
        selectedPriorities,
        sessionID
      }
    });

    const data = {
      budget_step2_allocation: {
        budgetAllocation,
        allocatedBudget,
        selectedPriorities
      }
    };
    onNext(data);
  };

  const isComplete = allocatedBudget === totalBudget;
  const isOverBudget = allocatedBudget > totalBudget;

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2 text-center text-black">
            คุณจ���ให้งบประมาณแต่ละข้อเท่าไร
          </h1>
        </div>
        
        {/* Budget Status Display */}
        <div className="budget-display-white">
          <div className="budget-item text-black">
            งบทั้งหมด: <span className="text-primary-action">{totalBudget}</span>
          </div>
          <div className={`budget-remaining ${
            remainingBudget < 0 ? 'negative' : remainingBudget > 0 ? 'positive' : ''
          } text-black`}>
            งบที่เหลือ: {remainingBudget}
          </div>
          
          {/* Visual progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  isOverBudget ? 'bg-red-500' : allocatedBudget === totalBudget ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min((allocatedBudget / totalBudget) * 100, 100)}%` }}
                role="progressbar"
                aria-valuenow={allocatedBudget}
                aria-valuemin={0}
                aria-valuemax={totalBudget}
                aria-label={`ใช้งบประมาณไ��แล้ว ${allocatedBudget} จาก ${totalBudget}`}
              ></div>
            </div>
            <div className="text-caption mt-2 text-center text-black">
              ใช้งบประมาณ {((allocatedBudget / totalBudget) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Answer Section - Dynamic content based on selected priorities */}
        <div className="answer-section">
          <div className="space-y-6">
            {selectedPriorities.map((priority) => (
              <div key={priority} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3" role="img" aria-label={priority}>
                      {priorityIcons[priority] || '📋'}
                    </span>
                    <div>
                      <label 
                        htmlFor={`budget-${priority}`}
                        className="text-body font-medium text-black block"
                      >
                        {priority}
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    id={`budget-${priority}`}
                    type="number"
                    min="0"
                    max={totalBudget}
                    value={budgetAllocation[priority] || 0}
                    onChange={(e) => handleBudgetChange(priority, e.target.value)}
                    className="input-field w-24 text-center text-black border-gray-300"
                    placeholder="0"
                    aria-describedby={`budget-${priority}-description`}
                  />
                  <span className="text-body text-gray-600">หน่วย</span>
                  
                  {/* Visual indicator of allocation percentage */}
                  <div className="flex-1 bg-gray-200 rounded-full h-2 ml-4">
                    <div 
                      className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(((budgetAllocation[priority] || 0) / totalBudget) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-caption text-gray-500 w-12 text-right">
                    {(((budgetAllocation[priority] || 0) / totalBudget) * 100).toFixed(0)}%
                  </span>
                </div>
                
                <div 
                  id={`budget-${priority}-description`}
                  className="text-caption text-gray-500 mt-2"
                >
                  จัดสรร: {budgetAllocation[priority] || 0} หน่วย
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Messages - Error Prevention */}
        {isOverBudget && (
          <div className="status-message error">
            <strong>งบประมาณเกินที่กำหนด!</strong> กรุณาปรับลดจำนวนให้อยู่ในงบประมาณ {totalBudget} หน่วย
          </div>
        )}

        {remainingBudget > 0 && remainingBudget < totalBudget && (
          <div className="status-message warning">
            คุณยังมีงบประมาณเหลือ <strong>{remainingBudget} หน่วย</strong> กรุณาจัดสรรให้ครบ
          </div>
        )}

        {isComplete && (
          <div className="status-message success">
            <strong>เยี่ยม!</strong> คุณจัดสรรงบประมาณครบ {totalBudget} หน่วยแล้ว
          </div>
        )}

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 1 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 2 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 3 เสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="ขั้นตอนที่ 4 กำลังดำเนินการ"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 5"></div>
          </div>
          <p className="text-caption text-black">ขั้นตอนที่ 4 จาก 5</p>
        </div>

        {/* Completion Zone */}
        <div className="completion-zone">
          
          <button 
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isComplete}
            aria-describedby="next-button-description"
          >
            ไปต���อ
          </button>
          
          {!isComplete && (
            <div id="next-button-description" className="status-message info mt-4">
              กรุณาจัดสรรงบประมาณให้ครบ {totalBudget} หน่วยเพื่อดำเนินการต่อ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2_Allocation;
