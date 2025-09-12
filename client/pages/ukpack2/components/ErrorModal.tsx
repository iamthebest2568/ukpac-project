import React from 'react';

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, title = 'Error', message = '', onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-prompt font-semibold text-[#000d59]">{title}</h3>
        <p className="mt-2 text-sm text-gray-700">{message}</p>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 rounded-md bg-[#000d59] text-white" onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
