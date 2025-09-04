import { useState } from "react";
import { logEvent } from "../../services/dataLogger.js";

interface Ask02_2Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const Ask02_2 = ({ sessionID, onNavigate }: Ask02_2Props) => {
  const [textInput, setTextInput] = useState("");

  const handleNext = () => {
    // Log the user's custom reason
    logEvent({
      event: "ASK02_2_SUBMIT",
      payload: {
        customReason: textInput,
        sessionID,
      },
    });

    const data = { textInput };
    onNavigate("ask05", data);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="บุคคลกำลังคิด"
            className="w-full h-full object-cover object-center"
            style={{ minWidth: "100%", aspectRatio: "2/3" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 44.17%)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-end items-center px-6 md:px-8 pb-8 md:pb-12">
            {/* Title */}
            <div className="text-center mb-6 md:mb-8 max-w-[325px]">
              <h1
                className="text-white text-center font-prompt text-3xl font-normal leading-normal mb-4"
                style={{ fontSize: "clamp(24px, 7.5vw, 30px)" }}
              >
                อื่นๆ คืออะไร
                <br />
                ช่วยบอกเราหน่อยได้ไหม
              </h1>
              <p className="text-white text-center font-prompt text-base leading-relaxed">
                ความคิดเห็นของคุณมีความสำคัญมากต่อการพัฒนานโยบาย
              </p>
            </div>

            {/* Text Input Area */}
            <div className="w-full max-w-[325px] mb-6">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="กรุณาแบ่งปันความคิดเห็นของคุณ..."
                className="w-full h-32 rounded-[20px] bg-white border-[1.5px] border-black px-4 py-3 text-black font-prompt text-base placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#EFBA31]"
                rows={4}
                aria-describedby="character-count"
              />
              <div
                id="character-count"
                className="text-right text-white text-sm mt-2"
              >
                {textInput.length} ตัวอักษร
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full max-w-[325px] mb-4">
              <button
                onClick={handleNext}
                disabled={textInput.trim().length === 0}
                className={`w-full h-[53px] rounded-[40px] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 ${
                  textInput.trim().length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#EFBA31] hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
                }`}
                aria-describedby="next-button-description"
              >
                <span
                  className={`text-center font-prompt text-lg font-medium leading-7 tracking-[0.4px] ${
                    textInput.trim().length === 0
                      ? "text-gray-600"
                      : "text-black group-hover:text-[#EFBA31] group-active:text-[#EFBA31]"
                  }`}
                >
                  ไปต่อ
                </span>
              </button>

              {textInput.trim().length === 0 && (
                <div
                  id="next-button-description"
                  className="text-center text-white text-sm mt-2"
                >
                  กรุณากรอกข้อความเพื่อดำเนินการต่อ
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="w-full max-w-[325px] text-center">
              <h4 className="text-white font-prompt text-base font-medium mb-2">
                💡 ตัวอย่างความคิดเห็นที่เป็นประโยชน์:
              </h4>
              <ul className="text-white text-sm font-prompt space-y-1 text-left">
                <li>• กังวลเรื่องผลกระทบต่อผู้มีรายได้น้อย</li>
                <li>• เห็นว่าควรมีระบบขนส่งสาธารณะที่ดีกว่าก่อน</li>
                <li>• ต้องการให้มีการศึกษ��ผลกระทบเพิ่มเติม</li>
                <li>• มีข้อเสนอแนะแนวทางเชิงนโยบาย</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ask02_2;
