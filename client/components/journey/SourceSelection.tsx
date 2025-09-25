import FigmaStyle1Layout from "../layouts/FigmaStyle1Layout";
import { logEvent } from "../../services/dataLogger.js";

interface SourceSelectionProps {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

import { useState } from "react";

const SourceSelection = ({ sessionID, onNavigate }: SourceSelectionProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const options: { id: string; label: string }[] = [
    { id: "radio", label: "รายการวิทยุ" },
    { id: "tv_news", label: "รายการข่าวโทรทัศน์" },
    { id: "online_news", label: "รายการข่าวสื่อออนไลน์" },
    { id: "government", label: "เว็บไซต์ของหน่วยงานรัฐ" },
    { id: "road_sign", label: "ป้ายประกาศ หรือสื่อข้างทาง" },
    { id: "social", label: "สื่อสังคมออนไลน์ (Social Media)" },
    { id: "community", label: "กลุ่มเครือข่าย / ชุมชน / เพื่อน" },
    { id: "other", label: "อื่นๆ" },
  ];

  const toggle = (id: string, label: string) => {
    setSelected((s) => {
      const exists = s.includes(id);
      if (exists) return s.filter((x) => x !== id);
      if (s.length >= 3) return s; // max 3
      return [...s, id];
    });
  };

  const handleSubmit = () => {
    logEvent({
      event: "SOURCE_SELECTION_SUBMIT",
      payload: { selected, sessionID },
    });
    onNavigate("Flow_EndSequence", { selected });
  };

  return (
    <FigmaStyle1Layout
      backgroundImage="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fa9dea989b2c347318a49bb8e9f717a35?format=webp&width=800"
      backgroundAlt="รถไฟใต้ดินและป้ายข่าว"
      title={
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <span>
                ถ้าคุณจะหาข่าวต่อ
                <br />
                คุณจะติดตามข่าวจากแหล่งข่าวไหนเป็นหลัก
              </span>
            </div>
            <div style={{ fontSize: 14, marginTop: 8, color: "#374151" }}>
              เลือกได้ไม��เกิน 3 ข้อ
            </div>
          </div>
        </>
      }
      className="source-selection-page source-selection-root"
    >
      <div style={{ padding: "0 16px", maxWidth: 980, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}
        >
          {options.map((opt) => {
            const isSelected = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggle(opt.id, opt.label)}
                className={`figma-style1-button ${isSelected ? "figma-style1-button--selected" : ""}`}
                aria-pressed={isSelected}
                style={{ width: "100%" }}
              >
                <span className="figma-style1-button-text">{opt.label}</span>
              </button>
            );
          })}
        </div>

        <div
          style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
        >
          <div style={{ width: "100%", maxWidth: 420 }}>
            <button
              onClick={handleSubmit}
              className="figma-style1-button"
              disabled={selected.length === 0}
              aria-disabled={selected.length === 0}
              style={{ width: "100%" }}
            >
              <span className="figma-style1-button-text">ไปต่อ</span>
            </button>
          </div>
        </div>
      </div>
    </FigmaStyle1Layout>
  );
};

export default SourceSelection;
