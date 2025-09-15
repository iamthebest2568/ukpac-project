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
    navigate("/ukpack2/feedback-skip");
  };

  return (
    <div className="min-h-screen bg-white text-[#000d59] flex flex-col">
      <div className="max-w-4xl w-full mx-auto px-4 py-8 flex-1">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-prompt font-semibold">
            บอกเราหน่อยทำไมถึงไม่แน่ใจ
          </h1>
        </header>

        <main>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="เหตุผลที่อาจจะไม่ใช้บริการประจำทาง"
            className="w-full min-h-[240px] rounded-2xl px-4 py-3 border border-gray-300 text-gray-800 resize-vertical"
          />
        </main>
      </div>

      <footer
        className="rounded-t-3xl p-6 bg-no-repeat bg-top bg-cover w-screen"
        style={{
          backgroundImage:
            "url('https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F7e994bb254cb408c86bed190e97b659e?format=webp&width=1600')"
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex flex-col items-stretch gap-3 w-full max-w-sm">
            <SecondaryButton className="w-full" text="ส่งความคิดเห็น" onClick={submit} />
            <CtaButton className="w-full" text="ข้าม" onClick={skip} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeedbackScreen;
