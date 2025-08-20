import { useState } from "react";

interface PolicyPrioritiesProps {
  sessionID: string | null;
  onNavigate: (gameId: string) => void;
}

const PolicyPriorities = ({ sessionID, onNavigate }: PolicyPrioritiesProps) => {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

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
        if (prev.length < 3) {
          return [...prev, priority];
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    console.log({
      sessionID: sessionID,
      game: 'priorities',
      data: selectedPriorities
    });
    onNavigate('thankYou');
  };

  return (
    <div className="dark">
      <div className="game-container py-8">
        <h2 className="question-text">
          คุณคิดว่าควรใช้เงินที่ได้จากการเก็บไปพัฒนาอะไร
        </h2>
        
        <div className="space-y-4 mb-8">
          {priorities.map((priority, index) => (
            <div 
              key={index}
              className="flex items-center p-4 rounded-lg border border-gray-600 cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => handlePriorityToggle(priority)}
            >
              <div className={`w-5 h-5 rounded border-2 mr-3 flex-shrink-0 flex items-center justify-center ${
                selectedPriorities.includes(priority) 
                  ? 'bg-game-yellow border-game-yellow' 
                  : 'border-gray-400'
              }`}>
                {selectedPriorities.includes(priority) && (
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-white">{priority}</span>
            </div>
          ))}
        </div>

        <div className="mb-4 text-center text-sm text-gray-400">
          เลือกได้สูงสุด 3 ข้อ (เลือกแล้ว {selectedPriorities.length}/3)
        </div>

        <button 
          className="btn-primary"
          onClick={handleNext}
          disabled={selectedPriorities.length === 0}
        >
          ต่อไป
        </button>
      </div>
    </div>
  );
};

export default PolicyPriorities;
