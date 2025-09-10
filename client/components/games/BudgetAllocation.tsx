/**
 * Budget Allocation Component
 * Completely redesigned to match new Figma specifications
 */

import { useState, useEffect } from "react";

interface BudgetAllocationProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  journeyData?: any;
}

const BudgetAllocation = ({ sessionID, onNavigate, journeyData }: BudgetAllocationProps) => {
  const [budgetAllocation, setBudgetAllocation] = useState({
    trainDiscount: 0,
    busQuality: 0,
    parking: 0,
  });

  const totalBudget = 100;
  const allocatedBudget =
    budgetAllocation.trainDiscount +
    budgetAllocation.busQuality +
    budgetAllocation.parking;
  const remainingBudget = totalBudget - allocatedBudget;

  // Get selected priorities from journey data for display
  const selectedPriorities = journeyData?.priorities?.selectedPriorities || [
    "ลดค่าโดยสารรถไฟฟ้า",
    "ปรับปรุงคุณภาพรถเมล์", 
    "ที่จอดรถ"
  ];

  const budgetItemsMapping = {
    "ลดค่าโดยสารรถไฟฟ้า": { key: "trainDiscount", defaultValue: 50 },
    "ปรับปรุงคุณภาพรถเมล์": { key: "busQuality", defaultValue: 30 },
    "ปรับคุณภาพรถเมล์": { key: "busQuality", defaultValue: 30 },
    "ที่จอดรถ": { key: "parking", defaultValue: 20 },
    "เพิ่มที่จอดรถ": { key: "parking", defaultValue: 20 },
  };

  // Initialize budget with default values
  useEffect(() => {
    const initialBudget = { trainDiscount: 0, busQuality: 0, parking: 0 };
    selectedPriorities.forEach((priority: string, index: number) => {
      const mapping = budgetItemsMapping[priority as keyof typeof budgetItemsMapping];
      if (mapping) {
        initialBudget[mapping.key as keyof typeof initialBudget] = mapping.defaultValue;
      }
    });
    setBudgetAllocation(initialBudget);
  }, []);

  const handleBudgetChange = (key: keyof typeof budgetAllocation, value: string) => {
    const numValue = parseInt(value) || 0;
    const currentTotal = Object.entries(budgetAllocation)
      .filter(([k]) => k !== key)
      .reduce((sum, [, v]) => sum + v, 0);

    const maxAllowable = totalBudget - currentTotal;
    const finalValue = Math.min(Math.max(0, numValue), maxAllowable);

    setBudgetAllocation((prev) => ({
      ...prev,
      [key]: finalValue,
    }));
  };

  const handleNext = () => {
    const data = { budgetAllocation };
    onNavigate("ask04", data);
  };

  const isComplete = allocatedBudget === totalBudget;

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Background with curved blue bottom */}
      <div className="absolute inset-0">
        {/* Blue background */}
        <div className="absolute inset-0 bg-[#04D9F9]" />
        {/* White curved top section */}
        <div
          className="absolute top-0 left-0 right-0 bg-white"
          style={{
            height: "clamp(1400px, 80vh, 1680px)",
            borderBottomLeftRadius: "clamp(300px, 40vw, 800px)",
            borderBottomRightRadius: "clamp(300px, 40vw, 800px)",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1080px] mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1
            className="font-prompt font-bold text-center"
            style={{
              color: "#000D59",
              fontSize: "clamp(24px, 5.6vw, 60px)",
              fontWeight: 700,
              lineHeight: "normal"
            }}
          >
            คุณจะให้งบประมาณแต่ละข้อเท่าไหร่
          </h1>
        </div>

        {/* Budget Summary Card */}
        <div className="w-full max-w-[903px] mx-auto mb-12">
          <div
            className="rounded-[20px] bg-[#FFE000] p-8 flex items-center"
            style={{
              height: "clamp(200px, 25vw, 280px)"
            }}
          >
            {/* Coin Icon */}
            <div className="flex-shrink-0 mr-8">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/1d47ef39c86b6e96b386f3aefd8abc162945bed3?width=270"
                alt="Budget icon"
                className="object-contain"
                style={{
                  width: "clamp(80px, 12.5vw, 135px)",
                  height: "clamp(95px, 15vw, 159px)"
                }}
              />
            </div>
            
            {/* Budget Text */}
            <div className="flex-1 text-right">
              <div
                className="font-prompt font-bold text-center mb-2"
                style={{
                  color: "#000D59",
                  fontSize: "clamp(24px, 4.6vw, 50px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px"
                }}
              >
                งบทั้งหมด
              </div>
              <div
                className="font-prompt font-bold text-center"
                style={{
                  color: "#000D59",
                  fontSize: "clamp(50px, 9.3vw, 100px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px"
                }}
              >
                {totalBudget}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Allocation Rows */}
        <div className="w-full max-w-[903px] mx-auto space-y-8 mb-16">
          {selectedPriorities.map((priority: string, index: number) => {
            const mapping = budgetItemsMapping[priority as keyof typeof budgetItemsMapping];
            if (!mapping) return null;

            return (
              <div key={priority} className="flex items-center justify-between">
                {/* Policy Name */}
                <div className="flex-1">
                  <h3
                    className="font-prompt font-bold"
                    style={{
                      color: "#000D59",
                      fontSize: "clamp(24px, 4.6vw, 50px)",
                      fontWeight: 700,
                      letterSpacing: "0.4px"
                    }}
                  >
                    {priority}
                  </h3>
                </div>

                {/* Budget Input Box */}
                <div className="ml-8">
                  <div
                    className="rounded-[20px] border-[5px] border-[#000D59] bg-white flex items-center justify-center"
                    style={{
                      width: "clamp(150px, 19vw, 205px)",
                      height: "clamp(100px, 12vw, 130px)"
                    }}
                  >
                    <input
                      type="number"
                      min="0"
                      max={totalBudget}
                      value={budgetAllocation[mapping.key as keyof typeof budgetAllocation]}
                      onChange={(e) =>
                        handleBudgetChange(
                          mapping.key as keyof typeof budgetAllocation,
                          e.target.value,
                        )
                      }
                      className="w-full h-full bg-transparent text-center font-prompt font-bold border-none outline-none"
                      style={{
                        color: "#000D59",
                        fontSize: "clamp(35px, 6.5vw, 70px)",
                        fontWeight: 700,
                        letterSpacing: "0.4px"
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="w-full max-w-[1154px] mx-auto">
          <div className="relative">
            <div
              className="rounded-[50px] bg-[#FFE000] mx-auto"
              style={{
                width: "min(845px, 85vw)",
                height: "clamp(80px, 10.9vw, 118px)"
              }}
            />
            <button
              onClick={handleNext}
              disabled={!isComplete}
              className={`absolute inset-0 w-full transition-all duration-200 flex items-center justify-center ${
                !isComplete
                  ? "cursor-not-allowed opacity-50"
                  : "hover:scale-105"
              }`}
              style={{
                background: "transparent",
                border: "none",
                height: "clamp(80px, 10.9vw, 118px)"
              }}
            >
              <span
                className="font-prompt text-black text-center font-normal px-4"
                style={{
                  fontSize: "clamp(24px, 4.6vw, 50px)",
                  fontWeight: 400,
                  letterSpacing: "0.4px"
                }}
              >
                ไปต่อ
              </span>
            </button>

            {!isComplete && (
              <div
                className="text-center mt-4"
                style={{
                  color: "#000D59",
                  fontSize: "clamp(14px, 2.8vw, 18px)"
                }}
              >
                กรุณาจัดสรรงบประมาณให้ครบ {totalBudget} เพื่อดำเนินการต่อ
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAllocation;
