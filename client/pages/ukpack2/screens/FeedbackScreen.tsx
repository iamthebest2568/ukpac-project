import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SecondaryButton from '../components/SecondaryButton';
import CtaButton from '../components/CtaButton';

const FeedbackScreen: React.FC = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<string>('');

  const submit = () => {
    try {
      sessionStorage.setItem('design.feedback', feedback);
    } catch (e) {}
    navigate('/ukpack2/thank-you');
  };

  const skip = () => {
    navigate('/ukpack2/thank-you');
  };

  return (
    <div className="min-h-screen bg-white text-[#000d59] flex flex-col">
      <div className="max-w-4xl w-full mx-auto px-4 py-8 flex-1">
        <header className="mb-6">
          <h1 className="text-2xl font-prompt font-semibold">บอกเราหน่อยทำไมถึงไม่แน่ใจ</h1>
        </header>

        <main>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="เหตุผลที่อาจจะไม่ใช้บริการประจำทาง"
            className="w-full min-h-[240px] rounded-md px-4 py-3 border border-gray-300 text-gray-800 resize-vertical"
          />
        </main>
      </div>

      <footer className="bg-[#00d5f9] rounded-t-3xl p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-[#000d59] font-sarabun">ขอบคุณที่ส่งความคิดเห็น</div>
          <div className="flex items-center gap-3">
            <SecondaryButton text="ส่งความคิดเห็น" onClick={submit} />
            <CtaButton text="ข้าม" onClick={skip} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeedbackScreen;
