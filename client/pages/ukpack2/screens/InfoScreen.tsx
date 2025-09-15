import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import ConfirmModal from "../components/ConfirmModal";

const InfoScreen: React.FC = () => {
  const navigate = useNavigate();

  const [isExitModalOpen, setExitModalOpen] = React.useState(false);

  return (
    <>
      <CustomizationScreen
        title="รู้หรือไม่!"
        theme="light"
        footerContent={
          <div className="flex justify-center">
            <CtaButton text="ไปต่อ" onClick={() => navigate("/ukpack2/info-next")} />
          </div>
        }
      >
        <div className="space-y-6">
          <div className="prose text-[#001a73] font-sarabun">
            <p>
              ข้อความตัวอย่าง:
              ระบบรถเมล์ชุมชนเป็นรูปแบบบริการขนส่งที่เน้นการเชื่อมต่อผู้คนในชุมชน
              โดยมีเส้นทางที่ยืดหยุ่นและสามารถปรับให้เข้ากับความต้องการของผู้ใช้
              บริการนี้ส่งเสริมการเข้าถึง
              การเดินทางที่ปลอดภัยและสะดวกสบายสำหรับทุกคน
              รวมถึงผู้สูงอายุและผู��พิการ
              ผู้ใช้สามารถเลือกรูปแบบการชำระเงินและสิ่งอำนวยความสะดวกที่ต้องการ
              เพื่อให้รถเมล์ตอบโจทย์การใช้งานของชุมชนได้ดีที่สุด.
            </p>
            <p>
              (เนื้อหาเพิ่มเติมสามารถปรับจาก CMS ภายหลัง)
            </p>
          </div>
        </div>
      </CustomizationScreen>

      <ConfirmModal
        isOpen={isExitModalOpen}
        title="ออกจากหน้าจอ"
        message="คุณแน่ใจหรือไม่ว่าต้องการออก? การเปลี่ยนแปลงของคุณจะไม่ถูกบันทึก"
        onConfirm={() => navigate('/')}
        onCancel={() => setExitModalOpen(false)}
      />
    </>
  );
};

export default InfoScreen;
