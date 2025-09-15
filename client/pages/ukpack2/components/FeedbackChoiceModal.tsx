import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onChooseUse: () => void;
  onChooseNotSure: () => void;
}

const FeedbackChoiceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onChooseUse,
  onChooseNotSure,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-prompt font-semibold text-[#001a73]">
          ถ้ามีรถประจำทางแบบนี้คุณคิดว่าจะใช้บริการหรือไม่
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          ช่วยบอกเราเพื่อปรับปรุงบริการให้ตรงกับความต้องการของคุณ
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => {
              onChooseUse();
              onClose();
            }}
            className="flex-1 px-4 py-2 rounded-md bg-[#00d5f9] text-white font-prompt"
          >
            ใช้บริการแน่นอน
          </button>
          <button
            onClick={() => {
              onChooseNotSure();
              onClose();
            }}
            className="flex-1 px-4 py-2 rounded-md bg-gray-200 text-[#001a73] font-prompt"
          >
            ไม่แน่ใจ
          </button>
        </div>
        <div className="mt-3 text-right">
          <button onClick={onClose} className="text-sm text-gray-500">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackChoiceModal;
