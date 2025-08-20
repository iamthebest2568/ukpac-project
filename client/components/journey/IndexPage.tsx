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
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Hero Section */}
        <div className="section-spacing">
          <div className="illustration-panel">
            <div className="flex items-center justify-center h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg relative overflow-hidden">
              <div className="text-6xl mb-2" role="img" aria-label="เมืองและการขนส่ง">🏙️</div>
              <div className="absolute top-4 right-6 text-2xl" role="img" aria-label="รถไฟ">🚄</div>
              <div className="absolute bottom-2 left-4 text-lg" role="img" aria-label="ประชาชน">👥</div>
              <div className="absolute bottom-2 right-4 text-lg" role="img" aria-label="การพัฒนา">🌱</div>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-h1">
              ร่วมพัฒนาเมืองไทย<br />
              ให้ดีขึ้นไปด้วยกัน
            </h1>
            
            <p className="text-body text-text-secondary leading-relaxed section-spacing">
              แบบสำรวจเชิงโต้ตอบเพื่อรับฟังความคิดเห็น<br />
              เกี่ยวกับการพัฒนาระบบขนส่งสาธารณะ
            </p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="answer-section">
          <div className="space-y-4">
            {journeyOptions.map((option) => (
              <div
                key={option.id}
                className={`relative p-6 rounded-lg cursor-pointer transition-all duration-normal hover:transform hover:scale-[1.02] hover:shadow-lg border-2 ${
                  option.recommended ? 'border-primary-action bg-primary-action bg-opacity-5' : 'border-border-color'
                }`}
                onClick={() => onNavigate(option.id)}
                role="button"
                tabIndex={0}
                aria-describedby={`option-${option.id}-description`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(option.id);
                  }
                }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-5 rounded-lg`}></div>
                
                {/* Recommended Badge */}
                {option.recommended && (
                  <div className="absolute -top-2 -right-2 bg-primary-action text-black text-micro font-bold px-3 py-1 rounded-full">
                    แนะนำ
                  </div>
                )}
                
                {/* Content */}
                <div className="relative flex items-center">
                  <div className="text-4xl mr-4" role="img" aria-label={option.description}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-body font-bold text-text-primary mb-2">{option.title}</h3>
                    <p 
                      id={`option-${option.id}-description`}
                      className="text-caption text-text-secondary leading-relaxed"
                    >
                      {option.description}
                    </p>
                  </div>
                  <div className="text-text-secondary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-label="ไปยัง">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Call to Action */}
        <div className="completion-zone text-center">
          <button 
            className="btn btn-primary mb-4"
            onClick={() => onNavigate('ask01')}
            aria-describedby="start-description"
          >
            <span className="mr-2" role="img" aria-label="เริ่มต้น">🚀</span>
            เริ่มต้นเลย
          </button>
          <div id="start-description" className="text-caption text-text-secondary">
            ใช้เวลาประมาณ 3-5 นาที
          </div>
        </div>

        {/* About Section */}
        <div className="section-spacing">
          <div className="context-info">
            <h3 className="text-body font-bold text-text-primary mb-3">เกี่ยวกับแบบสำรวจนี้</h3>
            <div className="space-y-2 text-caption text-text-secondary">
              <div className="flex items-start">
                <span className="mr-2 text-success">✓</span>
                <p>ข้อมูลที่คุณให้จะถูกใช้เพื่อการพัฒนานโยบายเท่านั้น</p>
              </div>
              <div className="flex items-start">
                <span className="mr-2 text-success">✓</span>
                <p>ไม่มีการเก็บข้อมูลส่วนตัว</p>
              </div>
              <div className="flex items-start">
                <span className="mr-2 text-success">✓</span>
                <p>สามารถออกจากแบบสำรวจได้ตลอดเวลา</p>
              </div>
              <div className="flex items-start">
                <span className="mr-2 text-success">✓</span>
                <p>ผลลัพธ์จะถูกนำไปประกอบการตัดสินใจนโยบาย</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility information */}
        <div className="status-message info">
          <strong>การเข้าถึง:</strong> แบบสำรวจนี้รองรับการใช้งานผ่านแป้นพิมพ์และโปรแกรมอ่านหน้าจอ
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
