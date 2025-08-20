interface EndScreenProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData: any;
}

const EndScreen = ({ sessionID, onNavigate, journeyData }: EndScreenProps) => {
  const handleReward = () => {
    console.log('Reward claimed', { sessionID, journeyData });
    // Could navigate to reward form or external link
  };

  const handleDetails = () => {
    console.log('Details form requested', { sessionID, journeyData });
    // Could navigate to details form
  };

  const handleShare = () => {
    console.log('Share with friends', { sessionID });
    // Could open share dialog or copy link
    if (navigator.share) {
      navigator.share({
        title: 'ร่วมพัฒนาเมืองไทยให้ดีขึ้น',
        text: 'มาร่วมแสดงความคิดเห็นเกี่ยวกับน���ยบายการพัฒนาเมืองกับเราด้วย!',
        url: window.location.origin
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.origin);
      alert('ลิงก์ถูกคัดลอกแล้ว!');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="game-container py-8">
        {/* Final illustration - bright optimistic city */}
        <div className="illustration-panel">
          <div className="flex items-center justify-center h-48 bg-gradient-to-t from-blue-100 via-green-100 to-yellow-100 rounded-lg relative overflow-hidden">
            {/* Success celebration background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-green-200 opacity-30"></div>
            
            {/* Celebratory elements */}
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-3">🎉</div>
              <div className="text-lg font-bold text-gray-800 mb-2">เสร็จสิ้น!</div>
              <div className="text-sm text-gray-600">ขอบคุณสำหรับการมีส่วนร่วม</div>
            </div>

            {/* Floating celebration icons */}
            <div className="absolute top-4 left-4 text-2xl animate-bounce">⭐</div>
            <div className="absolute top-6 right-6 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>🎊</div>
            <div className="absolute bottom-6 left-6 text-2xl animate-bounce" style={{animationDelay: '1s'}}>🌟</div>
            <div className="absolute bottom-4 right-4 text-2xl animate-bounce" style={{animationDelay: '1.5s'}}>✨</div>

            {/* Modern city skyline */}
            <div className="absolute bottom-0 left-0 right-0 h-16">
              <div className="flex justify-center space-x-1 h-full items-end">
                <div className="w-4 h-12 bg-blue-400 rounded-t-sm opacity-80"></div>
                <div className="w-3 h-10 bg-indigo-400 rounded-t-sm opacity-80"></div>
                <div className="w-5 h-14 bg-blue-500 rounded-t-sm opacity-80"></div>
                <div className="w-2 h-8 bg-sky-400 rounded-t-sm opacity-80"></div>
                <div className="w-4 h-11 bg-indigo-500 rounded-t-sm opacity-80"></div>
                <div className="w-3 h-9 bg-blue-400 rounded-t-sm opacity-80"></div>
                <div className="w-4 h-13 bg-sky-500 rounded-t-sm opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank you message */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-6 leading-tight">
            ขอบคุณ!
          </h1>
          
          <p className="text-gray-700 text-lg mb-4 leading-relaxed">
            ขอบคุณที่ร่วมเป็นส่วนหนึ่ง<br />
            ในการพัฒนาเมืองนี้ให้ดีขึ้น
          </p>

          <p className="text-gray-600 text-base leading-relaxed">
            ความคิดเห็นของคุณจะช่วยให้เราสร้างเมืองที่ดีขึ้นสำหรับทุกคน
          </p>
        </div>

        {/* Three action sections */}
        <div className="space-y-4 mb-8">
          {/* Reward Section */}
          <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
            <div className="flex items-center mb-3">
              <div className="text-3xl mr-3">🎁</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">ลุ้นรับรางวัล!</h3>
                <p className="text-gray-600 text-sm">บัตรโดยสารมูลค่า 300 บาท</p>
              </div>
            </div>
            <button 
              className="btn-primary w-full"
              onClick={handleReward}
            >
              🎲 เข้าร่วมการจับรางวัล
            </button>
          </div>

          {/* Details Section */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center mb-3">
              <div className="text-3xl mr-3">📝</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">ข้อมูลเพิ่มเติม</h3>
                <p className="text-gray-600 text-sm">กรอกข้อมูลเพื่อรับข่าวสารและรางวัล</p>
              </div>
            </div>
            <button 
              className="btn-secondary w-full"
              onClick={handleDetails}
            >
              ✍️ กรอกข้อมูล
            </button>
          </div>

          {/* Share Section */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border-2 border-green-200">
            <div className="flex items-center mb-3">
              <div className="text-3xl mr-3">🤝</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">แชร์ชวนเพื่อน</h3>
                <p className="text-gray-600 text-sm">ชวนเพื่อนมาร่วมพัฒนาเมืองด้วยกัน</p>
              </div>
            </div>
            <button 
              className="btn-secondary w-full"
              onClick={handleShare}
            >
              📱 แชร์เลย
            </button>
          </div>
        </div>

        {/* Journey summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">สรุปการเดินทางของคุณ:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>✅ ตอบคำถามเกี่ยวกับนโยบาย</p>
            <p>✅ ร่วมกิจกรรมเชิงโต้ตอบ</p>
            <p>✅ แสดงความคิดเห็นที่มีค่า</p>
            <p>✅ ช่วยพัฒ���าเมืองไทย</p>
          </div>
        </div>

        {/* Start over option */}
        <div className="mt-8 text-center">
          <button 
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            onClick={() => onNavigate('index')}
          >
            🔄 เริ่มต้นใหม่
          </button>
        </div>

        {/* Session info for development */}
        {sessionID && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center text-xs text-gray-500">
            Session: {sessionID}
          </div>
        )}
      </div>
    </div>
  );
};

export default EndScreen;
