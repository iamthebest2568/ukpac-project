import React from "react";

const Diagnostics: React.FC = () => {
  const sample = "ภาษาไทยทดสอบ: ก ข ฃ ค ฅ ฆ ง จ ฉ ช ซ ฌ ญ ฎ ฏ ฐ ฑ ฒ ณ ด ต ถ ท ธ น บ ป ผ ฝ พ ฟ ภ ม ย ร ล ว ศ ษ ส ห ฬ อ ฮ ฤ ฦ ไม้ไต่คู้ ็ นิคหิต ์ ไม้หันอากาศ ั การันต์ ์ ไม้โท ้ ไม้เอก ่ ไม้ตรี ๊ ไม้จัตวา ๋ สระอำ ำ";
  return (
    <div className="min-h-screen bg-white text-black p-6 font-prompt">
      <h1 className="text-2xl mb-4">หน้าวินิจฉัยการแสดงผลภาษาไทย</h1>
      <p className="mb-6">ตัวอย่างข้อความ: {sample}</p>
      <div className="text-sm text-gray-600">ถ้าเห็นสัญลักษณ์ � แสดงว่ามีปัญหารหัสอักขระ</div>
    </div>
  );
};

export default Diagnostics;
