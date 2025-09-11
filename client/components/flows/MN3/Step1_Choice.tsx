/**
 * UK PACK - MN3 Step 1: Budget Choice Selection
 * Rebuilt to exactly match Figma design (1080x1920) - pixel perfect
 */

import { useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";

interface Step1_ChoiceProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: string[];
}

const Step1_Choice = ({
  sessionID,
  onNext,
  onBack,
  initialData = [],
}: Step1_ChoiceProps) => {
  const [selectedPriorities, setSelectedPriorities] =
    useState<string[]>(initialData);
  const maxSelections = 3;

  // Define priorities exactly as in Figma design
  const priorityList = [
    "ลดค่าโดยสารรถไฟฟ้า",
    "ปรับปรุงคุณภาพรถเมล์", 
    "ตั๋วร่วม",
    "เพิ่มความถี่รถเมล์",
    "เพิ่มที่จอดรถ",
    "เพิ่มความถี่รถไฟฟ้า",
    "เพิ่ม Feeder ในซอย",
  ];

  const handlePriorityToggle = (priority: string) => {
    setSelectedPriorities((prev) => {
      const isSelected = prev.includes(priority);

      if (isSelected) {
        return prev.filter((p) => p !== priority);
      } else {
        if (prev.length < maxSelections) {
          return [...prev, priority];
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    logEvent({
      event: "BUDGET_STEP1_COMPLETE",
      payload: {
        selectedPolicies: selectedPriorities,
        sessionID,
      },
    });
    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "MN3_SELECT",
        payload: { selectedPolicies: selectedPriorities },
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

    const data = { budget_step1_choice: { selectedPriorities } };
    onNext(data);
  };

  const isSelectionDisabled = (priority: string) => {
    return (
      selectedPriorities.length >= maxSelections &&
      !selectedPriorities.includes(priority)
    );
  };

  // Define which buttons should be yellow by default (from Figma design)
  const defaultYellowButtons = new Set([
    "ปรับปรุงคุณภาพรถเมล์",  // choice_2
    "เพิ่มความถี่รถเมล์"      // choice_4
  ]);

  const getButtonColor = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      return "bg-black border-black";
    }
    if (isSelectionDisabled(priority)) {
      return "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50";
    }
    if (defaultYellowButtons.has(priority)) {
      return "bg-[#FFE000] border-black hover:bg-black hover:scale-105 group";
    }
    return "bg-[#E9E9E9] border-black hover:bg-black hover:scale-105 group";
  };

  const getTextColor = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      return "font-bold text-[#FFE000]";
    }
    return "font-bold text-black group-hover:text-[#FFE000]";
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Content Container - exactly matching Figma layout */}
      <div className="relative z-20 min-h-screen flex flex-col" style={{ width: '100vw', maxWidth: '1080px', margin: '0 auto' }}>
        {/* Main Content Area - positioned exactly as in Figma */}
        <div className="flex-1 flex flex-col justify-center items-center" style={{ paddingTop: '532px', paddingBottom: '190px', paddingLeft: '48px', paddingRight: '48px' }}>
          
          {/* Title Section - positioned at top:1021px in Figma */}
          <div className="text-center w-full mb-8">
            <h1 
              className="font-prompt font-bold text-center leading-normal mb-4"
              style={{ 
                color: '#000D59',
                fontSize: '80px',
                lineHeight: 'normal',
                fontWeight: 700
              }}
            >
              คุณคิดว่าควรใช้เงินที่ได้<br />จากการเก็บไปพัฒนาอะไร
            </h1>
            <p 
              className="font-prompt font-bold text-center"
              style={{ 
                color: '#000D59',
                fontSize: '40px',
                fontWeight: 700,
                marginTop: '0px'
              }}
            >
              ไม่เกิน 3 นโยบาย
            </p>
          </div>

          {/* Button Grid Container - exactly matching Figma positions */}
          <div className="relative w-full" style={{ maxWidth: '984px', height: '318px', marginBottom: '60px', marginTop: '60px' }}>
            
            {/* Row 1: choice_1 and choice_2 */}
            <div className="absolute" style={{ top: '0px', left: '0px', width: '984px' }}>
              {/* choice_1: ลดค่าโดยสารรถไฟฟ้า */}
              <button
                onClick={() => !isSelectionDisabled(priorityList[0]) && handlePriorityToggle(priorityList[0])}
                disabled={isSelectionDisabled(priorityList[0])}
                className={`absolute h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[0])}`}
                style={{ width: '465px', left: '0px', top: '0px' }}
              >
                <span 
                  className={`font-prompt ${getTextColor(priorityList[0])}`} 
                  style={{ fontSize: '40px', letterSpacing: '0.4px', fontWeight: 700 }}
                >
                  {priorityList[0]}
                </span>
              </button>
              
              {/* choice_2: ปรับปรุงคุณภาพรถเมล์ */}
              <button
                onClick={() => !isSelectionDisabled(priorityList[1]) && handlePriorityToggle(priorityList[1])}
                disabled={isSelectionDisabled(priorityList[1])}
                className={`absolute h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[1])}`}
                style={{ width: '500px', left: '484px', top: '0px' }}
              >
                <span 
                  className={`font-prompt ${getTextColor(priorityList[1])}`} 
                  style={{ fontSize: '40px', letterSpacing: '0.4px', fontWeight: 700 }}
                >
                  {priorityList[1]}
                </span>
              </button>
            </div>

            {/* Row 2: choice_3, choice_4, choice_5 */}
            <div className="absolute" style={{ top: '114px', left: '0px', width: '984px' }}>
              {/* choice_3: ตั๋วร่วม */}
              <button
                onClick={() => !isSelectionDisabled(priorityList[2]) && handlePriorityToggle(priorityList[2])}
                disabled={isSelectionDisabled(priorityList[2])}
                className={`absolute h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[2])}`}
                style={{ width: '248px', left: '0px', top: '0px' }}
              >
                <span 
                  className={`font-prompt ${getTextColor(priorityList[2])}`} 
                  style={{ fontSize: '40px', letterSpacing: '0.4px', fontWeight: 700 }}
                >
                  {priorityList[2]}
                </span>
              </button>
              
              {/* choice_4: เพิ่มความถี่รถเมล์ */}
              <button
                onClick={() => !isSelectionDisabled(priorityList[3]) && handlePriorityToggle(priorityList[3])}
                disabled={isSelectionDisabled(priorityList[3])}
                className={`absolute h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[3])}`}
                style={{ width: '385px', left: '277px', top: '0px' }}
              >
                <span 
                  className={`font-prompt ${getTextColor(priorityList[3])}`} 
                  style={{ fontSize: '40px', letterSpacing: '0.4px', fontWeight: 700 }}
                >
                  {priorityList[3]}
                </span>
              </button>
              
              {/* choice_5: เพิ่มที่จอดรถ */}
              <button
                onClick={() => !isSelectionDisabled(priorityList[4]) && handlePriorityToggle(priorityList[4])}
                disabled={isSelectionDisabled(priorityList[4])}
                className={`absolute h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[4])}`}
                style={{ width: '293px', left: '691px', top: '0px' }}
              >
                <span 
                  className={`font-prompt ${getTextColor(priorityList[4])}`} 
                  style={{ fontSize: '40px', letterSpacing: '0.4px', fontWeight: 700 }}
                >
                  {priorityList[4]}
                </span>
              </button>
            </div>

            {/* Row 3: choice_6, choice_7 */}
            <div className="absolute" style={{ top: '228px', left: '0px', width: '984px' }}>
              {/* choice_6: เพิ่มความถี่รถไฟฟ้า */}
              <button
                onClick={() => !isSelectionDisabled(priorityList[5]) && handlePriorityToggle(priorityList[5])}
                disabled={isSelectionDisabled(priorityList[5])}
                className={`absolute h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[5])}`}
                style={{ width: '465px', left: '0px', top: '0px' }}
              >
                <span 
                  className={`font-prompt ${getTextColor(priorityList[5])}`} 
                  style={{ fontSize: '40px', letterSpacing: '0.4px', fontWeight: 700 }}
                >
                  {priorityList[5]}
                </span>
              </button>
              
              {/* choice_7: เพิ่ม Feeder ในซอย */}
              <button
                onClick={() => !isSelectionDisabled(priorityList[6]) && handlePriorityToggle(priorityList[6])}
                disabled={isSelectionDisabled(priorityList[6])}
                className={`absolute h-[90px] rounded-[40px] border transition-all duration-200 ${getButtonColor(priorityList[6])}`}
                style={{ width: '480px', left: '503px', top: '0px' }}
              >
                <span 
                  className={`font-prompt ${getTextColor(priorityList[6])}`} 
                  style={{ fontSize: '40px', letterSpacing: '0.4px', fontWeight: 700 }}
                >
                  {priorityList[6]}
                </span>
              </button>
            </div>
          </div>

          {/* Continue Button - positioned at top:1749px in Figma */}
          <div className="w-full flex justify-center">
            <div className="relative w-full flex justify-center" style={{ width: '100%', maxWidth: '1154px', height: '6.15%' }}>
              <button
                onClick={handleNext}
                disabled={selectedPriorities.length === 0}
                className={`absolute h-[118px] rounded-[50px] border-[1.5px] border-black flex items-center justify-center transition-all duration-200 ${
                  selectedPriorities.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#FFE000] hover:bg-black hover:scale-105 group"
                }`}
                style={{ width: '845px', left: '155px', top: '0px' }}
                aria-describedby="next-button-description"
              >
                <span
                  className={`font-prompt ${
                    selectedPriorities.length === 0 
                      ? "text-gray-600" 
                      : "text-black group-hover:text-[#FFE000]"
                  }`}
                  style={{ fontSize: '50px', fontWeight: 400, letterSpacing: '0.4px' }}
                >
                  ไปต่อ
                </span>
              </button>
            </div>

            {selectedPriorities.length === 0 && (
              <div
                id="next-button-description"
                className="absolute text-center font-prompt"
                style={{ 
                  color: '#000D59', 
                  fontSize: '18px',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: '16px'
                }}
              >
                กรุณาเลือกอย่างน้อย 1 ข้อเพื่อดำเนินการต่อ
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_Choice;
