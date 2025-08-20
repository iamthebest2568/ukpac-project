import { useState } from "react";

interface FakeNewsTestProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const FakeNewsTest = ({ sessionID, onNavigate }: FakeNewsTestProps) => {
  const handleAction = (action: 'search' | 'ignore') => {
    const data = { action };
    onNavigate('endScreen', data);
  };

  return (
    <div className="dark">
      <div className="game-container py-8">
        {/* Illustration Panel */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-32 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg relative overflow-hidden">
            {/* Stylized train moving through dark city */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
            <div className="relative z-10 text-center">
              <div className="text-4xl mb-2">🚆</div>
              <div className="text-xs text-gray-300">รถไฟในเมืองยามค่ำคืน</div>
            </div>
            {/* City silhouette */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent">
              <div className="flex justify-center space-x-2 h-full items-end">
                <div className="w-3 h-6 bg-gray-800"></div>
                <div className="w-2 h-4 bg-gray-700"></div>
                <div className="w-4 h-8 bg-gray-800"></div>
                <div className="w-2 h-3 bg-gray-700"></div>
                <div className="w-3 h-7 bg-gray-800"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Text */}
        <div className="mb-8">
          <p className="text-white leading-relaxed text-lg">
            ตอนนี้มีข้อมูลที่ขัดแย้งกันของนโยบาย เช่น บางทีบอกว่าเก็บ 20 บ้าง ก็ 80 บ้าง 
            บ้างก็บอกว่า ไม่เก็บ รถ 4 ที่นั่ง บ้างก็เก็บหมด คุณคิดว่าจะทำอย่างไร
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button 
            className="btn-secondary"
            onClick={() => handleAction('ignore')}
          >
            ไม่ทำอะไร ��ึงเวลาก็รู้เอง
          </button>
          
          <button
            className="btn-primary"
            onClick={() => handleAction('search')}
          >
            หาข่าวต่อ
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-game-yellow"></div>
          </div>
          <p className="text-sm text-gray-400">ขั้นตอนสุดท้าย</p>
        </div>
      </div>
    </div>
  );
};

export default FakeNewsTest;
