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
    <div className="responsive-container minigame-layout">
      {/* Background Image */}
      <div className="bg-responsive" style={{
        backgroundImage: 'url(https://api.builder.io/api/v1/image/assets/TEMP/800ce747c7dddce8b9f8a83f983aeec3551ce472?width=956)'
      }}></div>

      {/* Overlay */}
      <div className="bg-overlay bg-overlay--dark"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Main Content */}
        <div className="content-area responsive-padding-lg">
          {/* Title */}
          <div className="text-center responsive-padding-md">
            <h1 className="heading-md heading-md-white responsive-spacing-md">
              คุณจะให้งบประมาณ
              <br />
              แต่ละข้อเท่าไหร่
            </h1>
          </div>

          {/* Budget Display Box */}
          <div className="responsive-padding-md">
            <div className="budget-display" style={{
              backgroundColor: 'transparent',
              borderColor: '#EFBA31',
              color: '#EFBA31'
            }}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center responsive-spacing-sm">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/d272a5766f6a17caa21ba5ce7f22eb07040ff3db?width=94"
                    alt="Budget Icon"
                    className="w-[clamp(36px, 8vw, 55px)] h-[clamp(42px, 9vw, 65px)]"
                  />
                  <div className="text-body font-medium" style={{ color: '#EFBA31' }}>
                    งบทั้งหมด
                  </div>
                </div>
                <div className="heading-lg font-bold" style={{ color: '#EFBA31' }}>
                  100
                </div>
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

          {/* Continue Button - Fixed Footer */}
          <div className="fixed-footer">
            <div className="btn-container">
              <button
                onClick={handleNext}
                disabled={!isComplete}
                className="btn-primary"
                style={{
                  backgroundColor: !isComplete ? '#ccc' : '#EFBA31',
                  color: !isComplete ? '#666' : '#000'
                }}
              >
                ไปต่อ
              </button>
              {!isComplete && (
                <div className="text-body text-body-white text-center responsive-spacing-xs">
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
