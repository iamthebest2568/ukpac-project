import { useState } from "react";

interface BeneficiaryGroupsProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const BeneficiaryGroups = ({ sessionID, onNavigate }: BeneficiaryGroupsProps) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const beneficiaryGroups = [
    { id: 'everyone', label: 'ทุกคน', icon: '👥' },
    { id: 'locals', label: 'คนในพื้นที่', icon: '🏘️' },
    { id: 'elderly', label: 'ผู้สูงอายุ', icon: '👴' },
    { id: 'students', label: 'นักเรียนนักศึกษา', icon: '🎓' },
    { id: 'disabled', label: 'คนพิการ', icon: '♿' },
    { id: 'other', label: 'XXX', icon: '❓' }
  ];

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev => {
      const isSelected = prev.includes(groupId);
      
      if (isSelected) {
        // Remove if already selected
        return prev.filter(g => g !== groupId);
      } else {
        // Add if not selected and under limit
        if (prev.length < 3) {
          return [...prev, groupId];
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    const data = { selectedGroups };
    onNavigate('ask04', data);
  };

  return (
    <div className="dark">
      <div className="game-container py-8">
        <h2 className="question-text">
          คุณคิดว่าใครควรได้รับการลดค่าโดยสารรถไฟฟ้าบ้าง
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {beneficiaryGroups.map((group) => (
            <div 
              key={group.id}
              className={`selection-card ${
                selectedGroups.includes(group.id) ? 'selected' : ''
              }`}
              onClick={() => handleGroupToggle(group.id)}
            >
              <div className="text-3xl mb-2">{group.icon}</div>
              <div className="text-sm font-medium text-white">{group.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-4 text-center text-sm text-gray-400">
          เลือกได้สูงสุด 3 กลุ่ม (เลือกแล้ว {selectedGroups.length}/3)
        </div>

        {/* Progress indicator */}
        <div className="mb-6 text-center">
          <div className="flex justify-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-game-yellow"></div>
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
          </div>
          <p className="text-sm text-gray-400">ขั้นตอนที่ 4 จาก 5</p>
        </div>

        <button 
          className="btn-primary"
          onClick={handleNext}
          disabled={selectedGroups.length === 0}
        >
          ต่อไป
        </button>
      </div>
    </div>
  );
};

export default BeneficiaryGroups;
