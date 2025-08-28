/**
 * UK PACK - MN3 Step 3: Budget Result Display
 * Moved from BudgetStep3Result component
 */

import { useEffect, useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";

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

  const handleNext = () => {
    // Log the complete MN3 minigame with full data
    logEvent({
      event: "MINIGAME_MN3_COMPLETE",
      payload: {
        top3Choices: journeyData?.budget_step1_choice?.top3BudgetChoices || [],
        budgetAllocation:
          journeyData?.budget_step2_allocation?.budgetAllocation || {},
        resultSummary,
        sessionID,
      },
    });

    const data = {
      budget_step3_result: { budgetResultReviewed: true, resultSummary },
    };
    onNext(data);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="ภาพเมืองในอนาคต"
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
                style={{ fontSize: "clamp(24px, 7.5vw, 30px)" }}
              >
                ภาพเมืองในอนาคต
              </h1>
            </div>

            {/* Main Polaroid Collage */}
            <div className="relative h-80 mb-8 flex items-center justify-center max-w-[325px] w-full">
              {/* Polaroid Photo 1 - Left */}
              <div
                className="absolute bg-white rounded-lg p-2 shadow-lg border border-gray-200"
                style={{
                  transform: "rotate(-12deg) translate(-40px, -20px)",
                  zIndex: 1,
                  width: "100px",
                  height: "110px",
                }}
              >
                <div className="bg-gradient-to-br from-blue-200 to-blue-300 rounded-md flex items-center justify-center mb-2" style={{ height: "70px" }}>
                  <div className="text-3xl">{resultSummary[0]?.icon || "🏢"}</div>
                </div>
                <div className="text-xs font-prompt text-black text-center px-1 leading-tight">
                  {resultSummary[0]?.priority?.substring(0, 15) || "รถไฟฟ้า"}
                  {resultSummary[0]?.priority && resultSummary[0].priority.length > 15 && "..."}
                </div>
              </div>

              {/* Polaroid Photo 2 - Center */}
              <div
                className="absolute bg-white rounded-lg p-2 shadow-lg border border-gray-200"
                style={{
                  transform: "rotate(8deg) translate(0px, 20px)",
                  zIndex: 3,
                  width: "100px",
                  height: "110px",
                }}
              >
                <div className="bg-gradient-to-br from-green-200 to-green-300 rounded-md flex items-center justify-center mb-2" style={{ height: "70px" }}>
                  <div className="text-3xl">{resultSummary[1]?.icon || "🚌"}</div>
                </div>
                <div className="text-xs font-prompt text-black text-center px-1 leading-tight">
                  {resultSummary[1]?.priority?.substring(0, 15) || "รถเมล์"}
                  {resultSummary[1]?.priority && resultSummary[1].priority.length > 15 && "..."}
                </div>
              </div>

              {/* Polaroid Photo 3 - Right */}
              <div
                className="absolute bg-white rounded-lg p-2 shadow-lg border border-gray-200"
                style={{
                  transform: "rotate(-5deg) translate(50px, -30px)",
                  zIndex: 2,
                  width: "100px",
                  height: "110px",
                }}
              >
                <div className="bg-gradient-to-br from-yellow-200 to-orange-300 rounded-md flex items-center justify-center mb-2" style={{ height: "70px" }}>
                  <div className="text-3xl">{resultSummary[2]?.icon || "🅿️"}</div>
                </div>
                <div className="text-xs font-prompt text-black text-center px-1 leading-tight">
                  {resultSummary[2]?.priority?.substring(0, 15) || "ที่จอดรถ"}
                  {resultSummary[2]?.priority && resultSummary[2].priority.length > 15 && "..."}
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="w-full max-w-[325px] mb-6 bg-black bg-opacity-50 rounded-[20px] p-4">
              <h2 className="text-white font-prompt text-lg font-medium mb-3 text-center">การจัดสรรงบประมาณของคุณ</h2>
              <div className="space-y-2">
                {resultSummary.map((result, index) => (
                  <div key={index} className="flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <span className="text-lg mr-2" role="img" aria-label={result.priority}>
                        {result.icon}
                      </span>
                      <span className="font-prompt text-sm">
                        {result.priority.length > 20 ? `${result.priority.substring(0, 20)}...` : result.priority}
                      </span>
                    </div>
                    <div className="text-[#EFBA31] font-prompt text-sm font-medium">
                      {result.allocation} หน่วย ({result.percentage.toFixed(0)}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full max-w-[325px]">
              <button
                onClick={handleNext}
                className="w-full h-[53px] rounded-[40px] bg-[#EFBA31] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
              >
                <span className="text-black text-center font-prompt text-lg font-medium leading-7 tracking-[0.4px] group-hover:text-[#EFBA31] group-active:text-[#EFBA31]">
                  ไปต่อ
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3_Result;
