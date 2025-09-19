import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  // optional class to control modal inner content (e.g., for horizontal padding)
  contentClassName?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Confirm",
  message = "",
  onConfirm,
  onCancel,
  contentClassName,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`${contentClassName ? contentClassName : ""} bg-white rounded-lg p-6 max-w-md w-full`}>
        <h3 className="text-lg font-prompt font-semibold text-[#000d59]">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-700">{message}</p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md bg-[#ffe000] text-black hover:bg-[#000d59] hover:text-white transition-colors"
            onClick={onCancel}
          >
            ยก���ลิก
          </button>
          <button
            className="px-4 py-2 rounded-md bg-[#ffe000] text-black hover:bg-[#000d59] hover:text-white transition-colors"
            onClick={onConfirm}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
