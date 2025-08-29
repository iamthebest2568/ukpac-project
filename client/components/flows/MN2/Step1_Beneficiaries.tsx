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
  initialData?: any;
  mn1Data?: any;
}

const Step1_Beneficiaries = ({
  sessionID,
  onNext,
  onBack,
  initialData = {},
  mn1Data,
}: Step1_BeneficiariesProps) => {
  console.log("=== Step1_Beneficiaries Component Init ===");
  console.log("Received mn1Data:", mn1Data);
  console.log("Received initialData:", initialData);

  // Prepare priorities from MN1. Expect mn1Data shape: { priorities: { selectedPriorities: string[] } }
  const priorities: string[] =
    mn1Data?.priorities?.selectedPriorities && mn1Data.priorities.selectedPriorities.length > 0
      ? mn1Data.priorities.selectedPriorities
      : ["ลดค่าโดยสารรถไฟฟ้า"];

  console.log("Final priorities to use:", priorities);
  console.log("=== End Step1_Beneficiaries Component Init ===");

  // selections per priority: Record<priority, string[]>
  const [selections, setSelections] = useState<Record<string, string[]>>(() => {
    // Initialize with any provided initialData
    const init: Record<string, string[]> = {};
    priorities.forEach((p) => {
      init[p] = [];
    });

    if (initialData?.selections && Array.isArray(initialData.selections)) {
      initialData.selections.forEach((s: any) => {
        if (s?.priority) {
          init[s.priority] = Array.isArray(s.beneficiaries) ? s.beneficiaries : [];
        }
      });
    }

    return init;
  });

  const maxSelections = 3;

  const beneficiaryGroups = [
    {
      id: "everyone",
      label: "ทุกคน",
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/1a7aa898479a915b1d4d0ef1156c80bf95c372af?width=100"
    },
    {
      id: "locals",
      label: "คนในพื้นที่",
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/1e470dd8f9f7ac27485f56fba45554979acb2509?width=100"
    },
    {
      id: "elderly",
      label: "ผู้สูงอายุ",
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/1b0a18f821ff070a939691646da69e792c28ce55?width=100"
    },
    {
      id: "students",
      label: "นักเรียนนักศึกษา",
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/054c6038c235112715becc476723cafe8d55d68f?width=74"
    },
    {
      id: "disabled",
      label: "คนพิการ",
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/9633f8bb6d0c953adb33a0769227522a310bb01f?width=88"
    },
    {
      id: "other",
      label: "อื่นๆ",
      iconSrc: "https://api.builder.io/api/v1/image/assets/TEMP/5a8e81b8e50e6e0ed69f435d1c09e3de070df984?width=82"
    },
  ];

  const handleGroupToggle = (priority: string, groupId: string) => {
    setSelections((prev) => {
      const prevForPriority = prev[priority] || [];
      const isSelected = prevForPriority.includes(groupId);

      if (isSelected) {
        return { ...prev, [priority]: prevForPriority.filter((g) => g !== groupId) };
      } else {
        if (prevForPriority.length < maxSelections) {
          return { ...prev, [priority]: [...prevForPriority, groupId] };
        }
        return prev;
      }
    });
  };

  const isSelectionDisabled = (priority: string, groupId: string) => {
    const sel = selections[priority] || [];
    return sel.length >= maxSelections && !sel.includes(groupId);
  };

  const handleNext = () => {
    console.log("=== Step1_Beneficiaries handleNext ===");
    console.log("Received mn1Data:", mn1Data);
    console.log("Priorities used:", priorities);
    console.log("Current selections state:", selections);

    const selectionsArray = priorities.map((p) => ({ priority: p, beneficiaries: selections[p] || [] }));
    console.log("Selections array to send:", selectionsArray);

    const data = { beneficiaries: { selections: selectionsArray } };
    console.log("Final data object to send:", data);
    console.log("=== End Step1_Beneficiaries handleNext ===");

    // Log the minigame completion
    logEvent({
      event: "MINIGAME_MN2_COMPLETE",
      payload: {
        selections,
        sessionID,
      },
    });

    onNext(data);
  };

  return (
    <div className="figma-style1-container">
      <div className="figma-style1-content">
        {/* Background Image with Overlay */}
        <div className="figma-style1-background">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F946833431d4b46a0bde1c7d1bc32f67a"
            alt="กลุ่มผู้ได้รับประโยชน์"
            className="figma-style1-background-image"
          />
          <div className="figma-style1-background-overlay" />
        </div>

        {/* Main Content */}
        <div className="figma-style1-main">
          {/* Content Area */}
          <div className="figma-style1-content-area">
            {/* For each selected priority render a question block */}
            {priorities.map((priority, idx) => (
              <div key={priority} className="mb-8 w-full max-w-[334px]">
                <div className="figma-style1-title-container mb-4">
                  <h2 className="figma-style1-subtitle">{`คุณคิดว่าใครควรได้รับประโยชน์จาก ${priority} ?`}</h2>
                </div>

                {/* Selection Grid - same layout as original */}
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-4">
                    {beneficiaryGroups.slice(0, 3).map((group) => {
                      const isSelected = (selections[priority] || []).includes(group.id);
                      const isDisabled = isSelectionDisabled(priority, group.id);

                      return (
                        <div
                          key={`${priority}-${group.id}`}
                          className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105"
                          onClick={() => !isDisabled && handleGroupToggle(priority, group.id)}
                          role="checkbox"
                          aria-checked={isSelected}
                          aria-disabled={isDisabled}
                          tabIndex={isDisabled ? -1 : 0}
                          onKeyDown={(e) => {
                            if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
                              e.preventDefault();
                              handleGroupToggle(priority, group.id);
                            }
                          }}
                        >
                          <div className={`w-[80px] h-[80px] rounded-full flex items-center justify-center mb-2 transition-all duration-200 ${
                            isSelected ? "bg-black" : "bg-[#EFBA31]"
                          }`}>
                            <img src={group.iconSrc} alt={group.label} className="w-[50px] h-[50px] object-contain" style={{ filter: 'none' }} />
                          </div>
                          <span className={`font-prompt text-lg font-medium text-center ${isSelected ? 'text-black' : 'text-[#EFBA31]'}`}>
                            {group.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-start">
                    {beneficiaryGroups.slice(3, 6).map((group) => {
                      const isSelected = (selections[priority] || []).includes(group.id);
                      const isDisabled = isSelectionDisabled(priority, group.id);

                      return (
                        <div
                          key={`${priority}-${group.id}`}
                          className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105"
                          onClick={() => !isDisabled && handleGroupToggle(priority, group.id)}
                          role="checkbox"
                          aria-checked={isSelected}
                          aria-disabled={isDisabled}
                          tabIndex={isDisabled ? -1 : 0}
                          onKeyDown={(e) => {
                            if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
                              e.preventDefault();
                              handleGroupToggle(priority, group.id);
                            }
                          }}
                        >
                          <div className={`w-[80px] h-[80px] rounded-full flex items-center justify-center mb-2 transition-all duration-200 ${
                            isSelected ? "bg-black" : "bg-[#EFBA31]"
                          }`}>
                            <img src={group.iconSrc} alt={group.label} className="w-[50px] h-[50px] object-contain" style={{ filter: 'none' }} />
                          </div>
                          <span className={`font-prompt text-lg font-medium text-center ${isSelected ? 'text-black' : 'text-[#EFBA31]'}`}>
                            {group.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Small helper showing selected labels */}
                <div className="text-center mb-2">
                  <span className="text-sm text-white">เลือกแล้ว: {(selections[priority] || []).map((id) => beneficiaryGroups.find((g) => g.id === id)?.label).join(', ') || 'ยังไม่เลือก'}</span>
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="w-full max-w-[325px]">
              <button
                onClick={handleNext}
                className={`w-full h-[53px] rounded-[40px] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 figma-style1-button`}
              >
                <span className="figma-style1-button-text">ไปต่อ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_Beneficiaries;
