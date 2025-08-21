/**
 * UK PACK - MN1 Step 1: Priorities Selection
 * Moved from PolicyPriorities component
 */

import { useState } from "react";

interface Step1_PrioritiesProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: string[];
}

const Step1_Priorities = ({ sessionID, onNext, onBack, initialData = [] }: Step1_PrioritiesProps) => {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(initialData);
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
    const data = { priorities: { selectedPriorities } };
    onNext(data);
  };

  const isSelectionDisabled = (priority: string) => {
    return selectedPriorities.length >= maxSelections && !selectedPriorities.includes(priority);
  };

  return (
    <div className="theme-dark min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2">
            คุณคิดว่าควรใช้เงินที่ได้จากการเก็บไปพัฒนาอะไร
          </h1>
        </div>
        
        {/* Answer Section */}
        <div className="answer-section">
          <div className="space-y-4">
            {priorities.map((priority, index) => (
              <div 
                key={index}
                className={`selection-checkbox ${
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
                    <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20" role="img" aria-label="เลือกแล้ว">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-body text-white">{priority}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status - Selection Counter */}
        <div className="selection-counter">
          เลือกได้สูงสุด {maxSelections} ข้อ (เลือกแล้ว {selectedPriorities.length}/{maxSelections})
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
            <div className="progress-dot inactive" aria-label="ขั้���ตอนที่ 4"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 5"></div>
          </div>
          <p className="text-caption">ขั้นตอนที่ 3 จาก 5</p>
        </div>

        {/* Completion Zone */}
        <div className="completion-zone">
          
          <button 
            className="btn btn-primary"
            onClick={handleNext}
            disabled={selectedPriorities.length === 0}
            aria-describedby="next-button-description"
          >
            ไปต่อ
          </button>
          
          {selectedPriorities.length === 0 && (
            <div id="next-button-description" className="status-message info mt-4">
              กรุณาเลือกอย่างน้อย 1 ข้อเพื่อดำเนินการต่อ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1_Priorities;
