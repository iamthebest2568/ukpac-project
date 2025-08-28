/**
 * UK PACK - MN3 Step 2: Budget Allocation
 * Moved from BudgetStep2Allocation component
 */

import { useState, useEffect } from "react";
import { logEvent } from "../../../services/dataLogger.js";

interface Step2_AllocationProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
}

interface BudgetAllocation {
  [key: string]: number;
}

const Step2_Allocation = ({
  sessionID,
  onNext,
  onBack,
  journeyData,
}: Step2_AllocationProps) => {
  const [budgetAllocation, setBudgetAllocation] = useState<BudgetAllocation>(
    {},
  );
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  const totalBudget = 100;

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
    // Get the top 3 choices from the previous step
    const top3Choices =
      journeyData?.budget_step1_choice?.top3BudgetChoices || [];
    setSelectedPriorities(top3Choices);

    // Initialize budget allocation with 0 for each selected priority
    const initialAllocation: BudgetAllocation = {};
    top3Choices.forEach((priority: string) => {
      initialAllocation[priority] = 0;
    });
    setBudgetAllocation(initialAllocation);
  }, [journeyData]);

  const allocatedBudget = Object.values(budgetAllocation).reduce(
    (sum, value) => sum + value,
    0,
  );
  const remainingBudget = totalBudget - allocatedBudget;

  const handleBudgetChange = (priority: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const currentTotal = Object.entries(budgetAllocation)
      .filter(([key]) => key !== priority)
      .reduce((sum, [, v]) => sum + v, 0);

    // Ensure the new value doesn't exceed remaining budget
    const maxAllowable = totalBudget - currentTotal;
    const finalValue = Math.min(Math.max(0, numValue), maxAllowable);

    setBudgetAllocation((prev) => ({
      ...prev,
      [priority]: finalValue,
    }));
  };

  const handleNext = () => {
    // Log the budget allocation completion
    logEvent({
      event: "BUDGET_STEP2_COMPLETE",
      payload: {
        budgetAllocation,
        allocatedBudget,
        selectedPriorities,
        sessionID,
      },
    });

    const data = {
      budget_step2_allocation: {
        budgetAllocation,
        allocatedBudget,
        selectedPriorities,
      },
    };
    onNext(data);
  };

  const isComplete = allocatedBudget === totalBudget;
  const isOverBudget = allocatedBudget > totalBudget;

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="งบประมาณการขนส่ง"
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
                คุณจะให้งบประมาณแต่ละข้อเ��่าไร
              </h1>
            </div>

            {/* Budget Status Display */}
            <div className="w-full max-w-[325px] mb-6 bg-black bg-opacity-50 rounded-[20px] p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="text-white font-prompt text-base">
                  งบทั้งหมด: <span className="text-[#EFBA31] font-medium">{totalBudget}</span>
                </div>
                <div className={`text-white font-prompt text-base ${
                  remainingBudget < 0 ? "text-red-400" : remainingBudget > 0 ? "text-yellow-400" : "text-green-400"
                }`}>
                  งบที่เหลือ: {remainingBudget}
                </div>
              </div>

              {/* Visual progress bar */}
              <div className="mb-2">
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isOverBudget
                        ? "bg-red-500"
                        : allocatedBudget === totalBudget
                          ? "bg-green-500"
                          : "bg-[#EFBA31]"
                    }`}
                    style={{
                      width: `${Math.min((allocatedBudget / totalBudget) * 100, 100)}%`,
                    }}
                    role="progressbar"
                    aria-valuenow={allocatedBudget}
                    aria-valuemin={0}
                    aria-valuemax={totalBudget}
                    aria-label={`ใช้งบประมาณไปแล้ว ${allocatedBudget} จาก ${totalBudget}`}
                  ></div>
                </div>
                <div className="text-white text-center font-prompt text-sm mt-1">
                  ใช้งบประมาณ {((allocatedBudget / totalBudget) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Budget Items */}
            <div className="w-full max-w-[325px] space-y-4 mb-6">
              {selectedPriorities.map((priority) => (
                <div
                  key={priority}
                  className="bg-white bg-opacity-90 rounded-[20px] border-[1.5px] border-black p-4"
                >
                  <div className="flex items-center mb-3">
                    <span
                      className="text-2xl mr-3"
                      role="img"
                      aria-label={priority}
                    >
                      {priorityIcons[priority] || "📋"}
                    </span>
                    <label
                      htmlFor={`budget-${priority}`}
                      className="font-prompt text-base font-medium text-black flex-1"
                    >
                      {priority}
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 mb-2">
                    <input
                      id={`budget-${priority}`}
                      type="number"
                      min="0"
                      max={totalBudget}
                      value={budgetAllocation[priority] || 0}
                      onChange={(e) =>
                        handleBudgetChange(priority, e.target.value)
                      }
                      className="w-20 h-10 rounded-[15px] border-[1.5px] border-gray-300 text-center text-black font-prompt text-base"
                      placeholder="0"
                      aria-describedby={`budget-${priority}-description`}
                    />
                    <span className="font-prompt text-sm text-gray-600">หน่วย</span>

                    {/* Visual indicator of allocation percentage */}
                    <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                      <div
                        className="h-2 bg-[#EFBA31] rounded-full transition-all duration-300"
                        style={{
                          width: `${((budgetAllocation[priority] || 0) / totalBudget) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-prompt text-xs text-gray-500 w-12 text-right">
                      {(
                        ((budgetAllocation[priority] || 0) / totalBudget) *
                        100
                      ).toFixed(0)}%
                    </span>
                  </div>

                  <div
                    id={`budget-${priority}-description`}
                    className="font-prompt text-xs text-gray-500"
                  >
                    จัดสรร: {budgetAllocation[priority] || 0} หน่วย
                  </div>
                </div>
              ))}
            </div>

            {/* Status Messages */}
            {isOverBudget && (
              <div className="w-full max-w-[325px] mb-4 bg-red-500 bg-opacity-90 rounded-[15px] p-3">
                <div className="text-white text-center text-sm font-prompt">
                  <strong>งบประมาณเกิน���ี่กำหนด!</strong> กรุณาปรับลดจำนวนให้อยู่ในงบประมาณ {totalBudget} หน่วย
                </div>
              </div>
            )}

            {remainingBudget > 0 && remainingBudget < totalBudget && (
              <div className="w-full max-w-[325px] mb-4 bg-yellow-500 bg-opacity-90 rounded-[15px] p-3">
                <div className="text-black text-center text-sm font-prompt">
                  คุณยังมีงบประมาณเหลือ <strong>{remainingBudget} หน่วย</strong> กรุณาจัดสรรให้ครบ
                </div>
              </div>
            )}

            {isComplete && (
              <div className="w-full max-w-[325px] mb-4 bg-green-500 bg-opacity-90 rounded-[15px] p-3">
                <div className="text-white text-center text-sm font-prompt">
                  <strong>เยี่ยม!</strong> คุณจัดสรรงบประมาณครบ {totalBudget} หน่วยแล้ว
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="w-full max-w-[325px]">
              <button
                onClick={handleNext}
                disabled={!isComplete}
                className={`w-full h-[53px] rounded-[40px] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 ${
                  !isComplete
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#EFBA31] hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
                }`}
                aria-describedby="next-button-description"
              >
                <span
                  className={`text-center font-prompt text-lg font-medium leading-7 tracking-[0.4px] ${
                    !isComplete
                      ? "text-gray-600"
                      : "text-black group-hover:text-[#EFBA31] group-active:text-[#EFBA31]"
                  }`}
                >
                  ไปต่อ
                </span>
              </button>

              {!isComplete && (
                <div
                  id="next-button-description"
                  className="text-center text-white text-sm mt-2"
                >
                  กรุณาจัดสรรงบประมาณให้ครบ {totalBudget} หน่วยเพื่อดำเนินการต่อ
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_Allocation;
