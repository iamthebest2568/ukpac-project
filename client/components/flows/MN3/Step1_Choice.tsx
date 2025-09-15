/**
 * UK PACK - MN3 Step 1: Budget Choice Selection
 * Updated to match Figma design exactly with blue background and responsive layout
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
      return "#000000"; // Black when selected
    }
    if (isSelectionDisabled(priority)) {
      return "#d1d5db"; // Gray when disabled
    }
    if (defaultYellowButtons.has(priority)) {
      return "#FFE000"; // Yellow by default
    }
    return "#E9E9E9"; // Light gray by default
  };

  const getButtonClasses = (priority: string) => {
    const baseClasses = "option-btn transition-all duration-200 hover:scale-105";
    if (selectedPriorities.includes(priority)) {
      return `${baseClasses} bg-black border-black`;
    }
    if (isSelectionDisabled(priority)) {
      return `${baseClasses} opacity-50 cursor-not-allowed`;
    }
    return `${baseClasses} hover:bg-black group`;
  };

  const getTextColor = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      return "font-bold text-[#FFE000]";
    }
    return "font-bold text-black group-hover:text-[#FFE000]";
  };

  return (
    <div className="w-full min-h-screen bg-[#04D9F9] flex flex-col items-center justify-center relative" style={{ maxWidth: 1080, margin: '0 auto' }}>
      {/* Main Content Container */}
      <div className="responsive-content flex-col-center responsive-spacing-lg">
        
        {/* Title Section */}
        <div className="text-center w-full responsive-padding-md">
          <h1 className="heading-xl responsive-spacing-sm">
            คุณคิดว่าควรใช้เงินที่ได้<br />
            จากการเก็บไปพัฒนาอะไร
          </h1>
          <p className="heading-sm">
            ไม่เกิน 3 นโยบาย
          </p>
        </div>

        {/* Button Grid - Responsive Layout */}
        <div className="option-grid">
          
          {/* Row 1: choice_1 and choice_2 */}
          <div className="option-row">
            {/* choice_1: ลดค่าโดยสารรถไฟฟ้า */}
            <button
              onClick={() => !isSelectionDisabled(priorityList[0]) && handlePriorityToggle(priorityList[0])}
              disabled={isSelectionDisabled(priorityList[0])}
              className={getButtonClasses(priorityList[0])}
              style={{
                backgroundColor: getButtonColor(priorityList[0]),
                minWidth: 'clamp(180px, 40vw, 465px)',
                border: '2px solid #000'
              }}
            >
              <span 
                className={`font-prompt ${getTextColor(priorityList[0])}`} 
                style={{ 
                  fontSize: 'clamp(16px, 3.7vw, 40px)', 
                  letterSpacing: '0.4px', 
                  fontWeight: 700,
                  textAlign: 'center'
                }}
              >
                {priorityList[0]}
              </span>
            </button>
            
            {/* choice_2: ปรับปรุงคุณภาพรถเมล์ */}
            <button
              onClick={() => !isSelectionDisabled(priorityList[1]) && handlePriorityToggle(priorityList[1])}
              disabled={isSelectionDisabled(priorityList[1])}
              className={getButtonClasses(priorityList[1])}
              style={{
                backgroundColor: getButtonColor(priorityList[1]),
                minWidth: 'clamp(200px, 43vw, 500px)',
                border: '2px solid #000'
              }}
            >
              <span 
                className={`font-prompt ${getTextColor(priorityList[1])}`} 
                style={{ 
                  fontSize: 'clamp(16px, 3.7vw, 40px)', 
                  letterSpacing: '0.4px', 
                  fontWeight: 700,
                  textAlign: 'center'
                }}
              >
                {priorityList[1]}
              </span>
            </button>
          </div>

          {/* Row 2: choice_3, choice_4, choice_5 */}
          <div className="option-row">
            {/* choice_3: ตั๋วร่วม */}
            <button
              onClick={() => !isSelectionDisabled(priorityList[2]) && handlePriorityToggle(priorityList[2])}
              disabled={isSelectionDisabled(priorityList[2])}
              className={getButtonClasses(priorityList[2])}
              style={{
                backgroundColor: getButtonColor(priorityList[2]),
                minWidth: 'clamp(120px, 23vw, 248px)',
                border: '2px solid #000'
              }}
            >
              <span 
                className={`font-prompt ${getTextColor(priorityList[2])}`} 
                style={{ 
                  fontSize: 'clamp(16px, 3.7vw, 40px)', 
                  letterSpacing: '0.4px', 
                  fontWeight: 700,
                  textAlign: 'center'
                }}
              >
                {priorityList[2]}
              </span>
            </button>
            
            {/* choice_4: เพิ่มความถี่รถเมล์ */}
            <button
              onClick={() => !isSelectionDisabled(priorityList[3]) && handlePriorityToggle(priorityList[3])}
              disabled={isSelectionDisabled(priorityList[3])}
              className={getButtonClasses(priorityList[3])}
              style={{
                backgroundColor: getButtonColor(priorityList[3]),
                minWidth: 'clamp(180px, 35.6vw, 385px)',
                border: '2px solid #000'
              }}
            >
              <span 
                className={`font-prompt ${getTextColor(priorityList[3])}`} 
                style={{ 
                  fontSize: 'clamp(16px, 3.7vw, 40px)', 
                  letterSpacing: '0.4px', 
                  fontWeight: 700,
                  textAlign: 'center'
                }}
              >
                {priorityList[3]}
              </span>
            </button>
            
            {/* choice_5: เพิ่มที่จอดรถ */}
            <button
              onClick={() => !isSelectionDisabled(priorityList[4]) && handlePriorityToggle(priorityList[4])}
              disabled={isSelectionDisabled(priorityList[4])}
              className={getButtonClasses(priorityList[4])}
              style={{
                backgroundColor: getButtonColor(priorityList[4]),
                minWidth: 'clamp(140px, 27vw, 293px)',
                border: '2px solid #000'
              }}
            >
              <span 
                className={`font-prompt ${getTextColor(priorityList[4])}`} 
                style={{ 
                  fontSize: 'clamp(16px, 3.7vw, 40px)', 
                  letterSpacing: '0.4px', 
                  fontWeight: 700,
                  textAlign: 'center'
                }}
              >
                {priorityList[4]}
              </span>
            </button>
          </div>

          {/* Row 3: choice_6, choice_7 */}
          <div className="option-row">
            {/* choice_6: เพิ่มความถี่รถไฟฟ้า */}
            <button
              onClick={() => !isSelectionDisabled(priorityList[5]) && handlePriorityToggle(priorityList[5])}
              disabled={isSelectionDisabled(priorityList[5])}
              className={getButtonClasses(priorityList[5])}
              style={{
                backgroundColor: getButtonColor(priorityList[5]),
                minWidth: 'clamp(200px, 43vw, 465px)',
                border: '2px solid #000'
              }}
            >
              <span 
                className={`font-prompt ${getTextColor(priorityList[5])}`} 
                style={{ 
                  fontSize: 'clamp(16px, 3.7vw, 40px)', 
                  letterSpacing: '0.4px', 
                  fontWeight: 700,
                  textAlign: 'center'
                }}
              >
                {priorityList[5]}
              </span>
            </button>
            
            {/* choice_7: เพิ่ม Feeder ในซอย */}
            <button
              onClick={() => !isSelectionDisabled(priorityList[6]) && handlePriorityToggle(priorityList[6])}
              disabled={isSelectionDisabled(priorityList[6])}
              className={getButtonClasses(priorityList[6])}
              style={{
                backgroundColor: getButtonColor(priorityList[6]),
                minWidth: 'clamp(220px, 44.4vw, 480px)',
                border: '2px solid #000'
              }}
            >
              <span 
                className={`font-prompt ${getTextColor(priorityList[6])}`} 
                style={{ 
                  fontSize: 'clamp(16px, 3.7vw, 40px)', 
                  letterSpacing: '0.4px', 
                  fontWeight: 700,
                  textAlign: 'center'
                }}
              >
                {priorityList[6]}
              </span>
            </button>
          </div>
        </div>

        {/* Continue Button - Fixed Footer */}
        <div className="fixed-footer">
          <div className="btn-container">
            <button
              onClick={handleNext}
              disabled={selectedPriorities.length === 0}
              className="btn-large"
              aria-describedby="next-button-description"
            >
              ไปต่อ
            </button>
            {selectedPriorities.length === 0 && (
              <div
                id="next-button-description"
                className="text-subtitle text-center"
                style={{ color: '#000D59' }}
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
