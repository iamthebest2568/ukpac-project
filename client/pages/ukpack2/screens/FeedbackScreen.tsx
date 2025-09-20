import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../components/SecondaryButton";
import CtaButton from "../components/CtaButton";

const FeedbackScreen: React.FC = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<string>("");

  const submit = () => {
    try {
      sessionStorage.setItem("design.feedback", feedback);
    } catch (e) {}
    navigate("/ukpack2/thank-you");
  };

  const skip = () => {
    navigate("/ukpack2/skip-end");
  };

  return (
    <div className="min-h-screen bg-white text-[#000d59] flex flex-col">
      <div className="max-w-4xl w-full mx-auto px-6 py-12 flex-1">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-prompt font-semibold">
            บอกเราหน่อยทำไมถึงไม่แน่ใจ
          </h1>
        </header>

        <main>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="เหตุผลที่อาจจะไม่ใช้บริการรถประจำทาง"
            className="w-full min-h-[260px] rounded-2xl px-6 py-5 border-[5px] border-[#000D59] text-[#000d59] resize-vertical font-sarabun text-[17.6px] text-center placeholder-gray-500"
          />
        </main>
      </div>

      <footer
        className="rounded-t-3xl py-12 px-6 bg-no-repeat bg-top bg-cover w-screen"
        style={{
          backgroundImage:
            "url('https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fc3874bf37db54abeb4a13c308b0df9a4?format=webp&width=1600')",
          minHeight: '320px'
        }}
      >
        <div className="max-w-4xl mx-auto flex items-end justify-center h-full">
          <div className="flex flex-col items-stretch gap-3 w-full max-w-sm pb-6">
            <SecondaryButton className="w-full" text="ส่งความคิดเห็น" onClick={submit} />
            <CtaButton className="w-full" text="ข้าม" onClick={skip} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeedbackScreen;
