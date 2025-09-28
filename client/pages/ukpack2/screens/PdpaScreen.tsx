import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import CtaButton from "../components/CtaButton";
import Uk2Footer from "../components/Uk2Footer";

const PdpaScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CustomizationScreen
      title="ประกาศความเป็นส่วนตัว (PDPA)"
      theme="light"
      fullWidth
      containerPaddingClass="px-4 py-4"
      footerContent={
        <Uk2Footer className="pdpa-footer-adjust">
          <div className="w-full max-w-sm p-4 md:p-6 flex flex-col items-stretch gap-3">
            <div className="w-full">
              <CtaButton
                text="ยอมรับและเริ่มเล่นเกม"
                onClick={() => {
                  try {
                    sessionStorage.setItem("pdpa_accepted", "true");
                  } catch (e) {}
                  navigate("/mydreambus/chassis");
                }}
                className="w-full"
              />
            </div>
          </div>
        </Uk2Footer>
      }
    >
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="prose prose-sm text-[#000d59] text-center mx-auto">
          <p>
            เกมนี้จะเก็บข้อมูลพฤติกรรมการเล่นและ ที่อยู่ IP ของอุปกรณ์
            เพื่อใช้ในการ วิเคราะห์ พัฒนา และสรุปผลความคิดเห็นในภาพรวมของผู้เล่น
          </p>

          <p>
            ข้อมูลที่เก็บจะถูก ��ัดเก็บอย่างปลอดภัย นำมาใช้เฉพาะภาพรวม
            และไม่สามารถระบุตัวตนได้ โดยข้อมูลจะถูกเก็บ ไม่เกิน 2 ปี
            หรือจนกว่าจะเสร็จสิ้นกระบวนการวิเคราะห์
          </p>

          <p>&nbsp;</p>

          <p>
            หากท่านเข้าร่วมกิจกรรมลุ้นรับรางวัล จะมีการเก็บ ชื่อและเบอร์โทรศัพท์
            เพื่อใช้ในการ ติดต่อและรับของรางวัลเท่านั้น
            โดยข้อมูลส่วนนี้จะถูกลบเมื่อกิจกรรมสิ้นสุด
          </p>

          <p>
            โดยการกด “เริ่มเกม”
            ถือว่าท่านยินยอมให้มีการ��ก็บและประมวลผลข้อมูลดังกล่าว ตาม
            พระราชบัญญัติคุ้มครองข้อม���ลส่วนบุคคล พ.ศ. 2562
          </p>

          <p>&nbsp;</p>

          <p className="font-semibold">หากต้องการสอบถามหรือลบข้อมูลของท่าน</p>

          <p className="font-semibold">
            สามารถติดต่อได้ที่: บริษัท ทูลมอโร จำกัด
            <br />
            อีเมล media.toolmorrow@gmail.com
            <br />
            โทร 081 166 7138
          </p>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default PdpaScreen;
