/**
 * UK PACK - End Sequence Step 3: Thank You
 * Moved from FinalThankYou component
 */

import { useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../ui/dialog";

interface Step3_ThankYouProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
}

const Step3_ThankYou = ({
  sessionID,
  onNext,
  onBack,
  journeyData,
}: Step3_ThankYouProps) => {
  const [copied, setCopied] = useState(false);

  const handleFinish = () => {
    // Log the finish game action
    logEvent({
      event: "FINAL_FINISH_CLICKED",
      payload: {
        action: "finished",
        sessionID,
      },
    });

    onNext({ action: "finished", completedAt: new Date().toISOString() });
  };

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  const getShareUrl = () => {
    try {
      return window.location.href;
    } catch (e) {
      return "https://your-site.example";
    }
  };

  const shareText = encodeURIComponent(
    "ร่วมเล่นเกมนี้เพื่อพัฒนาเมืองและมีสิทธิ์ลุ้นรับรางวัล!",
  );
  const shareUrl = encodeURIComponent(getShareUrl());

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    logEvent({ event: "SHARE", payload: { method: "facebook", sessionID } });
    openShareWindow(url);
  };

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
    logEvent({ event: "SHARE", payload: { method: "x", sessionID } });
    openShareWindow(url);
  };

  const handleShareLine = () => {
    const url = `https://social-plugins.line.me/lineit/share?url=${shareUrl}`;
    logEvent({ event: "SHARE", payload: { method: "line", sessionID } });
    openShareWindow(url);
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
    logEvent({ event: "SHARE", payload: { method: "whatsapp", sessionID } });
    openShareWindow(url);
  };

  const handleShareMessenger = () => {
    const messengerUrl = `fb-messenger://share?link=${shareUrl}`;
    const fallback = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    logEvent({ event: "SHARE", payload: { method: "messenger", sessionID } });

    // Detect mobile devices — messenger app typically available on mobile.
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent || "",
      );

    if (isMobile) {
      // Try navigating to messenger protocol which should open the app on mobile.
      // If it fails (unsupported), after a short delay open the fallback web sharer.
      try {
        window.location.href = messengerUrl;
        // Open fallback after a delay in case protocol fails silently
        setTimeout(() => {
          openShareWindow(fallback);
        }, 1200);
      } catch (e) {
        openShareWindow(fallback);
      }
    } else {
      // On desktop, open Facebook sharer (Messenger desktop apps are less consistent)
      openShareWindow(fallback);
    }
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    logEvent({ event: "SHARE", payload: { method: "linkedin", sessionID } });
    openShareWindow(url);
  };

  const handleCopyLink = async () => {
    const plainUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(plainUrl);
      setCopied(true);
      logEvent({ event: "SHARE", payload: { method: "copy", sessionID } });
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback: prompt
      // eslint-disable-next-line no-alert
      alert("คัดลอกลิงก์ไม่สำเร็จ กรุณาคัดลอกด้วยตนเอง: " + plainUrl);
    }
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Feb2f14480a1349a6bc6b76594e26c7b5?format=webp&width=2160"
      backgroundAlt="ขอบคุณสำหรับการมีส่วนร่วม"
      className="source-selection-page endseq-thankyou-page"
      imageLoading="eager"
    >
      {/* Title positioned as in Figma */}
      <div className="absolute w-full text-center" style={{ top: '47.5%' }}>
        <h1 className="font-prompt text-center leading-normal" style={{ color: '#000D59', fontWeight: 700, lineHeight: 'normal' }}>
          <span style={{ fontSize: 'clamp(28px, 6.5vw, 70px)' }}>ขอบคุณ</span>
          <span style={{ fontSize: 'clamp(24px, 5.6vw, 60px)' }}>ที่ร่วมเป็นส่วนหนึ่ง<br />ในการพัฒนาเมือง</span>
        </h1>
      </div>

      {/* Announcement section with yellow background */}
      <div className="absolute w-full flex flex-col items-center" style={{ top: '57%' }}>
        <div className="relative flex items-center justify-center" style={{ width: '75.1%', maxWidth: '811px', height: 'clamp(200px, 24.6vw, 473px)' }}>
          {/* Yellow background image */}
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/e2b1791c9c56554c16de656934f22c2f3ec4bdf7?width=1622"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ borderRadius: '40px' }}
          />

          {/* Announcement text */}
          <div className="relative z-10 text-center px-4">
            <h2 className="font-prompt text-center leading-normal" style={{ color: '#000D59', fontWeight: 700, lineHeight: 'normal' }}>
              <span style={{ fontSize: 'clamp(28px, 6.5vw, 70px)' }}>เราจะประกาศรางวัล<br /></span>
              <span style={{ fontSize: 'clamp(24px, 5.6vw, 60px)' }}>ทาง xxxxxxxxxxx<br />วันที่ xx xxxx xxxx</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Buttons positioned as in Figma */}
      <div className="absolute w-full flex flex-col items-center" style={{ top: '83%' }}>
        <div className="flex flex-col" style={{ width: '80.9%', maxWidth: '874px', gap: 'clamp(20px, 1.56vw, 30px)' }}>
          <div className="relative flex justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="transition-all duration-200 bg-[#FFE000] hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group flex items-center justify-center touch-target"
                  style={{
                    width: 'clamp(300px, 78.2vw, 845px)',
                    height: 'clamp(50px, 6.1vw, 118px)',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  aria-label="เปิดหน้าต่างแชร์เกมนี้ให้เพื่อน"
                  aria-haspopup="dialog"
                  type="button"
                >
                  <span
                    className="font-prompt text-center text-black group-hover:text-[#FFE000] group-active:text-[#FFE000]"
                    style={{
                      fontSize: 'clamp(18px, 4.6vw, 50px)',
                      fontWeight: 400,
                      letterSpacing: '0.4px',
                      lineHeight: 'normal'
                    }}
                  >
                    แชร์เกมนี้ให้เพื่อน
                  </span>
                </button>
              </DialogTrigger>

              <DialogContent className="p-6 bg-white rounded-lg max-w-md mx-auto max-h-[80vh] overflow-y-auto">
                <DialogTitle className="font-prompt text-lg text-black mb-3">
                  แชร์เกมนี้
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mb-4">
                  เลือกแพลตฟอร์มที่ต้องการแชร์
                </DialogDescription>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    className="btn-primary text-sm py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: '#FFE000', color: '#000', border: '1px solid #000' }}
                    onClick={handleShareFacebook}
                    aria-label="แชร์ไปยัง Facebook"
                  >
                    Facebook
                  </button>
                  <button
                    className="btn-primary text-sm py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: '#FFE000', color: '#000', border: '1px solid #000' }}
                    onClick={handleShareX}
                    aria-label="แชร์ไปยัง X"
                  >
                    X
                  </button>
                  <button
                    className="btn-primary text-sm py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: '#FFE000', color: '#000', border: '1px solid #000' }}
                    onClick={handleShareLine}
                    aria-label="แชร์ไปยัง LINE"
                  >
                    LINE
                  </button>
                  <button
                    className="btn-primary text-sm py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: '#FFE000', color: '#000', border: '1px solid #000' }}
                    onClick={handleShareWhatsApp}
                    aria-label="แชร์ไปยัง WhatsApp"
                  >
                    WhatsApp
                  </button>
                  <button
                    className="btn-primary text-sm py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: '#FFE000', color: '#000', border: '1px solid #000' }}
                    onClick={handleShareMessenger}
                    aria-label="แชร์ไปยัง Messenger"
                  >
                    Messenger
                  </button>
                  <button
                    className="btn-primary text-sm py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: '#FFE000', color: '#000', border: '1px solid #000' }}
                    onClick={handleShareLinkedIn}
                    aria-label="แชร์ไปยัง LinkedIn"
                  >
                    LinkedIn
                  </button>
                  <button
                    className="btn-primary text-sm py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 col-span-2"
                    style={{ backgroundColor: copied ? '#10b981' : '#FFE000', color: '#000', border: '1px solid #000' }}
                    onClick={handleCopyLink}
                    aria-label="คัดลอกลิงก์"
                  >
                    {copied ? "คัดลอกแล้ว ✓" : "คัดลอกลิงก์"}
                  </button>
                </div>

                <div className="mt-2">
                  <DialogClose asChild>
                    <button
                      className="btn-secondary w-full py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: '#E9E9E9', color: '#000', border: '1px solid #000' }}
                    >
                      ปิด
                    </button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative flex justify-center">
            <button
              onClick={handleFinish}
              className="transition-all duration-200 bg-[#FFE000] hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group flex items-center justify-center"
              style={{
                width: 'clamp(300px, 78.2vw, 845px)',
                height: 'clamp(50px, 6.1vw, 118px)',
                borderRadius: '50px',
                border: 'none'
              }}
            >
              <span
                className="font-prompt text-center text-black group-hover:text-[#FFE000] group-active:text-[#FFE000]"
                style={{
                  fontSize: 'clamp(18px, 4.6vw, 50px)',
                  fontWeight: 400,
                  letterSpacing: '0.4px',
                  lineHeight: 'normal'
                }}
              >
                จบเกม
              </span>
            </button>
          </div>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step3_ThankYou;
