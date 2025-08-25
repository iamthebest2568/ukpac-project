/**
 * UK PACK - Index Page with Dashboard Access
 * Main landing page with survey and dashboard options
 */

import { useNavigate } from 'react-router-dom';

const DashboardIndex = () => {
  const navigate = useNavigate();
  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-green-100 rounded-full mb-6">
            <span className="text-3xl" role="img" aria-label="Thailand flag">🇹🇭</span>
          </div>
          <h1 className="text-h1 text-center text-black mb-4">
            ยินดีต้อนรับสู่ UK PACK
          </h1>
          <p className="text-body text-center text-gray-700 max-w-2xl mx-auto">
            แพลตฟอร์มเพื่อการมีส่วนร่วมในการพัฒนานโยบายการขนส่งสาธารณะของประเทศไทย
          </p>
        </div>

        {/* Main Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Survey Option */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" role="img" aria-label="Survey">📋</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">เข้าร่วมแบบสำรวจ</h2>
              <p className="text-gray-600 mb-6">
                แสดงความคิดเห็นและมีส่วนร่วมในการออกแบบนโยบายการขนส่งสาธารณะ
              </p>
              <button
                onClick={() => navigate('/ask01')}
                className="btn btn-primary w-full"
              >
                เริ่มแบบสำรวจ
              </button>
            </div>
          </div>

          {/* Dashboard Option */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" role="img" aria-label="Dashboard">📊</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">���ดชบอร์ดการวิเคราะห์</h2>
              <p className="text-gray-600 mb-6">
                เข้าสู่ระบบเพื่อดูข้อมูลการวิเคราะห์และสถิติการมีส่วนร่วมของประชาชน
              </p>
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn btn-secondary w-full"
              >
                เข้าสู่แดชบอร์ด
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">คุณสมบัติของระบบ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🎯</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">แบบสำรวจเชิงโต้ตอบ</h4>
              <p className="text-sm text-gray-600">มีส่วนร่วมผ่านเกมและกิจกรรมที่น่าสนใจ</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📈</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">การวิเคราะห์เรียลไทม์</h4>
              <p className="text-sm text-gray-600">ติดตามความคิดเห็นและแนวโน้มได้ทันที</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🤝</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">การมีส่วนร่วมของประช��ชน</h4>
              <p className="text-sm text-gray-600">เปิดโอกาสให้ทุกคนมีเสียงในการตัดสินใจ</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-green-800">ระบบทำงานปกติ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIndex;
