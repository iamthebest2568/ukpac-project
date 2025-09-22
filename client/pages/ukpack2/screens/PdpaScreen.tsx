import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";

const PdpaScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CustomizationScreen
      title="ประกาศความเป็นส่วนตัว (PDPA)"
      theme="light"
      fullWidth
      containerPaddingClass="px-4 py-4"
      footerContent={
        <div className="flex justify-center">
          <div className="w-full max-w-4xl mx-auto flex items-center justify-center">
            <div className="w-full max-w-sm p-4 md:p-6 flex flex-col items-stretch gap-3">
              <div className="w-full">
                <CtaButton
                  text=">>> ยอมรับและเริ่มเล่นเกม"
                  onClick={() => {
                    try {
                      sessionStorage.setItem("pdpa_accepted", "true");
                    } catch (e) {}
                    navigate("/ukpack2/chassis");
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="prose prose-sm text-[#000d59]">
          <p>
            เกมนี้จะเก็บข้อมูลพฤติกรรมการเล่นและ ที่อยู่ IP ของอุปกรณ์
            เพื่อใช้ในการ วิเคราะห์ พัฒนา และสรุปผลความคิดเห็นในภาพรวมของผู้เล่น
          </p>

          <p>
            ข้อมูลที่เก็บจะถูก จัดเก็บอย่างปลอดภัย นำมาใช้เฉพาะภาพรวม และไม่สามารถระบุตัวตนได้ โดยข้อมูลจะถูกเก็บ ไม่เกิน 2 ปี หรือจนกว่าจะเสร็จสิ้นกระบวนการวิเคราะห์
          </p>

          <p>
            หากท่านเข้าร่วมกิจกรรมลุ้นรับรางวัล จะมีการเก็บ ชื่อและเบอร์โทรศัพท์
            เพื่อใช้ในการ ติดต่อและรับของรางวัลเท่านั้น โดยข้อมูลส่วนนี้จะถูกลบเมื่อกิจกรรมสิ้นสุด
          </p>

          <p>
            โดยการกด “เริ่มเกม” ถือว่าท่านยินยอมให้มีการเก็บและประมวลผลข้อมูลดัง��ล่าว
            ตาม พระราชบัญญัติคุมครองข้อมูลส่วนบุคคล พ.ศ. 2562
          </p>

          <p>
            หากต้องการสอบถามหรือลบข้อมูลของท่าน
            สามารถติดต่อได้ที่: บริษัท ทูลมอโร จำกัด
            อีเมล media.toolmorrow@gmail.com หรือ โทร 081-1667138
          </p>

        </div>
      </div>
    </CustomizationScreen>
  );
};

export default PdpaScreen;
