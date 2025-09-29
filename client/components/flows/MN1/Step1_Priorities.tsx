/**
 * UK PACK - MN1 Step 1: Priorities Selection
 * Updated to match exact Figma design with FigmaStyle1Layout
 */

import { useState } from "react";
import { logEvent } from "../../../services/dataLogger.js";
import FigmaStyle1Layout from "../../layouts/FigmaStyle1Layout.ukpack1";
import "../../../styles/minigame-mn1-overrides.css";

interface Step1_PrioritiesProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: string[];
}

const Step1_Priorities = ({
  sessionID,
  onNext,
  onBack,
  initialData = [],
}: Step1_PrioritiesProps) => {
  const [selectedPriorities, setSelectedPriorities] =
    useState<string[]>(initialData);
  const maxSelections = 3;

  // Define the default colors for each button based on Figma
  const getDefaultButtonColor = (priority: string) => {
    switch (priority) {
      case "ปรับปรุงคุณภาพรถเมล์":
      case "เพิ่มความถี่รถเมล์":
        return "#FFE000"; // Yellow by default in Figma
      default:
        return "#E9E9E9"; // Gray by default in Figma
    }
  };

  const handlePriorityToggle = (priority: string) => {
    setSelectedPriorities((prev) => {
      const isSelected = prev.includes(priority);
      if (isSelected) return prev.filter((p) => p !== priority);
      if (prev.length < maxSelections) return [...prev, priority];
      return prev;
    });
  };

  const handleNext = () => {
    logEvent({
      event: "MINIGAME_MN1_COMPLETE",
      payload: { selectedPolicies: selectedPriorities, sessionID },
    });
    try {
      const body = {
        sessionId: sessionID || sessionStorage.getItem("ukPackSessionID") || "",
        event: "MN1_COMPLETE",
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

    onNext({ priorities: { selectedPriorities } });
  };

  const isSelectionDisabled = (priority: string) =>
    selectedPriorities.length >= maxSelections &&
    !selectedPriorities.includes(priority);

  const getButtonColor = (priority: string) => {
    const isSelected = selectedPriorities.includes(priority);
    const defaultColor = getDefaultButtonColor(priority);

    if (isSelected) {
      // When selected, switch colors: yellow becomes gray, gray becomes yellow
      return defaultColor === "#FFE000" ? "#E9E9E9" : "#FFE000";
    }

    // Default state from Figma
    return defaultColor;
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fa7f27d75c92b4bc1aee01a749a8a496a?format=webp&width=800"
      className="minigame-mn1-page figma-style1-ukpack1"
      imageLoading="eager"
    >
      {/* White overlay section with cityscape image */}
      <div className="absolute inset-0" style={{ top: "0%", height: "52%" }}>
        <div
          className="w-full h-full flex items-center justify-center bg-white"
          style={{ borderRadius: "0 0 800px 800px", overflow: "hidden" }}
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/3b287c4c812ae9bc78f9c5a8da49d3845fd1887f?width=2158"
            alt="Transportation cityscape background"
            className="w-full h-full object-cover"
            loading="eager"
            style={{ aspectRatio: "9/16" }}
          />
        </div>
      </div>

      {/* Title positioned as in Figma */}
      <div className="absolute w-full text-center" style={{ top: "53.2%" }}>
        <h1
          className="font-prompt text-center leading-normal"
          style={{
            color: "#000D59",
            fontSize: "clamp(32px, 7.4vw, 80px)",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          คุณคิดว่าควรใช้เงินที่ได้
          <br />
          จากการเก็บไปพัฒนาอะไร
        </h1>
      </div>

      {/* Subtitle positioned as in Figma */}
      <div className="absolute w-full text-center" style={{ top: "65%" }}>
        <p
          className="font-prompt text-center"
          style={{
            color: "#000D59",
            fontSize: "clamp(20px, 3.7vw, 40px)",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          ไม่เกิน 3 นโยบาย
        </p>
      </div>

      {/* Options Grid positioned as in Figma */}
      <div
        className="absolute w-full flex flex-col items-center"
        style={{ top: "71.4%" }}
      >
        <div
          className="flex flex-col"
          style={{
            width: "91.1%",
            maxWidth: "984px",
            gap: "clamp(16px, 1.2vw, 24px)",
          }}
        >
          {/* Row 1: ลดค่าโดยสารรถไฟฟ้า (gray), ปรับ���รุงคุณภาพรถเมล์ (yellow) */}
          <div className="flex" style={{ gap: "clamp(16px, 1.8vw, 19px)" }}>
            <button
              className="transition-all duration-200 flex items-center justify-center rounded-[40px] border-0"
              style={{
                width: "43.1%", // 465/1080
                height: "clamp(60px, 4.7vw, 90px)",
                backgroundColor: getButtonColor("ลดค่าโดยสารรถไฟฟ้า"),
                opacity: isSelectionDisabled("ลดค่าโดยสารรถไฟฟ้า") ? 0.5 : 1,
              }}
              onClick={() =>
                !isSelectionDisabled("ลดค่าโดยสารรถไฟฟ้า") &&
                handlePriorityToggle("ลดค่าโดยสารรถไฟฟ้า")
              }
              disabled={isSelectionDisabled("ลดค่าโดยสารรถไฟฟ้า")}
            >
              <span
                className="font-prompt text-black text-center"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                }}
              >
                ลดค่าโดยสารรถไฟฟ้า
              </span>
            </button>

            <button
              className="transition-all duration-200 flex items-center justify-center rounded-[40px] border-0"
              style={{
                width: "46.3%", // 500/1080
                height: "clamp(60px, 4.7vw, 90px)",
                backgroundColor: getButtonColor("ปรับปรุงคุณภาพรถเมล์"),
                opacity: isSelectionDisabled("ปรับปรุงคุณภาพรถเมล์") ? 0.5 : 1,
              }}
              onClick={() =>
                !isSelectionDisabled("ปรับปรุงคุณภาพรถเมล์") &&
                handlePriorityToggle("ปรับปรุงคุณภาพรถเมล์")
              }
              disabled={isSelectionDisabled("ปรับปรุงคุณภาพรถเมล์")}
            >
              <span
                className="font-prompt text-black text-center"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                }}
              >
                ปรับปรุงคุณภาพรถเมล์
              </span>
            </button>
          </div>

          {/* Row 2: ตั๋วร่วม (gray), เพิ่มความถี่รถเมล์ (yellow), เพิ่มที่จอดรถ (gray) */}
          <div className="flex" style={{ gap: "clamp(16px, 1.8vw, 19px)" }}>
            <button
              className="transition-all duration-200 flex items-center justify-center rounded-[40px] border-0"
              style={{
                width: "23%", // 248/1080
                height: "clamp(60px, 4.7vw, 90px)",
                backgroundColor: getButtonColor("ตั๋วร่วม"),
                opacity: isSelectionDisabled("ตั๋วร่วม") ? 0.5 : 1,
              }}
              onClick={() =>
                !isSelectionDisabled("ตั๋วร่วม") &&
                handlePriorityToggle("ตั๋วร่วม")
              }
              disabled={isSelectionDisabled("ตั๋วร่วม")}
            >
              <span
                className="font-prompt text-black text-center"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                }}
              >
                ตั๋วร่วม
              </span>
            </button>

            <button
              className="transition-all duration-200 flex items-center justify-center rounded-[40px] border-0"
              style={{
                width: "35.6%", // 385/1080
                height: "clamp(60px, 4.7vw, 90px)",
                backgroundColor: getButtonColor("เพิ่มความถี่รถเมล์"),
                opacity: isSelectionDisabled("เพิ่มความถี่รถเมล์") ? 0.5 : 1,
              }}
              onClick={() =>
                !isSelectionDisabled("เพิ่มความถี่รถเมล์") &&
                handlePriorityToggle("เพิ่มความถี่รถเมล์")
              }
              disabled={isSelectionDisabled("เพิ่มความถี่รถเมล์")}
            >
              <span
                className="font-prompt text-black text-center"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                }}
              >
                เพิ่มความถี่รถเมล์
              </span>
            </button>

            <button
              className="transition-all duration-200 flex items-center justify-center rounded-[40px] border-0"
              style={{
                width: "27.1%", // 293/1080
                height: "clamp(60px, 4.7vw, 90px)",
                backgroundColor: getButtonColor("เพิ่มที่จอดรถ"),
                opacity: isSelectionDisabled("เพิ่มที่จอดรถ") ? 0.5 : 1,
              }}
              onClick={() =>
                !isSelectionDisabled("เพิ่มที่จอดรถ") &&
                handlePriorityToggle("เพิ่มที่จอดรถ")
              }
              disabled={isSelectionDisabled("เพิ่มที่จอดรถ")}
            >
              <span
                className="font-prompt text-black text-center"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                }}
              >
                เพิ่มที่จอดรถ
              </span>
            </button>
          </div>

          {/* Row 3: เพิ่มความถี่รถไฟฟ้า (gray), เพิ่ม Feeder ใ��ซอย (gray) */}
          <div className="flex" style={{ gap: "clamp(16px, 1.8vw, 19px)" }}>
            <button
              className="transition-all duration-200 flex items-center justify-center rounded-[40px] border-0"
              style={{
                width: "43.1%", // 465/1080
                height: "clamp(60px, 4.7vw, 90px)",
                backgroundColor: getButtonColor("เพิ่มความถี่รถไฟฟ้า"),
                opacity: isSelectionDisabled("เพิ่มความถี่รถไฟฟ้า") ? 0.5 : 1,
              }}
              onClick={() =>
                !isSelectionDisabled("เพิ่มความถี่รถไฟฟ้า") &&
                handlePriorityToggle("เพิ่มความถี่รถไฟฟ้า")
              }
              disabled={isSelectionDisabled("เพิ่มความถี่รถไฟฟ้า")}
            >
              <span
                className="font-prompt text-black text-center"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                }}
              >
                เพิ่มความถี่รถไ��ฟ้า
              </span>
            </button>

            <button
              className="transition-all duration-200 flex items-center justify-center rounded-[40px] border-0"
              style={{
                width: "44.4%", // 480/1080
                height: "clamp(60px, 4.7vw, 90px)",
                backgroundColor: getButtonColor("เพิ่ม Feeder ในซอย"),
                opacity: isSelectionDisabled("เพิ่ม Feeder ในซอย") ? 0.5 : 1,
              }}
              onClick={() =>
                !isSelectionDisabled("เพิ่ม Feeder ในซอย") &&
                handlePriorityToggle("เพิ่ม Feeder ในซอย")
              }
              disabled={isSelectionDisabled("เพิ่ม Feeder ในซอย")}
            >
              <span
                className="font-prompt text-black text-center"
                style={{
                  fontSize: "clamp(16px, 3.7vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                }}
              >
                เพิ่ม Feeder ในซอย
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Continue Button positioned as in Figma */}
      <div
        className="absolute w-full flex flex-col items-center"
        style={{ top: "91.1%" }}
      >
        <div
          className="relative flex justify-center"
          style={{ width: "78.2%", maxWidth: "845px" }}
        >
          <button
            onClick={handleNext}
            disabled={selectedPriorities.length === 0}
            className="transition-all duration-200 bg-[#FFE000] hover:scale-105 hover:shadow-lg hover:bg-black active:bg-black group flex items-center justify-center"
            style={{
              width: "clamp(300px, 78.2vw, 845px)",
              height: "clamp(50px, 6.1vw, 118px)",
              borderRadius: "50px",
              border: "none",
              opacity: selectedPriorities.length === 0 ? 0.5 : 1,
              cursor:
                selectedPriorities.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            <span
              className="font-prompt text-center text-black group-hover:text-[#FFE000] group-active:text-[#FFE000]"
              style={{
                fontSize: "clamp(18px, 4.6vw, 50px)",
                fontWeight: 400,
                letterSpacing: "0.4px",
                lineHeight: "normal",
              }}
            >
              ไปต่อ
            </span>
          </button>
        </div>

        {selectedPriorities.length === 0 && (
          <div
            className="text-center mt-4"
            style={{
              color: "#000D59",
              fontSize: "clamp(14px, 2.8vw, 18px)",
            }}
          >
            กรุณาเลือกอย่างน้อย 1 ข้อเพื่อดำเนินการต่อ
          </div>
        )}
      </div>
    </FigmaStyle1Layout>
  );
};

export default Step1_Priorities;
