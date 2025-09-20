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
      <div className={`${contentClassName ? contentClassName : ""} bg-white rounded-xl p-6 mx-auto`} style={{ width: 'min(90vw,560px)' }}>
        <img src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F73d809c28e294624af386bf84a9a2d75?format=webp&width=800" alt="notice" className="mx-auto mb-4 w-24 h-24 object-contain" />
        <h3 className="text-lg font-prompt font-semibold text-[#000d59] text-center">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-700 text-center">{message}</p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            className="px-4 py-2 rounded-md bg-[#ffe000] text-black hover:bg-[#000d59] hover:text-white transition-colors"
            onClick={onCancel}
          >
            ยกเลิก
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
