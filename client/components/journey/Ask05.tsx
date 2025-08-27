import { useState } from "react";
import { logEvent } from "../../services/dataLogger.js";

interface Ask05Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const Ask05 = ({ sessionID, onNavigate }: Ask05Props) => {
  const [suggestion, setSuggestion] = useState("");

  const handleNext = () => {
    // Log the user's suggestion
    logEvent({
      event: "ASK05_SUBMIT",
      payload: {
        suggestion,
        sessionID,
      },
    });

    const data = { suggestion };
    onNavigate("fakeNews", data);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="แชร์ความคิดเห็นของคุณ"
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
                className="text-white text-center font-kanit text-3xl font-normal leading-normal mb-4"
                style={{ fontSize: "clamp(20px, 6vw, 24px)" }}
              >
                คุณคิดว่ารัฐควรทำอะไร
                ที่จะทำให้นโยบายนี้เกิดขึ้นได้และเป็นประโยชน์ต่อประชาชนอย่างแท้จริง
              </h1>
              <p className="text-white text-center font-prompt text-base leading-relaxed">
                ข้อเสนอแนะของคุณมีค่ามากสำหรับการพัฒนานโยบายให้ดีขึ้น
              </p>
            </div>

            {/* Text Input Area */}
            <div className="w-full max-w-[325px] mb-6">
              <label
                htmlFor="suggestion-input"
                className="block text-white font-prompt text-base font-medium mb-2"
              >
                ข้อเสนอแนะของคุณ:
              </label>
              <textarea
                id="suggestion-input"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className="w-full h-32 rounded-[20px] bg-white border-[1.5px] border-black px-4 py-3 text-black font-prompt text-base placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#EFBA31]"
                placeholder="พิมพ์��้อความของคุณที่นี่"
                aria-describedby="suggestion-help"
                rows={6}
              />
              <div
                id="suggestion-help"
                className="text-white text-sm font-prompt mt-2"
              >
                แชร์ความคิดเห็น ข้อเสนอแนะ
                หรือแนวทางที่คุณคิดว่าจะช่วยให้นโยบายนี้ประสบความสำเร็จ
              </div>

              {/* Character counter */}
              <div className="text-right mt-1">
                <span className="text-white text-sm">
                  {suggestion.length} ตัวอักษร
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full max-w-[325px] mb-4">
              <button
                onClick={handleNext}
                className="w-full h-[53px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
                aria-describedby="next-button-description"
              >
                <span className="text-black text-center font-prompt text-lg font-medium leading-7 tracking-[0.4px] group-hover:text-[#EFBA31] group-active:text-[#EFBA31]">
                  ไปต่อ
                </span>
              </button>

              {suggestion.trim().length === 0 && (
                <div
                  id="next-button-description"
                  className="text-center text-white text-sm mt-2"
                >
                  คุณสามารถข้ามขั้นตอนนี้ได้หากไม่มีข้อเสนอแนะเพิ่มเติม
                </div>
              )}

              {suggestion.trim().length > 0 && (
                <div className="text-center text-white text-sm mt-2">
                  ขอบคุณสำหรับข้อเสนอแนะที่มีค่า!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ask05;
