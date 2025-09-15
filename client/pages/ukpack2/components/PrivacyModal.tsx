import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h3 className="text-lg font-prompt font-semibold text-[#001a73]">นโยบายและความเป็นส่วนตัว</h3>
        <div className="mt-3 text-sm text-gray-700">
          <p>
            เราเก็บข้อมูลบางอย่างเพื่อปรับปรุงประสบการณ์การใช้งาน เช่น ตัวเลือกก���รออกแบบที่คุณเลือก ข้อมูลนี้จะถูกใช้เพื่อ
            การวิจัยและพัฒนาเท่านั้น และจะไม่มีการเปิดเผยข้อมูลติดต่อของคุณโดยไม่ได้รับความยินยอมจากคุณ
          </p>
          <p className="mt-2">
            หากต้องการทราบรายละเอียดเพิ่มเติม โปรดติดต่อทีมงานหรือดูเอกสารฉบับเต็มที่จัดเตรียมให้เมื่อระบบเชื่อมต่อกับ CMS
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-[#000d59] text-white">ปิด</button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
