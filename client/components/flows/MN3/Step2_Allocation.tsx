/**
 * UK PACK - MN3 Step 2: Budget Allocation
 * Redesigned to match Figma layout exactly
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

  useEffect(() => {
    // Get the selected priorities from Step1_Choice
    const priorities =
      journeyData?.budget_step1_choice?.selectedPriorities || [];
    setSelectedPriorities(priorities);

    // Initialize budget allocation with 0 for each selected priority
    const initialAllocation: BudgetAllocation = {};
    priorities.forEach((priority: string) => {
      initialAllocation[priority] = 0;
    });
    setBudgetAllocation(initialAllocation);
  }, [journeyData]);

  const allocatedBudget = Object.values(budgetAllocation).reduce(
    (sum, value) => sum + value,
    0,
  );

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
    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "MN3_BUDGET",
        payload: { budgetAllocation, allocatedBudget, selectedPriorities },
      };
      navigator.sendBeacon?.(
        "/api/track",
        new Blob([JSON.stringify(body)], { type: "application/json" }),
      ) ||
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
    } catch {}
    onNext(data);
  };

  const isComplete = allocatedBudget === totalBudget;

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
        <div className="pt-[210px] px-0 flex-1">
          {/* Title */}
          <div className="text-center mb-[30px] px-4">
            <h1 className="text-white font-kanit text-[30px] font-normal leading-normal">
              คุณจะให้งบประมาณ
              <br />
              แต่ละข้อเท่าไหร่
            </h1>
          </div>

          {/* Budget Display Box */}
          <div className="mx-[30px] mb-[30px]">
            <div className="w-[331px] h-[80px] rounded-[10px] border-[1.5px] border-[#EFBA31] bg-transparent relative">
              {/* Coin Icon */}
              <div className="absolute left-[30px] top-[12px]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/d272a5766f6a17caa21ba5ce7f22eb07040ff3db?width=94"
                  alt="Budget Icon"
                  className="w-[47px] h-[55px]"
                />
              </div>

              {/* Budget Text */}
              <div className="absolute right-[30px] top-[8px]">
                <div className="text-[#EFBA31] font-prompt text-[18px] font-medium text-center">
                  งบทั้งหมด
                </div>
                <div className="text-[#EFBA31] font-prompt text-[40px] font-bold text-center leading-none">
                  100
                </div>
              </div>
            </div>
          </div>

          {/* Budget Allocation Items */}
          <div className="px-[41px] space-y-[25px] mb-[60px]">
            {selectedPriorities.map((priority, index) => (
              <div
                key={priority}
                className="flex items-center justify-between w-[308px] h-[50px]"
              >
                {/* Priority Label */}
                <div className="text-white font-prompt text-[20px] font-medium leading-normal tracking-[0.4px] flex-1">
                  {priority}
                </div>

                {/* Budget Input */}
                <div className="w-[80px] h-[50px] rounded-[10px] border border-[#E4E9F2] bg-white flex items-center justify-center">
                  <input
                    type="number"
                    min="0"
                    max={totalBudget}
                    value={budgetAllocation[priority] || 0}
                    onChange={(e) =>
                      handleBudgetChange(priority, e.target.value)
                    }
                    className="w-full h-full text-center text-black font-prompt text-[20px] font-medium leading-7 tracking-[0.4px] bg-transparent border-none outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="px-8 pb-8">
            <button
              onClick={handleNext}
              disabled={!isComplete}
              className={`w-full max-w-[325px] mx-auto h-[52px] rounded-[40px] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 ${
                !isComplete
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#EFBA31] hover:scale-105"
              }`}
            >
              <span
                className={`text-center font-prompt text-[18px] font-medium leading-7 tracking-[0.4px] ${
                  !isComplete ? "text-gray-600" : "text-black"
                }`}
              >
                ไปต่อ
              </span>
            </button>

            {!isComplete && (
              <div className="text-center text-white text-sm mt-2">
                กรุณาจัดสรรงบประมาณให้ครบ {totalBudget} หน่วยเพื่อดำเนินการต่อ
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_Allocation;
