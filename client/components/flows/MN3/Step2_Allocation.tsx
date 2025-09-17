/**
 * UK PACK - MN3 Step 2: Budget Allocation
 * Updated to match Figma design exactly
 */

import { useState, useEffect } from "react";
import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout";
import "../../../styles/figma-style1.css";

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
    <FigmaStyle1Layout
      backgroundImage={""} /* disable decorative background while debugging */
      className="mn3-step2-page mn3-step2-minimal"
      imageLoading="eager"
      title={"คุณจะให้งบประมาณแต่ละข้อเท่าไหร่"}
    >
      <div className="mn3-allocation-content" style={{ paddingTop: "clamp(40px, 8vh, 120px)" }}>
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

          </div>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step2_Allocation;
