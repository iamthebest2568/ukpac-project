import { useState } from "react";

interface ThankYouScreenProps {
  sessionID: string | null;
  onNavigate: (gameId: string) => void;
}

const ThankYouScreen = ({ sessionID, onNavigate }: ThankYouScreenProps) => {
  return (
    <div className="bg-white min-h-screen">
      <div className="game-container py-8">
        {/* Illustration Panel - Bright optimistic city skyline */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-40 bg-gradient-to-t from-blue-100 to-sky-200 rounded-lg relative overflow-hidden">
            {/* Modern city skyline with train */}
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-2">🏙️</div>
              <div className="text-lg mb-2">🚄</div>
              <div className="text-xs text-gray-600">เมืองแห่งอนาคตที่สดใส</div>
            </div>
            
            {/* Modern buildings silhouette */}
            <div className="absolute bottom-0 left-0 right-0 h-12">
              <div className="flex justify-center space-x-1 h-full items-end">
                <div className="w-4 h-10 bg-blue-400 rounded-t-sm"></div>
                <div className="w-3 h-8 bg-indigo-400 rounded-t-sm"></div>
                <div className="w-5 h-12 bg-blue-500 rounded-t-sm"></div>
                <div className="w-2 h-6 bg-sky-400 rounded-t-sm"></div>
                <div className="w-4 h-9 bg-indigo-500 rounded-t-sm"></div>
                <div className="w-3 h-7 bg-blue-400 rounded-t-sm"></div>
                <div className="w-4 h-11 bg-sky-500 rounded-t-sm"></div>
              </div>
            </div>

            {/* Sun/light effect */}
            <div className="absolute top-2 right-4 w-8 h-8 bg-yellow-300 rounded-full opacity-80"></div>
            <div className="absolute top-1 right-3 w-10 h-10 bg-yellow-200 rounded-full opacity-40"></div>
          </div>
        </div>

        {/* Thank you message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-6 leading-relaxed">
            ขอบคุณที่ร่วมเป็นส่วนหนึ่ง<br />
            ในการพัฒนาเมืองนี้ให้ดีขึ้น
          </h1>
          
          <p className="text-gray-700 text-lg mb-8">
            ความคิดเห็นของคุณจะช่วยให้เราสร้างเมืองที่ดีขึ้นสำหรับทุกคน
          </p>
        </div>

        {/* Action buttons (placeholder for now) */}
        <div className="space-y-4">
          <button 
            className="btn-primary"
            onClick={() => {
              // Placeholder - could navigate to rewards or sharing
              console.log('Share data clicked');
            }}
          >
            แชร์ข้อมูลต่อ
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => {
              // Placeholder - could navigate to rewards system
              console.log('Get reward clicked');
            }}
          >
            รับรางวัล
          </button>
        </div>

        {/* Session info (for development) */}
        {sessionID && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
            Session ID: {sessionID}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThankYouScreen;
