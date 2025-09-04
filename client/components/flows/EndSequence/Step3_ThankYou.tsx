/**
 * UK PACK - End Sequence Step 3: Thank You
 * Moved from FinalThankYou component
 */

import { useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";
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
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="ขอบคุณสำหรับการมีส่วนร่วม"
            className="w-full h-full object-cover object-center"
            style={{ minWidth: "100%", aspectRatio: "2/3" }}
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0, 0, 0, 0.90)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-center items-center px-8">
            {/* Content Container */}
            <div className="w-full max-w-[325px]">
              {/* Title */}
              <div className="text-center mb-6">
                <h1 className="text-white text-center font-prompt text-[30px] font-normal leading-normal">
                  ขอบคุณที่ร่วมเป็นส่วนหนึ่ง
                  <br />
                  ในการพัฒนาเมือง
                </h1>
                <p className="text-white text-center font-prompt mt-4">
                  เราจะประกาศรางวัลทาง xxxxxxxxxxxxxxxxxx วันที่ xxxx xxxxx xxxx
                </p>
              </div>

              {/* Share Trigger Button (opens popup) */}
              <div className="mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="figma-style1-button"
                      aria-label="เปิดหน้าต่างแชร์"
                    >
                      <span className="figma-style1-button-text">
                        แชร์เกมนี้ให้เพื่อน
                      </span>
                    </button>
                  </DialogTrigger>

                  <DialogContent className="p-6 bg-white rounded-lg">
                    <DialogTitle className="font-prompt text-lg text-black mb-3">
                      แชร์เกมนี้
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 mb-4">
                      เลือกแพลตฟอร์มที่ต้องการแชร์
                    </DialogDescription>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        className="figma-style1-button"
                        onClick={handleShareFacebook}
                        aria-label="แชร์ไปยัง Facebook"
                      >
                        Facebook
                      </button>
                      <button
                        className="figma-style1-button"
                        onClick={handleShareX}
                        aria-label="แชร์ไปยัง X"
                      >
                        X
                      </button>
                      <button
                        className="figma-style1-button"
                        onClick={handleShareLine}
                        aria-label="แชร์ไปยัง LINE"
                      >
                        LINE
                      </button>
                      <button
                        className="figma-style1-button"
                        onClick={handleShareWhatsApp}
                        aria-label="แชร์ไปยัง WhatsApp"
                      >
                        WhatsApp
                      </button>
                      <button
                        className="figma-style1-button"
                        onClick={handleShareMessenger}
                        aria-label="แชร์ไปยัง Messenger"
                      >
                        Messenger
                      </button>
                      <button
                        className="figma-style1-button"
                        onClick={handleShareLinkedIn}
                        aria-label="แชร์ไปยัง LinkedIn"
                      >
                        LinkedIn
                      </button>
                      <button
                        className="figma-style1-button col-span-2"
                        onClick={handleCopyLink}
                        aria-label="คัดลอกลิงก์"
                      >
                        {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
                      </button>
                    </div>

                    <div className="mt-2">
                      <DialogClose asChild>
                        <button className="figma-style1-button--secondary w-full">
                          <span className="figma-style1-button-text">ปิด</span>
                        </button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Finish Button */}
              <div>
                <button
                  onClick={handleFinish}
                  className="figma-style1-button--secondary"
                >
                  <span className="figma-style1-button-text">จบเกม</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3_ThankYou;
