/**
 * UK PACK - Index Page with Dashboard Access
 * Main landing page with survey and dashboard options
 */

import { useNavigate } from "react-router-dom";

const DashboardIndex = () => {
  const navigate = useNavigate();
  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-green-100 rounded-full mb-6">
            <span className="text-3xl" role="img" aria-label="Thailand flag">
              🇹🇭
            </span>
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
                <span className="text-2xl" role="img" aria-label="Survey">
                  📋
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                เข้าร่วมแบบสำรวจ
              </h2>
              <p className="text-gray-600 mb-6">
                แสดงความคิดเห็นและมีส่วนร่วมในการออกแบบนโยบายการขนส่งสาธารณะ
              </p>
              <button
                onClick={() => navigate("/ask01")}
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
                <span className="text-2xl" role="img" aria-label="Dashboard">
                  📊
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                ���ดชบอร์ดการวิเคราะห์
              </h2>
              <p className="text-gray-600 mb-6">
                เข้าสู่ระบบเพื่อดูข้อมูลการวิเคราะห์และสถิติการมีส่วนร่วมของประชาชน
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-secondary w-full"
              >
                เข้าสู่แดชบอร์ด
              </button>
            </div>
          </div>
        </div>

        {/* Video Intro Option */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" role="img" aria-label="Video">
                  🎬
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                วิดีโอเชิงโต้ตอบ
              </h2>
              <p className="text-gray-600 mb-6">
                ประสบการณ์การเรียนรู้เกี่ยวกับนโยบายผ่านวิดีโอแบบ immersive
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate("/video-intro")}
                  className="btn btn-primary w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  เริ่มชมวิดีโอ (Fixed)
                </button>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => navigate("/video-intro-test")}
                    className="btn btn-secondary bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    🔧 Test
                  </button>
                  <button
                    onClick={() => navigate("/video-intro-original")}
                    className="btn btn-secondary bg-gray-600 hover:bg-gray-700 text-white text-sm"
                  >
                    📱 Original
                  </button>
                  <button
                    onClick={() => {
                      console.log("Current state:");
                      console.log(
                        "- YouTube API loaded:",
                        !!(window as any).YT,
                      );
                      console.log(
                        "- Scripts in DOM:",
                        document.querySelectorAll('script[src*="youtube.com"]')
                          .length,
                      );
                      console.log(
                        "- Callback set:",
                        !!(window as any).onYouTubeIframeAPIReady,
                      );
                    }}
                    className="btn btn-secondary bg-orange-600 hover:bg-orange-700 text-white text-sm"
                  >
                    🐛 Debug
                  </button>
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  Fixed: Robust API loading | Test: Diagnostics | Original:
                  Legacy | Debug: Console info
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            คุณสมบัติของระบบ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">��</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                แบบสำรวจเชิงโต้ตอบ
              </h4>
              <p className="text-sm text-gray-600">
                มีส่วนร่วมผ่านเกมและกิจกรรมที่น่าสนใจ
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📈</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                การวิเคราะห์เรียลไทม์
              </h4>
              <p className="text-sm text-gray-600">
                ติดตามความคิดเห็นและแนวโน้มได้ทันที
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🤝</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                การมีส่วนร่วมของประชาชน
              </h4>
              <p className="text-sm text-gray-600">
                เปิดโอกาสให้ทุกคนมีเสียงในการตัดสินใจ
              </p>
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
