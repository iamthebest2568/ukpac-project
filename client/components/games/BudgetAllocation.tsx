import { useState, useEffect } from "react";

interface BudgetAllocationProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const BudgetAllocation = ({ sessionID, onNavigate }: BudgetAllocationProps) => {
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
                className="text-white text-center font-prompt text-3xl font-normal leading-normal mb-4"
                style={{ fontSize: "clamp(24px, 7.5vw, 30px)" }}
              >
                คุณจะให้งบประมาณแต่ละข้อเท่าไร
              </h1>
            </div>

            {/* Budget Status Display */}
            <div className="w-full max-w-[325px] mb-6 bg-black bg-opacity-50 rounded-[20px] p-4">
              <div className="text-white text-center">
                <div className="text-lg font-prompt mb-2">
                  งบทั้งหมด:{" "}
                  <span className="text-[#EFBA31] font-medium">
                    {totalBudget} บาท
                  </span>
                </div>
                <div
                  className={`text-base font-prompt ${
                    remainingBudget < 0
                      ? "text-red-400"
                      : remainingBudget > 0
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                >
                  งบที่เหลือ: {remainingBudget} บาท
                </div>

                {/* Visual progress bar */}
                <div className="mt-3">
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
                      aria-label={`ใช้งบประมาณไปแล้ว ${allocatedBudget} จาก ${totalBudget} บาท`}
                    ></div>
                  </div>
                  <div className="text-white text-sm mt-2 text-center">
                    ใช้งบประมาณ{" "}
                    {((allocatedBudget / totalBudget) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Items */}
            <div className="w-full max-w-[325px] space-y-4 mb-6">
              {budgetItems.map((item) => (
                <div
                  key={item.key}
                  className="bg-black bg-opacity-50 rounded-[20px] p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span
                        className="text-2xl mr-3"
                        role="img"
                        aria-label={item.description}
                      >
                        {item.icon}
                      </span>
                      <div>
                        <label
                          htmlFor={`budget-${item.key}`}
                          className="text-white font-prompt text-base font-medium block"
                        >
                          {item.label}
                        </label>
                        <div className="text-white text-sm opacity-80">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
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
                      className="w-20 h-10 rounded-[10px] bg-white border-[1.5px] border-black text-center text-black font-prompt text-base focus:outline-none focus:ring-2 focus:ring-[#EFBA31]"
                      placeholder="0"
                      aria-describedby={`budget-${item.key}-description`}
                    />
                    <span className="text-white font-prompt text-base">
                      บาท
                    </span>

                    {/* Visual indicator of allocation percentage */}
                    <div className="flex-1 bg-gray-600 rounded-full h-2 ml-4">
                      <div
                        className="h-2 bg-[#EFBA31] rounded-full transition-all duration-300"
                        style={{
                          width: `${(budgetAllocation[item.key as keyof typeof budgetAllocation] / totalBudget) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-white text-sm w-12 text-right">
                      {(
                        (budgetAllocation[
                          item.key as keyof typeof budgetAllocation
                        ] /
                          totalBudget) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>

                  <div
                    id={`budget-${item.key}-description`}
                    className="text-white text-sm mt-2 opacity-80"
                  >
                    จัดสรร:{" "}
                    {
                      budgetAllocation[
                        item.key as keyof typeof budgetAllocation
                      ]
                    }{" "}
                    บาท
                  </div>
                </div>
              ))}
            </div>

            {/* Status Messages */}
            {isOverBudget && (
              <div className="w-full max-w-[325px] mb-4 bg-red-500 bg-opacity-90 rounded-[15px] p-3">
                <div className="text-white text-center text-sm font-prompt">
                  <strong>งบประมาณเกินที่กำหนด!</strong>{" "}
                  กรุณาปรับลดจำนวนให้อยู่ในงบประมาณ {totalBudget} บาท
                </div>
              </div>
            )}

            {remainingBudget > 0 && remainingBudget < totalBudget && (
              <div className="w-full max-w-[325px] mb-4 bg-yellow-500 bg-opacity-90 rounded-[15px] p-3">
                <div className="text-black text-center text-sm font-prompt">
                  คุณยังมีงบประมาณเหลือ <strong>{remainingBudget} บาท</strong>{" "}
                  กรุณาจัดสรรให้ครบ
                </div>
              </div>
            )}

            {isComplete && (
              <div className="w-full max-w-[325px] mb-4 bg-green-500 bg-opacity-90 rounded-[15px] p-3">
                <div className="text-white text-center text-sm font-prompt">
                  <strong>เยี่ยม!</strong> คุณจัดสรรงบประมาณครบ {totalBudget}{" "}
                  บาทแล้ว
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
                  กรุณาจัดสรรงบประมาณให้ครบ {totalBudget} บาทเพื่อดำเนินการต่อ
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAllocation;
