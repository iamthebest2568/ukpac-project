import { useState } from "react";

interface ThankYouScreenProps {
  sessionID: string | null;
  onNavigate: (gameId: string) => void;
  journeyData?: any;
}

const ThankYouScreen = ({ sessionID, onNavigate }: ThankYouScreenProps) => {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="เม��องแห่งอนาคตที่สดใส"
            className="w-full h-full object-cover object-center"
            style={{ minWidth: "100%", aspectRatio: "2/3" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 44.17%)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-end items-center px-6 md:px-8 pb-8 md:pb-12">
            
            {/* Illustration Panel - Bright optimistic city skyline */}
            <div className="w-full max-w-[325px] mb-8">
              <div className="bg-gradient-to-t from-blue-100 to-sky-200 rounded-[20px] border-[1.5px] border-black p-6 relative overflow-hidden h-40 flex items-center justify-center">
                {/* Modern city skyline with train */}
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-2">🏙️</div>
                  <div className="text-lg mb-2">🚄</div>
                  <div className="text-xs text-gray-600 font-prompt">เมืองแห่งอนาคตที่สด��ส</div>
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
            <div className="text-center mb-8 max-w-[325px]">
              <h1
                className="text-white text-center font-prompt text-3xl font-normal leading-normal mb-6"
                style={{ fontSize: "clamp(24px, 7.5vw, 30px)" }}
              >
                ขอบคุณที่ร่วมเป็นส่วนหนึ่ง<br />
                ในการพัฒนาเมืองนี้ให้ดีขึ้น
              </h1>
              
              <p className="text-white text-center font-prompt text-lg leading-relaxed">
                ความคิดเห็นของคุณจะช่วยให้เราสร้างเมืองที่ดีขึ้นสำหรับทุกคน
              </p>
            </div>

            {/* Action buttons */}
            <div className="w-full max-w-[325px] space-y-4">
              <button
                onClick={() => {
                  // Placeholder - could navigate to rewards or sharing
                  console.log('Share data clicked');
                }}
                className="w-full h-[53px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
              >
                <span className="text-black text-center font-prompt text-lg font-medium leading-7 tracking-[0.4px] group-hover:text-[#EFBA31] group-active:text-[#EFBA31]">
                  แชร์ข้อมูลต่อ
                </span>
              </button>
              
              <button
                onClick={() => {
                  // Placeholder - could navigate to rewards system
                  console.log('Get reward clicked');
                }}
                className="w-full h-[53px] rounded-[40px] bg-white border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
              >
                <span className="text-black text-center font-prompt text-lg font-medium leading-7 tracking-[0.4px] group-hover:text-white group-active:text-white">
                  รับรางวัล
                </span>
              </button>
            </div>

            {/* Session info (for development) */}
            {sessionID && (
              <div className="mt-6 p-3 bg-black bg-opacity-50 rounded-[15px] text-center">
                <div className="text-white text-sm font-prompt">
                  Session ID: {sessionID}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouScreen;
