import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";

const InfoScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CustomizationScreen
      title="รู้หรือไม่!"
      footerContent={
        <div className="flex justify-end">
          <CtaButton text="ไปต่อ" onClick={() => navigate("/ukpack2/submit")} />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="prose text-white font-sarabun">
          <p>
            ข้อความตัวอย่าง:
            ระบบรถเมล์ชุมชนเป็นรูปแบบบริการขนส่งที่เน้นการเชื่อมต่อผู้คนในชุมชน
            โดยมีเส้นทางที่ยืดหยุ่นและสามารถปรับให้เข้ากับความต้องการของผู้ใช้
            บริการนี้ส่งเสริมการเข้าถึง
            การเดินทางที่ปลอดภัยและสะดวกสบายสำหรับทุกคน
            รวมถึงผู้สูงอายุและผู้พิการ
            ผู้ใช้สามารถเลือกรูปแบบการชำระเงินและสิ่งอำนวยความสะดวกที่ต้องการ
            เพื่อให้รถเมล์ตอบโจทย์การใช้งานของชุมชนได้ดีที่สุด.
          </p>
          <p>
            (Placeholder text — แก้ไขเนื้อหาจริงจาก CMS หรือแหล่งข้อมูลภายหลัง)
          </p>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default InfoScreen;
