/**
 * UK PACK - MN2 Step 1: Beneficiaries Selection
 * Moved from BeneficiaryGroups component
 */

import { useState } from "react";
import { logEvent } from '../../../services/dataLogger.js';

interface Step1_BeneficiariesProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: string[];
}

const Step1_Beneficiaries = ({ sessionID, onNext, onBack, initialData = [] }: Step1_BeneficiariesProps) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(initialData);
  const maxSelections = 3;

  const beneficiaryGroups = [
    { id: 'everyone', label: 'ทุกคน', icon: '👥', description: 'ประชาชนทุกคน' },
    { id: 'locals', label: 'คนในพื้นที่', icon: '🏘️', description: 'ผู้ที่อาศัยในพื้นที่' },
    { id: 'elderly', label: 'ผู้สูงอายุ', icon: '👴', description: 'ผู้สูงอายุ 60 ปีขึ้นไป' },
    { id: 'students', label: 'นักเรียนนักศึกษา', icon: '🎓', description: 'นักเรียนและนักศึกษา' },
    { id: 'disabled', label: 'คนพิการ', icon: '♿', description: 'ผู้พิการทุกประเภท' },
    { id: 'other', label: 'อื่นๆ', icon: '❓', description: 'กลุ่มอื่นๆ ที่เฉพาะเจาะจง' }
  ];

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev => {
      const isSelected = prev.includes(groupId);
      
      if (isSelected) {
        // Remove if already selected
        return prev.filter(g => g !== groupId);
      } else {
        // Add if not selected and under limit
        if (prev.length < maxSelections) {
          return [...prev, groupId];
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    // Log the minigame completion
    logEvent({
      event: 'MINIGAME_MN2_COMPLETE',
      payload: {
        selectedGroups,
        sessionID
      }
    });

    const data = { beneficiaries: { selectedGroups } };
    onNext(data);
  };

  const isSelectionDisabled = (groupId: string) => {
    return selectedGroups.length >= maxSelections && !selectedGroups.includes(groupId);
  };

  return (
    <div className="theme-dark min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2">
            คุณคิดว่าใครควรได้รับการลดค่าโดยสารรถไฟฟ้าบ้าง
          </h1>
        </div>
        
        {/* Answer Section */}
        <div className="answer-section">
          <div className="grid grid-cols-2 gap-4">
            {beneficiaryGroups.map((group) => (
              <div 
                key={group.id}
                className={`selection-card ${
                  selectedGroups.includes(group.id) ? 'selected' : ''
                } ${isSelectionDisabled(group.id) ? 'disabled' : ''}`}
                onClick={() => !isSelectionDisabled(group.id) && handleGroupToggle(group.id)}
                role="checkbox"
                aria-checked={selectedGroups.includes(group.id)}
                aria-disabled={isSelectionDisabled(group.id)}
                aria-describedby={`group-${group.id}-description`}
                tabIndex={isSelectionDisabled(group.id) ? -1 : 0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isSelectionDisabled(group.id)) {
                    e.preventDefault();
                    handleGroupToggle(group.id);
                  }
                }}
              >
                <div className="text-4xl mb-3" role="img" aria-label={group.description}>
                  {group.icon}
                </div>
                <div className="text-body font-medium text-white mb-1">
                  {group.label}
                </div>
                <div 
                  id={`group-${group.id}-description`}
                  className="text-caption text-gray-300"
                >
                  {group.description}
                </div>
                
                {/* Selection indicator */}
                {selectedGroups.includes(group.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary-action rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20" role="img" aria-label="เลือก��ล้ว">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* System Status - Selection Counter */}
        <div className="selection-counter">
          เลือกได้สูงสุด {maxSelections} กลุ่ม (เลือกแล้ว {selectedGroups.length}/{maxSelections})
        </div>

        {/* Error Prevention Message */}
        {selectedGroups.length >= maxSelections && (
          <div className="status-message warning">
            คุณเลือกครบจำนวนแล้ว หากต้องการเลือกกลุ่มใหม่ กรุณายกเลิกการเลือกกลุ่มใดกลุ่มหนึ่งก่อน
          </div>
        )}

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 1 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 2 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="��ั้นตอนที่ 3 เสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="ขั้นต��นที่ 4 กำลังดำเนินการ"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 5"></div>
          </div>
          <p className="text-caption">ขั้นตอนที่ 4 จาก 5</p>
        </div>

        {/* Completion Zone */}
        <div className="completion-zone">
          
          <button 
            className="btn btn-primary"
            onClick={handleNext}
            disabled={selectedGroups.length === 0}
            aria-describedby="next-button-description"
          >
            ไปต่อ
          </button>
          
          {selectedGroups.length === 0 && (
            <div id="next-button-description" className="status-message info mt-4">
              กรุณาเลือกอย่างน้อย 1 กลุ่มเพื่อดำเนินการต่อ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1_Beneficiaries;
