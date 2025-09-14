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
    <div className="w-full min-h-screen bg-white overflow-hidden relative mx-auto" style={{maxWidth: 1080}}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/800ce747c7dddce8b9f8a83f983aeec3551ce472?width=956"
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-90 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Main Content */}
        <div className="flex-1 pt-16 sm:pt-24 md:pt-36 lg:pt-[210px] pb-28 sm:pb-32 px-4 sm:px-6" style={{width: '100%', maxWidth: 1080, margin: '0 auto'}}>
          {/* Title */}
          <div className="text-center mb-[30px] px-4">
            <h1
              className="text-white font-prompt font-normal leading-normal"
              style={{ fontSize: "clamp(20px, 5.2vw, 30px)" }}
            >
              คุณจะให้งบประมาณ
              <br />
              แต่ละข้อเท่าไหร่
            </h1>
          </div>

          {/* Budget Display Box */}
          <div className="px-4 sm:px-6 mb-6">
            <div className="max-w-[890px] w-full mx-auto rounded-[10px] border-[1.5px] border-[#EFBA31] bg-transparent flex items-center justify-between gap-4 py-2 sm:py-3 px-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/d272a5766f6a17caa21ba5ce7f22eb07040ff3db?width=94"
                  alt="Budget Icon"
                  className="w-[36px] h-[42px] sm:w-[47px] sm:h-[55px]"
                />
                <div className="text-[#EFBA31] font-prompt text-[14px] sm:text-[18px] font-medium">
                  งบทั้งหมด
                </div>
              </div>
              <div className="text-[#EFBA31] font-prompt text-[28px] sm:text-[40px] font-bold leading-none">
                100
              </div>
            </div>
          </div>

          {/* Budget Allocation Items */}
          <div className="px-4 sm:px-6 space-y-4 sm:space-y-6 mb-10" style={{maxWidth: 890, margin: '0 auto'}}>
            {selectedPriorities.map((priority, index) => (
              <div
                key={priority}
                className="grid grid-cols-[1fr_auto] items-center gap-3 w-full max-w-[890px]"
              >
                {/* Priority Label */}
                <div className="text-white font-prompt text-[16px] sm:text-[20px] font-medium leading-normal tracking-[0.4px]">
                  {priority}
                </div>

                {/* Budget Input */}
                <div className="w-[72px] sm:w-[80px] h-[44px] sm:h-[50px] rounded-[10px] border border-[#E4E9F2] bg-white flex items-center justify-center">
                  <input
                    type="number"
                    min="0"
                    max={totalBudget}
                    value={budgetAllocation[priority] || 0}
                    onChange={(e) =>
                      handleBudgetChange(priority, e.target.value)
                    }
                    className="w-full h-full text-center text-black font-prompt text-[16px] sm:text-[20px] font-medium leading-7 tracking-[0.4px] bg-transparent border-none outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button - Sticky Footer */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-50 px-4 sm:px-6 pb-4">
            <div className="mx-auto" style={{ maxWidth: 1080 }}>
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
    </div>
  );
};

export default Step2_Allocation;
