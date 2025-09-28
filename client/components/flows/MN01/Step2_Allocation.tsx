/**
 * UK PACK - MN01 Step 2: Budget Allocation (cloned from MN3)
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
  [key: string]: number | string;
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

    // Initialize budget allocation with zeros (user will enter values)
    const initialAllocation: BudgetAllocation = {};
    priorities.forEach((priority: string) => {
      initialAllocation[priority] = 0;
    });
    setBudgetAllocation(initialAllocation);
  }, [journeyData]);

  // Sum allocations treating empty strings as 0
  const allocatedBudget = Object.values(budgetAllocation).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0,
  );

  const handleBudgetChange = (priority: string, value: string) => {
    // Allow empty string while typing
    if (value === "") {
      setBudgetAllocation((prev) => ({ ...prev, [priority]: "" }));
      return;
    }

    const numValue = parseInt(value || "0", 10) || 0;

    const currentTotal = Object.entries(budgetAllocation)
      .filter(([key]) => key !== priority)
      .reduce((sum, [, v]) => sum + (Number(v) || 0), 0);

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
        event: "MN01_BUDGET",
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
    <div className="w-full min-h-screen mn3-allocation-bg minigame-mn1-page flex flex-col items-center justify-start relative">
      <div className="mn3-allocation-content">
        {/* Title Section */}
        <div className="text-center w-full max-w-none px-4 mb-6">
          <h1
            className="font-prompt text-center leading-normal"
            style={{
              color: "#000D59",
              fontSize: "clamp(28px, 5.5vw, 60px)",
              lineHeight: "1.2",
              fontWeight: 700,
              width: "100%",
              margin: "0 auto",
            }}
          >
            คุณจะให้งบประมาณแต่ละข้อเท่าไหร่
          </h1>
        </div>

        {/* Budget Display Box */}
        <div className="w-full px-4 mb-8">
          <div className="mn3-budget-display">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/1d47ef39c86b6e96b386f3aefd8abc162945bed3?width=270"
              alt="Budget coins icon"
              className="mn3-budget-icon"
            />
            <div className="mn3-budget-text">
              <div className="mn3-budget-label">งบทั้งหมด</div>
              <div className="mn3-budget-amount">100</div>
            </div>
          </div>
        </div>

        {/* Budget Allocation Items */}
        <div className="w-full px-4 mb-6">
          <div className="mn3-allocation-list">
            {selectedPriorities.map((priority, index) => (
              <div key={priority} className="mn3-allocation-item">
                <div className="mn3-allocation-label">{priority}</div>
                <div className="mn3-allocation-input-container">
                  <input
                    type="number"
                    min="0"
                    max={totalBudget}
                    value={
                      budgetAllocation[priority] !== undefined
                        ? budgetAllocation[priority]
                        : 0
                    }
                    onChange={(e) =>
                      handleBudgetChange(priority, e.target.value)
                    }
                    onFocus={() => {
                      const current = budgetAllocation[priority];
                      if (current === 0 || current === "0") {
                        setBudgetAllocation((prev) => ({
                          ...prev,
                          [priority]: "",
                        }));
                      }
                    }}
                    onBlur={() => {
                      const current = budgetAllocation[priority];
                      if (current === "" || current === undefined) {
                        setBudgetAllocation((prev) => ({
                          ...prev,
                          [priority]: 0,
                        }));
                      }
                    }}
                    className="mn3-allocation-input"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="w-full px-4 mt-4 flex justify-center">
          <div
            className="mx-auto flex flex-col items-center space-y-2"
            style={{ width: "100%", maxWidth: 980 }}
          >
            <button
              onClick={handleNext}
              disabled={!isComplete}
              className="mn3-continue-button"
              style={{
                backgroundColor: !isComplete ? "#ccc" : "#FFE000",
                color: !isComplete ? "#666" : "#000",
                opacity: !isComplete ? 0.6 : 1,
              }}
              aria-label="ดำเนินการต่อไปยังขั้นตอนถัดไป"
            >
              ไปต่อ
            </button>
            {!isComplete && (
              <div
                className="text-center font-prompt"
                style={{
                  color: "#000D59",
                  fontSize: "clamp(14px, 3vw, 18px)",
                  fontWeight: 500,
                  maxWidth: "400px",
                  padding: "8px",
                }}
              >
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
