import { useState } from "react";

interface PolicyPrioritiesProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const PolicyPriorities = ({ sessionID, onNavigate }: PolicyPrioritiesProps) => {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const maxSelections = 3;

  const priorities = [
    "ลดค่าโดยสารรถไฟฟ้า",
    "ปรับปรุงคุณภาพรถเมล์",
    "ตั๋วร่วม",
    "เพิ่มความถี่รถเมล์",
    "เพิ่มความถี่รถไฟฟ้า",
    "เพิ่มที่จอดรถ",
    "เพิ่ม feeder ในซอย",
  ];

  const handlePriorityToggle = (priority: string) => {
    setSelectedPriorities((prev) => {
      const isSelected = prev.includes(priority);

      if (isSelected) {
        // Remove if already selected
        return prev.filter((p) => p !== priority);
      } else {
        // Add if not selected and under limit
        if (prev.length < maxSelections) {
          return [...prev, priority];
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    const data = { selectedPriorities };
    onNavigate("beneficiaries", data);
  };

  const isSelectionDisabled = (priority: string) => {
    return (
      selectedPriorities.length >= maxSelections &&
      !selectedPriorities.includes(priority)
    );
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="นโยบายการขนส่ง"
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
                คุณคิดว่าควรใช้เงินที่ได้จากการเก็บไปพัฒนาอะไร
              </h1>
            </div>

            {/* Selection Counter */}
            <div className="w-full max-w-[325px] mb-4 bg-black bg-opacity-50 rounded-[15px] p-3">
              <div className="text-white text-center font-prompt text-sm">
                เลือกได้สูงสุด {maxSelections} ข้อ (เลือกแล้ว{" "}
                <span className="text-[#EFBA31] font-medium">
                  {selectedPriorities.length}/{maxSelections}
                </span>
                )
              </div>
            </div>

            {/* Selection Items */}
            <div className="w-full max-w-[325px] space-y-3 mb-6">
              {priorities.map((priority, index) => {
                const isSelected = selectedPriorities.includes(priority);
                const isDisabled = isSelectionDisabled(priority);

                return (
                  <div
                    key={index}
                    className={`rounded-[20px] border-[1.5px] p-4 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#EFBA31] border-black"
                        : isDisabled
                          ? "bg-gray-400 border-gray-500 cursor-not-allowed opacity-50"
                          : "bg-white border-black hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      !isDisabled && handlePriorityToggle(priority)
                    }
                    role="checkbox"
                    aria-checked={isSelected}
                    aria-disabled={isDisabled}
                    tabIndex={isDisabled ? -1 : 0}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
                        e.preventDefault();
                        handlePriorityToggle(priority);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded border-2 mr-3 flex items-center justify-center ${
                          isSelected
                            ? "bg-black border-black"
                            : "bg-white border-gray-400"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            role="img"
                            aria-label="เลือกแล้ว"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`font-prompt text-base ${
                          isSelected ? "text-black font-medium" : "text-black"
                        }`}
                      >
                        {priority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status Messages */}
            {selectedPriorities.length >= maxSelections && (
              <div className="w-full max-w-[325px] mb-4 bg-yellow-500 bg-opacity-90 rounded-[15px] p-3">
                <div className="text-black text-center text-sm font-prompt">
                  คุณเลือกครบจำนวนแล้ว หากต้องการเลือกข้อใหม่
                  กรุณายกเลิกการเลือกข้อใดข้อหนึ่งก่อน
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="w-full max-w-[325px]">
              <button
                onClick={handleNext}
                disabled={selectedPriorities.length === 0}
                className={`w-full h-[53px] rounded-[40px] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 ${
                  selectedPriorities.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#EFBA31] hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group"
                }`}
                aria-describedby="next-button-description"
              >
                <span
                  className={`text-center font-prompt text-lg font-medium leading-7 tracking-[0.4px] ${
                    selectedPriorities.length === 0
                      ? "text-gray-600"
                      : "text-black group-hover:text-[#EFBA31] group-active:text-[#EFBA31]"
                  }`}
                >
                  ไปต่อ
                </span>
              </button>

              {selectedPriorities.length === 0 && (
                <div
                  id="next-button-description"
                  className="text-center text-white text-sm mt-2"
                >
                  กรุณาเลือกอย่างน้อย 1 ข้อเพื่อดำเนินการต่อ
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPriorities;
