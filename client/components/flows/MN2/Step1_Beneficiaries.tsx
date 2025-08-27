/**
 * UK PACK - MN2 Step 1: Beneficiaries Selection
 * Moved from BeneficiaryGroups component
 */

import { useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";

interface Step1_BeneficiariesProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: string[];
}

const Step1_Beneficiaries = ({
  sessionID,
  onNext,
  onBack,
  initialData = [],
}: Step1_BeneficiariesProps) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(initialData);
  const maxSelections = 3;

  const beneficiaryGroups = [
    { id: "everyone", label: "ทุกคน", icon: "👥", description: "ประชาชนทุกคน" },
    {
      id: "locals",
      label: "คนในพื้นที่",
      icon: "🏘️",
      description: "ผู้ที่อาศัยในพื้นที่",
    },
    {
      id: "elderly",
      label: "ผู้สูงอายุ",
      icon: "👴",
      description: "ผู้สูงอายุ 60 ปีขึ้นไป",
    },
    {
      id: "students",
      label: "นักเรียนนักศึกษา",
      icon: "🎓",
      description: "นักเรียนและนักศึกษา",
    },
    {
      id: "disabled",
      label: "คนพิการ",
      icon: "♿",
      description: "ผู้พิการทุกประเภท",
    },
    {
      id: "other",
      label: "อื่นๆ",
      icon: "❓",
      description: "กลุ่มอื่นๆ ที่เฉพาะเจาะจง",
    },
  ];

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups((prev) => {
      const isSelected = prev.includes(groupId);

      if (isSelected) {
        // Remove if already selected
        return prev.filter((g) => g !== groupId);
      } else {
        // Add if not selected and under limit
        if (prev.length < maxSelections) {
          return [...prev, groupId];
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    // Log the minigame completion
    logEvent({
      event: "MINIGAME_MN2_COMPLETE",
      payload: {
        selectedGroups,
        sessionID,
      },
    });

    const data = { beneficiaries: { selectedGroups } };
    onNext(data);
  };

  const isSelectionDisabled = (groupId: string) => {
    return (
      selectedGroups.length >= maxSelections &&
      !selectedGroups.includes(groupId)
    );
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[390px] md:max-w-[420px] lg:max-w-[390px] min-h-screen bg-white overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="กลุ่มผู้ได้รับประโยชน์"
            className="w-full h-full object-cover object-center"
            style={{ minWidth: "100%", aspectRatio: "2/3" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 44.17%)",
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
                คุณคิดว่าใครควรได้รับการลดค่าโดยสารรถไฟฟ้าบ้าง
              </h1>
            </div>

            {/* Selection Counter */}
            <div className="w-full max-w-[325px] mb-4 bg-black bg-opacity-50 rounded-[15px] p-3">
              <div className="text-white text-center font-prompt text-sm">
                เลือกได้สูงสุด {maxSelections} กลุ่ม (เลือกแล้ว{" "}
                <span className="text-[#EFBA31] font-medium">{selectedGroups.length}/{maxSelections}</span>)
              </div>
            </div>

            {/* Selection Grid */}
            <div className="w-full max-w-[325px] grid grid-cols-2 gap-3 mb-6">
              {beneficiaryGroups.map((group) => {
                const isSelected = selectedGroups.includes(group.id);
                const isDisabled = isSelectionDisabled(group.id);
                
                return (
                  <div
                    key={group.id}
                    className={`relative rounded-[20px] border-[1.5px] p-4 transition-all duration-200 cursor-pointer min-h-[120px] ${
                      isSelected 
                        ? 'bg-[#EFBA31] border-black' 
                        : isDisabled
                        ? 'bg-gray-400 border-gray-500 cursor-not-allowed opacity-50'
                        : 'bg-white border-black hover:bg-gray-100'
                    }`}
                    onClick={() =>
                      !isDisabled && handleGroupToggle(group.id)
                    }
                    role="checkbox"
                    aria-checked={isSelected}
                    aria-disabled={isDisabled}
                    aria-describedby={`group-${group.id}-description`}
                    tabIndex={isDisabled ? -1 : 0}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === " ") &&
                        !isDisabled
                      ) {
                        e.preventDefault();
                        handleGroupToggle(group.id);
                      }
                    }}
                  >
                    <div className="text-center">
                      <div
                        className="text-3xl mb-2"
                        role="img"
                        aria-label={group.description}
                      >
                        {group.icon}
                      </div>
                      <div className={`font-prompt text-base font-medium mb-1 ${
                        isSelected ? 'text-black' : 'text-black'
                      }`}>
                        {group.label}
                      </div>
                      <div
                        id={`group-${group.id}-description`}
                        className={`font-prompt text-xs ${
                          isSelected ? 'text-black opacity-80' : 'text-gray-600'
                        }`}
                      >
                        {group.description}
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
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
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Status Messages */}
            {selectedGroups.length >= maxSelections && (
              <div className="w-full max-w-[325px] mb-4 bg-yellow-500 bg-opacity-90 rounded-[15px] p-3">
                <div className="text-black text-center text-sm font-prompt">
                  คุณเลือกครบจำน��นแล้ว หากต้องการเลือกกลุ่มใหม่ กรุณายกเลิกการเลือกกลุ่มใดกลุ่มหนึ่งก่อน
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="w-full max-w-[325px]">
              <button
                onClick={handleNext}
                disabled={selectedGroups.length === 0}
                className={`w-full h-[53px] rounded-[40px] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 ${
                  selectedGroups.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#EFBA31] hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group'
                }`}
                aria-describedby="next-button-description"
              >
                <span className={`text-center font-prompt text-lg font-medium leading-7 tracking-[0.4px] ${
                  selectedGroups.length === 0 
                    ? 'text-gray-600' 
                    : 'text-black group-hover:text-[#EFBA31] group-active:text-[#EFBA31]'
                }`}>
                  ไปต่อ
                </span>
              </button>

              {selectedGroups.length === 0 && (
                <div id="next-button-description" className="text-center text-white text-sm mt-2">
                  กรุณาเลือกอย่างน้อย 1 กลุ่มเพื่อดำเนินการต่อ
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_Beneficiaries;
