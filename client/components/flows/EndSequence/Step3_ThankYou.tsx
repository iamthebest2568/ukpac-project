/*
 * UK PACK - End Sequence Step 3: Thank You
 * Standardized layout to match other pages
 */

import { useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout.ukpack1";
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
    logEvent({
      event: "FINAL_FINISH_CLICKED",
      payload: { action: "finished", sessionID },
    });
    onNext({ action: "finished", completedAt: new Date().toISOString() });
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

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  const handleShareFacebook = () => {
    logEvent({ event: "SHARE", payload: { method: "facebook", sessionID } });
    openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`);
  };
  const handleShareX = () => {
    logEvent({ event: "SHARE", payload: { method: "x", sessionID } });
    openShareWindow(
      `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    );
  };
  const handleShareLine = () => {
    logEvent({ event: "SHARE", payload: { method: "line", sessionID } });
    openShareWindow(
      `https://social-plugins.line.me/lineit/share?url=${shareUrl}`,
    );
  };
  const handleShareWhatsApp = () => {
    logEvent({ event: "SHARE", payload: { method: "whatsapp", sessionID } });
    openShareWindow(
      `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`,
    );
  };
  const handleShareLinkedIn = () => {
    logEvent({ event: "SHARE", payload: { method: "linkedin", sessionID } });
    openShareWindow(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    );
  };

  const handleCopyLink = async () => {
    const plainUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(plainUrl);
      setCopied(true);
      logEvent({ event: "SHARE", payload: { method: "copy", sessionID } });
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert("คัดลอกลิงก์ไม่สำเร็จ กรุณาคัดลอกด้วยตนเอง: " + plainUrl);
    }
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fa142e56a252746dbbac7b784e4e2e204?format=webp&width=800"
      backgroundAlt="ขอบคุณสำหรับการมีส่วนร่วม"
      className="source-selection-page endseq-thankyou-page fake-news-page"
      imageLoading="eager"
    >
      <div
        className="w-full max-w-[980px] mx-auto px-4 py-8 text-center"
        style={{ paddingTop: "clamp(192px, 36vh, 320px)", color: "#000D59" }}
      >
        <h1
          className="font-prompt"
          style={{ color: "#000D59", fontWeight: 700, lineHeight: "1" }}
        >
          <span
            style={{
              display: "block",
              fontSize: "clamp(28px, 6.5vw, 70px)",
              lineHeight: 1,
            }}
          >
            <span style={{ fontWeight: 700 }}>ขอบคุณ</span>
            <span
              style={{
                fontWeight: 400,
                fontSize: "clamp(24px, 5.6vw, 60px)",
                marginLeft: "8px",
              }}
            >
              ที่ร่วมเป็นส่วนหนึ่ง
            </span>
          </span>
          <span
            style={{
              display: "block",
              fontSize: "clamp(24px, 5.6vw, 60px)",
              fontWeight: 400,
            }}
          >
            ในการพัฒนา���มือง
          </span>
        </h1>

        <div
          className="mt-6 rounded-lg p-4 max-w-[820px] mx-auto"
          style={{
            backgroundImage:
              "url('https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fd74a496f41864e85b8e90e0a2616c7c5?format=webp&width=800')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            minHeight: "140px",
          }}
        >
          <h2
            className="font-prompt sr-only"
            style={{
              color: "#000D59",
              fontSize: "clamp(20px,4.6vw,50px)",
              fontWeight: 700,
            }}
          >
            เราจะประกาศรางวัล
            <br />
            ทาง xxxxxxxxxxx วันที่ xx xxxx xxxx
          </h2>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="btn-large">แชร์เกมนี้ให้เพื่อน</button>
            </DialogTrigger>
            <DialogContent className="p-4 sm:p-6 bg-white rounded-lg max-w-md mx-auto max-h-[85vh] overflow-y-auto border border-gray-200">
              <DialogTitle className="font-prompt text-lg sm:text-xl text-black mb-3 text-center">
                แชร์เกมนี้ให้เพื่อน
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mb-4 text-center">
                เลือกแพลตฟอร์มที่ต้องการแชร์
              </DialogDescription>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  className="btn-primary"
                  style={{
                    backgroundColor: "#FFE000",
                    color: "#000",
                    border: "1px solid #000",
                  }}
                  onClick={handleShareFacebook}
                >
                  Facebook
                </button>
                <button
                  className="btn-primary"
                  style={{
                    backgroundColor: "#FFE000",
                    color: "#000",
                    border: "1px solid #000",
                  }}
                  onClick={handleShareLine}
                >
                  LINE
                </button>
              </div>

              <div className="mt-2">
                <DialogClose asChild>
                  <button className="btn-secondary w-full">ปิด</button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>

          <button onClick={handleFinish} className="btn-large">
            จบเกม
          </button>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step3_ThankYou;
