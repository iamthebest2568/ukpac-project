/**
 * Ask04 - Policy Implementation Feedback
 * Redesigned to match Figma layout exactly
 */

import { useState } from "react";
import { logEvent } from "../../services/dataLogger.js";

interface Ask04Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData: any;
}

const Ask04 = ({ sessionID, onNavigate, journeyData }: Ask04Props) => {
  const [feedback, setFeedback] = useState("");

  const handleContinue = () => {
    const data = { 
      feedback: feedback.trim(),
      type: "policy_implementation_feedback"
    };

    // Log the policy feedback
    logEvent({
      event: "POLICY_FEEDBACK_SUBMITTED",
      payload: {
        feedback: feedback.trim(),
        feedbackLength: feedback.trim().length,
        sessionID,
      },
    });

    // Navigate to the next step (could be fakeNews or another screen)
    onNavigate("fakeNews", data);
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-white overflow-hidden relative mx-auto">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/800ce747c7dddce8b9f8a83f983aeec3551ce472?width=956"
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-90"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Main Content */}
        <div className="flex-1 px-[29px] pt-[165px] pb-8">
          {/* Question Title */}
          <div className="mb-[50px]">
            <h1 className="text-white font-kanit text-[30px] font-normal leading-normal text-center">
              คุณคิดว่ารัฐควรทำอะไรที่จะ
              ทำให้นโยบายนี้เกิดขึ้นได้และ
              เป็นประโยชน์ต่อประชาชน
              อย่างแท้จริง
            </h1>
          </div>

          {/* Text Input Area */}
          <div className="mb-[65px]">
            <div className="relative">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="พิมพ์ข้อความของคุณที่นี้..."
                className="w-full h-[290px] rounded-[10px] border border-[#E4E9F2] bg-white px-4 py-4 text-black font-prompt text-[16px] font-normal leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#EFBA31] focus:border-transparent placeholder:text-[rgba(0,0,0,0.7)] placeholder:font-prompt placeholder:text-[16px] placeholder:font-light"
                style={{
                  fontFamily: 'Prompt, -apple-system, Roboto, Helvetica, sans-serif'
                }}
              />
            </div>
          </div>

          {/* Continue Button */}
          <div className="w-full">
            <button
              onClick={handleContinue}
              className="w-full max-w-[325px] mx-auto h-[52px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
              <span className="text-black font-prompt text-[18px] font-medium leading-7 tracking-[0.4px]">
                ไปต่อ
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ask04;
