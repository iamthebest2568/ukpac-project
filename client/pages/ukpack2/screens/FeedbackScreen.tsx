import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";
import CustomizationScreen from "../components/CustomizationScreen";

const FeedbackScreen: React.FC = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<string>("");

  const submit = () => {
    try {
      sessionStorage.setItem("design.feedback", feedback);
    } catch (e) {}
    navigate("/mydreambus/thank-you");
  };

  const skip = () => {
    navigate("/ukpack2/skip-end");
  };

  const footer = (
    <div className="max-w-4xl mx-auto flex items-end justify-center h-full">
      <div className="flex flex-col items-stretch gap-3 w-full max-w-sm pb-6">
        <SecondaryButton
          className="w-full"
          text="ส่งความคิดเห็น"
          onClick={submit}
        />
        <CtaButton className="w-full" text="ข้าม" onClick={skip} />
      </div>
    </div>
  );

  return (
    <CustomizationScreen title="บอกเราหน่อยทำไมถึงไม่แน่ใจ" footerBgImage={"https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc3874bf37db54abeb4a13c308b0df9a4?format=webp&width=1600"} footerContent={footer} theme="light">
      <div className="max-w-4xl w-full mx-auto px-6 py-12">
        <main>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="เหตุผลที่จะไม่ใช้บริการ"
            className="w-full min-h-[260px] rounded-2xl px-6 py-5 border-[5px] border-[#000D59] text-[#000d59] resize-vertical font-sarabun text-[17.6px] text-center placeholder-gray-500"
          />
        </main>
      </div>
    </CustomizationScreen>
  );
};

export default FeedbackScreen;
