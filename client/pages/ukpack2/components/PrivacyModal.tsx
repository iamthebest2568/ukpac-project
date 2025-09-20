import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h3 className="text-lg font-prompt font-semibold text-[#001a73]">
          ประกาศความเป็นส่วนตัว (PDPA)
        </h3>
        <div className="mt-3 text-sm text-gray-700">
          <p className="mb-3">เกมนี้จะเก็บข้อมูลพฤติกรรมการเล่นและ ที่อยู่ IP ของอุปกรณ์
          เพื่อใช้ในการ วิเคราะห์ พัฒนา และสรุปผ��ความคิดเห็นในภาพรวมของผู้เล่น</p>

          <p className="mb-3">ข้อมูลที่เก็บจะถูก จัดเก็บอย่างปลอดภัย นำมาใช้เฉพาะภาพรวม และไม่สามารถระบุตัวตนได้ โดยข้อมูลจะถูกเก็บ ไม่เกิน 2 ปี หรือจนกว่าจะเสร็จสิ้นกระบวนการวิเคราะห์</p>

          <p className="mb-3">หากท่านเข้าร่วมกิจกรรมลุ้นรับรางวัล จะมีการเก็บ ชื่อและเบอร์โทรศัพท์
          เพื่อใช้ในการ ติดต่อและรับของรางวัลเท่านั้น โดยข้อมูลส่วนนี้จะถูกลบเมื่อกิจกรรมสิ้นสุด</p>

          <p className="mb-3">โดยการกด “เริ่มเกม” ถือว่าท่านยินยอมให้มีการเก็บและประมวลผลข้อมูลดังกล่าว
          ���าม พระราชบัญญัติคุมครองข้อมูลส่วนบุคคล พ.ศ. 2562</p>

          <p className="mb-0">หากต้องการสอบถามหรือลบข้อมูลของท่าน
          สามารถติดต่อได้ที่: บริษัท ทูมอโร จำกัด<br/>อีเมล media.toolmorrow@gmail.com หรือ โทร 081-1667138</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-[#ffe000] text-black hover:bg-[#000d59] hover:text-white transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
