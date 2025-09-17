/**
 * Budget Allocation Component
 * Visual design updated to match Figma - ALL original functionality preserved
 */

import { useState, useEffect } from "react";

interface BudgetAllocationProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
  /** When true the component will not render its own full-screen background and sizing
   *  so it can be safely placed inside a page-level layout (like FigmaStyle1Layout) */
  layoutMode?: boolean;
}

const BudgetAllocationComponent = ({
  sessionID,
  onNavigate,
  layoutMode = false,
}: BudgetAllocationProps) => {
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

  const budgetItems = [
    {
      key: "trainDiscount",
      label: "ลดค่าโดยสารรถไฟฟ้า",
      description: "การให้ส่วนลดค่าโดยสารระบบรถไฟฟ้า",
      icon: "🚇",
    },
    {
      key: "busQuality",
      label: "ปรับปรุงคุณภาพรถเมล์",
      description: "การปรับปรุงและพัฒนาคุณภาพรถโดยสารประจำทาง",
      icon: "🚌",
    },
    {
      key: "parking",
      label: "ที่จอดรถ",
      description: "การจัดหาและพัฒนาพื้นที่จอดรถ",
      icon: "🅿️",
    },
  ];

  const handleBudgetChange = (
    key: keyof typeof budgetAllocation,
    value: string,
  ) => {
    const numValue = parseInt(value) || 0;
    const currentTotal = Object.entries(budgetAllocation)
      .filter(([k]) => k !== key)
      .reduce((sum, [, v]) => sum + v, 0);

    // Ensure the new value doesn't exceed remaining budget
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
  const isOverBudget = allocatedBudget > totalBudget;

  // Size tokens adjust the UI when rendered inside constrained pages (layoutMode)
  const compact = layoutMode;
  const titleFontSize = compact
    ? "clamp(18px, 4.2vw, 28px)"
    : "clamp(24px, 5.6vw, 60px)";
  const cardHeight = compact
    ? "clamp(120px, 20vw, 160px)"
    : "clamp(200px, 25vw, 280px)";
  const coinWidth = compact
    ? "clamp(48px, 8vw, 80px)"
    : "clamp(80px, 12.5vw, 135px)";
  const coinHeight = compact
    ? "clamp(56px, 10vw, 95px)"
    : "clamp(95px, 15vw, 159px)";
  const labelFontSize = compact
    ? "clamp(16px, 3.6vw, 22px)"
    : "clamp(24px, 4.6vw, 50px)";
  const totalFontSize = compact
    ? "clamp(28px, 6vw, 48px)"
    : "clamp(50px, 9.3vw, 100px)";
  const inputBoxWidth = compact
    ? "clamp(110px, 20vw, 160px)"
    : "clamp(150px, 19vw, 205px)";
  const inputBoxHeight = compact
    ? "clamp(64px, 10vw, 90px)"
    : "clamp(100px, 12vw, 130px)";
  const inputFontSize = compact
    ? "clamp(20px, 4.6vw, 34px)"
    : "clamp(35px, 6.5vw, 70px)";
  const continueHeight = compact
    ? "clamp(56px, 8vw, 72px)"
    : "clamp(80px, 10.9vw, 118px)";
  const continueWidth = compact ? "min(600px,85vw)" : "min(845px,85vw)";
  const buttonFontSize = compact
    ? "clamp(18px, 3.6vw, 28px)"
    : "clamp(24px, 4.6vw, 50px)";

  return (
    <div
      className={`${layoutMode ? "w-full" : "min-h-screen bg-white"} flex flex-col relative overflow-hidden`}
      style={
        layoutMode
          ? {
              maxHeight: "calc(100vh - 80px)",
              overflowY: "auto",
              paddingBottom: "env(safe-area-inset-bottom,24px)",
            }
          : undefined
      }
    >
      {/* Background with curved blue bottom - NEW FIGMA DESIGN */}
      {!layoutMode && (
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
      )}

      {/* Main Content */}
      <div
        className="relative z-10 w-full max-w-full mx-auto px-4 py-8"
        style={layoutMode ? { maxWidth: "960px" } : undefined}
      >
        {/* Title - NEW FIGMA DESIGN */}
        <div className="text-center mb-12">
          <h1
            className="font-prompt font-bold text-center"
            style={{
              color: "#000D59",
              fontSize: titleFontSize,
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            คุณจะให้งบประมาณแต่ละข้อเท่าไหร่
          </h1>
        </div>

        {/* Budget Summary Card - NEW FIGMA DESIGN */}
        <div className="w-full max-w-[903px] mx-auto mb-12">
          <div
            className="rounded-[20px] bg-[#FFE000] p-8 flex items-center"
            style={{
              height: cardHeight,
            }}
          >
            {/* Coin Icon */}
            <div className="flex-shrink-0 mr-8">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/1d47ef39c86b6e96b386f3aefd8abc162945bed3?width=270"
                alt="Budget icon"
                className="object-contain"
                style={{
                  width: coinWidth,
                  height: coinHeight,
                }}
              />
            </div>

            {/* Budget Text */}
            <div className="flex-1 text-right">
              <div
                className="font-prompt font-bold text-center mb-2"
                style={{
                  color: "#000D59",
                  fontSize: labelFontSize,
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                }}
              >
                งบทั้งหมด
              </div>
              <div
                className="font-prompt font-bold text-center"
                style={{
                  color: "#000D59",
                  fontSize: totalFontSize,
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                }}
              >
                {totalBudget}
              </div>
            </div>
          </div>
        </div>

        {/* ORIGINAL Budget Status Display - FUNCTIONALITY PRESERVED */}
        <div className="w-full max-w-[903px] mx-auto mb-8 bg-black bg-opacity-20 rounded-[20px] p-4">
          <div className="text-center">
            <div
              className="text-lg font-prompt mb-2"
              style={{ color: "#000D59" }}
            >
              งบที่เหลือ:{" "}
              <span
                className={`font-medium ${
                  remainingBudget < 0
                    ? "text-red-600"
                    : remainingBudget > 0
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {remainingBudget} บาท
              </span>
            </div>

            {/* ORIGINAL Visual progress bar - FUNCTIONALITY PRESERVED */}
            <div className="mt-3">
              <div className="w-full bg-gray-300 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isOverBudget
                      ? "bg-red-500"
                      : allocatedBudget === totalBudget
                        ? "bg-green-500"
                        : "bg-[#FFE000]"
                  }`}
                  style={{
                    width: `${Math.min((allocatedBudget / totalBudget) * 100, 100)}%`,
                  }}
                  role="progressbar"
                  aria-valuenow={allocatedBudget}
                  aria-valuemin={0}
                  aria-valuemax={totalBudget}
                  aria-label={`ใช้งบประมาณไปแล้ว ${allocatedBudget} จาก ${totalBudget} บาท`}
                ></div>
              </div>
              <div
                className="text-sm mt-2 text-center"
                style={{ color: "#000D59" }}
              >
                ใช้งบประมาณ {((allocatedBudget / totalBudget) * 100).toFixed(1)}
                %
              </div>
            </div>
          </div>
        </div>

        {/* Budget Allocation Rows - NEW FIGMA DESIGN with ORIGINAL FUNCTIONALITY */}
        <div className="w-full max-w-[903px] mx-auto space-y-8 mb-16">
          {budgetItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              {/* Policy Name */}
              <div className="flex-1">
                <h3
                  className="font-prompt font-bold"
                  style={{
                    color: "#000D59",
                    fontSize: labelFontSize,
                    fontWeight: 700,
                    letterSpacing: "0.4px",
                  }}
                >
                  {item.label}
                </h3>
              </div>

              {/* Budget Input Box - NEW FIGMA DESIGN */}
              <div className="ml-8">
                <div
                  className="rounded-[20px] border-[5px] border-[#000D59] bg-white flex items-center justify-center"
                  style={{
                    width: inputBoxWidth,
                    height: inputBoxHeight,
                  }}
                >
                  <input
                    id={`budget-${item.key}`}
                    type="number"
                    min="0"
                    max={totalBudget}
                    value={
                      budgetAllocation[
                        item.key as keyof typeof budgetAllocation
                      ]
                    }
                    onChange={(e) =>
                      handleBudgetChange(
                        item.key as keyof typeof budgetAllocation,
                        e.target.value,
                      )
                    }
                    className="w-full h-full bg-transparent text-center font-prompt font-bold border-none outline-none focus:ring-2 focus:ring-[#FFE000]"
                    style={{
                      color: "#000D59",
                      fontSize: inputFontSize,
                      fontWeight: 700,
                      letterSpacing: "0.4px",
                    }}
                    aria-describedby={`budget-${item.key}-description`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORIGINAL Status Messages - FUNCTIONALITY PRESERVED */}
        <div className="w-full max-w-[903px] mx-auto mb-8">
          {isOverBudget && (
            <div className="mb-4 bg-red-500 bg-opacity-90 rounded-[15px] p-3">
              <div className="text-white text-center text-sm font-prompt">
                <strong>งบประมาณเกินที่กำหนด!</strong>{" "}
                กรุณาปรับลดจำนวนให้อยู่ในงบประมาณ {totalBudget} บาท
              </div>
            </div>
          )}

          {remainingBudget > 0 && remainingBudget < totalBudget && (
            <div className="mb-4 bg-yellow-500 bg-opacity-90 rounded-[15px] p-3">
              <div className="text-black text-center text-sm font-prompt">
                คุณยังมีงบประมาณเหลือ <strong>{remainingBudget} บาท</strong>{" "}
                กรุณาจัดสรรให้ครบ
              </div>
            </div>
          )}

          {isComplete && (
            <div className="mb-4 bg-green-500 bg-opacity-90 rounded-[15px] p-3">
              <div className="text-white text-center text-sm font-prompt">
                <strong>เยี่ยม!</strong> คุณจัดสรรงบประมาณครบ {totalBudget}{" "}
                ���าทแล้ว
              </div>
            </div>
          )}
        </div>

        {/* Continue Button - NEW FIGMA DESIGN with ORIGINAL FUNCTIONALITY */}
        <div className="w-full max-w-[1154px] mx-auto">
          <div className="relative">
            <div
              className="rounded-[50px] bg-[#FFE000] mx-auto"
              style={{
                width: continueWidth,
                height: continueHeight,
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
                height: continueHeight,
              }}
              aria-describedby="next-button-description"
            >
              <span
                className="font-prompt text-black text-center font-normal px-4"
                style={{
                  fontSize: buttonFontSize,
                  fontWeight: 400,
                  letterSpacing: "0.4px",
                }}
              >
                ไปต่อ
              </span>
            </button>

            {!isComplete && (
              <div
                id="next-button-description"
                className="text-center mt-4"
                style={{
                  color: "#000D59",
                  fontSize: "clamp(14px, 2.8vw, 18px)",
                }}
              >
                กรุณาจัดสรรงบประมาณให้ครบ {totalBudget} บาทเพื่อดำเนินการต่อ
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAllocationComponent;
