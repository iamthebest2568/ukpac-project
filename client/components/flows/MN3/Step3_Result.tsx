/**
 * UK PACK - MN3 Step 3: Budget Result Display
 * Moved from BudgetStep3Result component
 */

import { useEffect, useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";
import { useSession } from "../../../hooks/useSession";

interface Step3_ResultProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
}

interface ResultSummary {
  priority: string;
  allocation: number;
  percentage: number;
  icon: string;
}

const Step3_Result = ({
  sessionID,
  onNext,
  onBack,
  journeyData,
}: Step3_ResultProps) => {
  const [resultSummary, setResultSummary] = useState<ResultSummary[]>([]);

  // Icons mapping for priorities
  const priorityIcons: { [key: string]: string } = {
    ลดค่าโดยสารรถไฟฟ้า: "🚇",
    ปรับปรุงคุณภาพรถเมล์: "🚌",
    ตั๋วร่วม: "🎫",
    เพิ่มความถี่รถเมล์: "🚍",
    เพิ่มความถี่รถไฟฟ้า: "🚊",
    เพิ่มที่จอดรถ: "🅿️",
    "เพิ่ม feeder ในซอย": "🚐",
  };

  useEffect(() => {
    // Get data from the previous step
    const allocationData =
      journeyData?.budget_step2_allocation?.budgetAllocation || {};
    const selectedPriorities =
      journeyData?.budget_step2_allocation?.selectedPriorities || [];
    const totalBudget = 100;

    // Create summary with percentages
    const summary: ResultSummary[] = selectedPriorities.map(
      (priority: string) => ({
        priority,
        allocation: allocationData[priority] || 0,
        percentage: ((allocationData[priority] || 0) / totalBudget) * 100,
        icon: priorityIcons[priority] || "📋",
      }),
    );

    // Sort by allocation amount (highest first)
    summary.sort((a, b) => b.allocation - a.allocation);
    setResultSummary(summary);
  }, [journeyData]);

  const handleYes = () => {
    // Log the complete MN3 minigame with satisfaction = Yes
    logEvent({
      event: "MINIGAME_MN3_COMPLETE",
      payload: {
        top3Choices: journeyData?.budget_step1_choice?.top3BudgetChoices || [],
        budgetAllocation:
          journeyData?.budget_step2_allocation?.budgetAllocation || {},
        resultSummary,
        satisfaction: "ใช่",
        sessionID,
      },
    });

    const data = {
      budget_step3_result: { budgetResultReviewed: true, satisfaction: "ใช่", resultSummary },
    };
    onNext(data);
  };

  const handleNo = () => {
    // Log the complete MN3 minigame with satisfaction = No
    logEvent({
      event: "MINIGAME_MN3_COMPLETE",
      payload: {
        top3Choices: journeyData?.budget_step1_choice?.top3BudgetChoices || [],
        budgetAllocation:
          journeyData?.budget_step2_allocation?.budgetAllocation || {},
        resultSummary,
        satisfaction: "ไม่ใช่",
        sessionID,
      },
    });

    const data = {
      budget_step3_result: { budgetResultReviewed: true, satisfaction: "ไม่ใช่", resultSummary },
    };
    onNext(data);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background with Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-90" />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen px-6 md:px-8">
          {/* Top Icon */}
          <div className="pt-3 pl-6">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/d272a5766f6a17caa21ba5ce7f22eb07040ff3db?width=94"
              alt="Icon"
              className="w-12 h-14"
            />
          </div>

          {/* Results Section */}
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            {/* Main Title */}
            <h1 className="text-white text-center font-kanit text-[28px] font-normal leading-normal mb-2">
              จากงบประมาณของคุณ
            </h1>

            {/* Subtitle */}
            <p className="text-white text-center font-kanit text-[18px] font-normal leading-normal mb-12 max-w-[331px]">
              นี้คือสิ่งที่จะเกิดขึ้นในอนาคต
            </p>

            {/* Transport Illustrations */}
            <div className="mb-12 flex justify-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/c3165024d0e414e91040c5ce97f7d9961e2dbcdc?width=678"
                alt="Transport illustrations"
                className="w-[339px] h-[389px] object-contain"
              />
            </div>

            {/* Bottom Question */}
            <h2 className="text-white text-center font-kanit text-[28px] font-normal leading-normal mb-8 max-w-[331px]">
              คุณพอใจหรือไม่
            </h2>
          </div>

          {/* Bottom Buttons */}
          <div className="pb-8 space-y-4">
            {/* Yes Button */}
            <button
              onClick={handleYes}
              className="w-full max-w-[325px] mx-auto h-[52px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-black text-center font-prompt text-[18px] font-medium leading-7 tracking-[0.4px]">
                ใช่
              </span>
            </button>

            {/* No Button */}
            <button
              onClick={handleNo}
              className="w-full max-w-[325px] mx-auto h-[52px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-black text-center font-prompt text-[18px] font-medium leading-7 tracking-[0.4px]">
                ไม่ใช่
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3_Result;
