interface IndexPageProps {
  onNavigate: (screenId: string) => void;
}

const IndexPage = ({ onNavigate }: IndexPageProps) => {
  const journeyOptions = [
    {
      id: 'ask01',
      title: 'เริ่มต้นการเดินทาง',
      description: 'ร่วมแสดงความคิดเห็นเกี่ยวกับนโยบายการพัฒนาเมือง',
      icon: '🚀',
      color: 'from-blue-500 to-purple-600',
      recommended: true
    },
    {
      id: 'priorities',
      title: 'นโยบายการพัฒนา',
      description: 'เลือกสิ่งที่คุณคิดว่าควรพัฒนาเป็นอันดับแรก',
      icon: '🎯',
      color: 'from-green-500 to-blue-500',
    },
    {
      id: 'beneficiaries',
      title: 'กลุ่มผู้ได้รับประโยชน์',
      description: 'ใครควรได้รับการลดค่าโดยสารรถไฟฟ้า',
      icon: '👥',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'budget',
      title: 'การจัดสรรงบประมาณ',
      description: 'วางแผนการใช้งบประมาณให้เกิดประโยชน์สูงสุด',
      icon: '💰',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'fakeNews',
      title: 'การรับมือข่าวปลอม',
      description: 'เรียนรู้วิธีการตรวจสอบข้อมูลข่าวสาร',
      icon: '📰',
      color: 'from-red-500 to-pink-500',
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="game-container py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="illustration-panel">
            <div className="flex items-center justify-center h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg relative overflow-hidden">
              <div className="text-6xl mb-2">🏙️</div>
              <div className="absolute top-4 right-6 text-2xl">🚄</div>
              <div className="absolute bottom-2 left-4 text-lg">👥</div>
              <div className="absolute bottom-2 right-4 text-lg">🌱</div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-black mb-4 leading-tight">
            ร่วมพัฒนาเมืองไทย<br />
            ให้ดีขึ้นไปด้วยกัน
          </h1>
          
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            แบบสำรวจเชิงโต้ตอบเพื่อรับฟังความคิดเห็น<br />
            เกี่ยวกับการพัฒนาระบบขนส่งสาธารณะ
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="space-y-4 mb-8">
          {journeyOptions.map((option) => (
            <div
              key={option.id}
              className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                option.recommended ? 'ring-2 ring-game-yellow' : ''
              }`}
              onClick={() => onNavigate(option.id)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-10 rounded-xl`}></div>
              
              {/* Recommended Badge */}
              {option.recommended && (
                <div className="absolute -top-2 -right-2 bg-game-yellow text-black text-xs font-bold px-3 py-1 rounded-full">
                  แนะนำ
                </div>
              )}
              
              {/* Content */}
              <div className="relative flex items-center">
                <div className="text-4xl mr-4">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-2">{option.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{option.description}</p>
                </div>
                <div className="text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start Button */}
        <div className="text-center">
          <button 
            className="btn-primary max-w-xs mb-4"
            onClick={() => onNavigate('ask01')}
          >
            🚀 เริ่มต้นเลย
          </button>
          
          <p className="text-sm text-gray-500">
            ใช้เวลาประมาณ 3-5 นาที
          </p>
        </div>

        {/* About Section */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-bold text-black mb-3">เกี่ยวกับแบบสำรวจนี้</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• ข้อมูลที่คุณให้จะถูกใช้เพื่อการพัฒนานโยบายเท่านั้น</p>
            <p>• ไม่มีการเก็บข้อมูลส่วนตัว</p>
            <p>• สามารถออกจากแบบสำรวจได้ตลอดเวลา</p>
            <p>• ผลลัพธ์จะถูกนำไปประกอบการตัดสินใจนโยบาย</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
