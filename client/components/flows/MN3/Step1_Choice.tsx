/**
 * UK PACK - MN3 Step 1: Budget Choice Selection
 * Moved from BudgetStep1Choice component
 */

import { useState } from "react";
import { logEvent } from '../../../services/dataLogger.js';

interface Step1_ChoiceProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
}

const Step1_Choice = ({ sessionID, onNext, onBack, initialData }: Step1_ChoiceProps) => {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
    initialData?.top3BudgetChoices || []
  );
  const maxSelections = 3;

  const priorities = [
    'ลดค่าโดยสารรถไฟฟ้า',
    'ปรับปรุงคุณภาพรถเมล์',
    'ตั๋วร่วม',
    'เพิ่มความถี่รถเมล์',
    'เพิ่มความถี่รถไฟฟ้า',
    'เพิ่มที่จอดรถ',
    'เพิ่ม feeder ในซอย'
  ];

  const handlePriorityToggle = (priority: string) => {
    setSelectedPriorities(prev => {
      const isSelected = prev.includes(priority);
      
      if (isSelected) {
        // Remove if already selected
        return prev.filter(p => p !== priority);
      } else {
        // Add if not selected and under limit
        if (prev.length < maxSelections) {
          return [...prev, priority];
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    // Log the budget choice selection
    logEvent({
      event: 'BUDGET_STEP1_COMPLETE',
      payload: {
        top3Choices: selectedPriorities,
        sessionID
      }
    });

    const data = { budget_step1_choice: { top3BudgetChoices: selectedPriorities } };
    onNext(data);
  };

  const isSelectionDisabled = (priority: string) => {
    return selectedPriorities.length >= maxSelections && !selectedPriorities.includes(priority);
  };

  const isComplete = selectedPriorities.length === maxSelections;

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2 text-center text-black">
            คุณคิดว่าควรใช้เงินที่ได้จากการเก็บไปพัฒนาอะไร ก่อน 3 อันดับแรก
          </h1>
        </div>
        
        {/* Answer Section */}
        <div className="answer-section">
          <div className="space-y-4">
            {priorities.map((priority, index) => (
              <div 
                key={index}
                className={`selection-checkbox-white ${
                  selectedPriorities.includes(priority) ? 'selected' : ''
                } ${isSelectionDisabled(priority) ? 'disabled' : ''}`}
                onClick={() => !isSelectionDisabled(priority) && handlePriorityToggle(priority)}
                role="checkbox"
                aria-checked={selectedPriorities.includes(priority)}
                aria-disabled={isSelectionDisabled(priority)}
                tabIndex={isSelectionDisabled(priority) ? -1 : 0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isSelectionDisabled(priority)) {
                    e.preventDefault();
                    handlePriorityToggle(priority);
                  }
                }}
              >
                <div className="checkbox-icon">
                  {selectedPriorities.includes(priority) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" role="img" aria-label="เลือกแล้ว">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-body text-black">{priority}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status - Selection Counter */}
        <div className="selection-counter text-black">
          เลือกให้ครบ {maxSelections} ข้อ (เลือกแล้ว {selectedPriorities.length}/{maxSelections})
        </div>

        {/* Error Prevention Message */}
        {selectedPriorities.length >= maxSelections && (
          <div className="status-message warning">
            คุณเลือกครบจำนวนแล้ว หากต้องการเลือกข้อใหม่ กรุณายกเลิกการเลือกข้อใดข้อหนึ่งก่อน
          </div>
        )}

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 1 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 2 เสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="ขั้นตอนที่ 3 กำลังดำเนินการ"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 4"></div>
            <div className="progress-dot inactive" aria-label="ขั���นตอนที่ 5"></div>
          </div>
          <p className="text-caption text-black">ขั้นตอนที่ 3 จาก 5</p>
        </div>

        {/* Completion Zone */}
        <div className="completion-zone">
          
          <button 
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isComplete}
            aria-describedby="next-button-description"
          >
            ไปต่อ
          </button>
          
          {!isComplete && (
            <div id="next-button-description" className="status-message info mt-4">
              กรุณาเลือกให้ครบ {maxSelections} ข้อเพื่อดำเนินการต่อ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1_Choice;
