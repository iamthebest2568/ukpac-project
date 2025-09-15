import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shareUrl?: string;
  shareText?: string;
}

const ShareModal: React.FC<Props> = ({ isOpen, onClose, shareUrl, shareText }) => {
  if (!isOpen) return null;
  const url = encodeURIComponent(shareUrl || window.location.href);
  const text = encodeURIComponent(shareText || 'ผม/ฉันได้ออกแบบรถเมล์ในฝัน ลองดูสิ');

  const openWindow = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const handleFacebook = () => {
    // Facebook sharer supports quote param for text
    const fb = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    openWindow(fb);
    onClose();
  };

  const handleLine = () => {
    // LINE share URL
    const line = `https://social-plugins.line.me/lineit/share?url=${url}`;
    openWindow(line);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
        <h3 className="text-lg font-prompt font-semibold text-[#000d59]">แชร์หน้าเพจนี้</h3>
        <p className="mt-2 text-sm text-gray-600">เลือกช่องทางที่ต้องการแชร์</p>
        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={handleFacebook}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#ffe000] text-black font-semibold hover:bg-[#000d59] hover:text-white transition-colors"
            aria-label="Share to Facebook"
          >
            แชร์ไปยัง Facebook
          </button>

          <button
            onClick={handleLine}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#ffe000] text-black font-semibold hover:bg-[#000d59] hover:text-white transition-colors"
            aria-label="Share to LINE"
          >
            แชร์ไปยัง LINE
          </button>

          <button onClick={onClose} className="mt-2 w-full px-4 py-2 rounded-md bg-[#ffe000] text-black border border-gray-200 hover:bg-[#000d59] hover:text-white transition-colors">ยกเลิก</button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
