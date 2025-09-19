import React from "react";

interface StepTabsProps {
  active: number; // 1-based index
  className?: string;
}

const iconCommon = "h-full w-auto max-w-full";

const BusIcon = ({ active }: { active: boolean }) => (
  <svg
    className={iconCommon}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="6"
      width="18"
      height="9"
      rx="2"
      stroke={active ? "#003366" : "#CCCCCC"}
      strokeWidth="1.8"
    />
    <circle cx="8" cy="17" r="1.6" fill={active ? "#003366" : "#CCCCCC"} />
    <circle cx="16" cy="17" r="1.6" fill={active ? "#003366" : "#CCCCCC"} />
  </svg>
);

const DeckIcon = ({ active }: { active: boolean }) => (
  <svg
    className={iconCommon}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="7"
      width="16"
      height="3"
      rx="1"
      fill={active ? "#003366" : "#CCCCCC"}
    />
    <rect
      x="4"
      y="12"
      width="16"
      height="3"
      rx="1"
      fill={active ? "#003366" : "#CCCCCC"}
    />
  </svg>
);

const ChairIcon = ({ active }: { active: boolean }) => (
  <svg
    className={iconCommon}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="7"
      y="5"
      width="10"
      height="7"
      rx="2"
      stroke={active ? "#003366" : "#CCCCCC"}
      strokeWidth="1.8"
    />
    <rect
      x="6"
      y="14"
      width="12"
      height="4"
      rx="1"
      fill={active ? "#003366" : "#CCCCCC"}
    />
  </svg>
);

const TvIcon = ({ active }: { active: boolean }) => (
  <svg
    className={iconCommon}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="6"
      width="18"
      height="11"
      rx="2"
      stroke={active ? "#003366" : "#CCCCCC"}
      strokeWidth="1.8"
    />
    <rect
      x="9"
      y="18"
      width="6"
      height="2"
      rx="1"
      fill={active ? "#003366" : "#CCCCCC"}
    />
  </svg>
);

const ReceiptIcon = ({ active }: { active: boolean }) => (
  <svg
    className={iconCommon}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="6"
      y="4"
      width="12"
      height="16"
      rx="1"
      stroke={active ? "#003366" : "#CCCCCC"}
      strokeWidth="1.8"
    />
    <rect
      x="8"
      y="8"
      width="8"
      height="1.8"
      rx="0.9"
      fill={active ? "#003366" : "#CCCCCC"}
    />
    <rect
      x="8"
      y="12"
      width="8"
      height="1.8"
      rx="0.9"
      fill={active ? "#003366" : "#CCCCCC"}
    />
  </svg>
);

const TAB_IMG =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F62e50799090e485b9fec3c783a7c4d73?format=webp&width=800";
const TAB1_IMG =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F19f58256b4874e72b300380b1b49798e?format=webp&width=800";
const TAB2_IMG =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F537fad023a7649d39f23f06c560911a6?format=webp&width=800";
const TAB3_IMG =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F3f0c10c8393e4956b264d9e694bfcdb9?format=webp&width=800";
const TAB4_IMG =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F26eb6ca7ce4444559376b691e1f57529?format=webp&width=800";
const TAB5_IMG =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F722988d425e141738e4c3ef3c5521b1d?format=webp&width=800";

const StepTabs: React.FC<StepTabsProps> = ({ active, className }) => {
  const tabs = [BusIcon, DeckIcon, ChairIcon, TvIcon, ReceiptIcon];
  return (
    <div className={`${className ? className + " " : ""}flex flex-nowrap justify-between md:justify-around items-center gap-0 mb-4`}>
      {tabs.map((Icon, idx) => {
        const isActive = idx + 1 === active;
        const commonClasses = `text-center py-0 flex-1 min-w-0`;
        return (
          <div
            key={idx}
            className={commonClasses}
            aria-current={isActive ? "step" : undefined}
          >
            <div className="relative w-full max-w-[64px] md:max-w-[64px] h-8 md:h-10 flex items-center justify-center select-none">
              {
                (() => {
                  const src =
                    idx === 0
                      ? TAB1_IMG
                      : idx === 1
                      ? TAB2_IMG
                      : idx === 2
                      ? TAB3_IMG
                      : idx === 3
                      ? TAB4_IMG
                      : TAB5_IMG;

                  // Use mask-image to colorize the tab icon exactly. Active color = #000D59
                  const baseColor = isActive ? "#000D59" : "#CCCCCC";

                  return (
                    <div
                      role="img"
                      aria-label={isActive ? `แท็บที่ ${idx + 1} (แอคทีฟ)` : `แท็บที่ ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        background: baseColor,
                        WebkitMaskImage: `url(${src})`,
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskSize: "contain",
                        WebkitMaskPosition: "center",
                        maskImage: `url(${src})`,
                        maskRepeat: "no-repeat",
                        maskSize: "contain",
                        maskPosition: "center",
                        opacity: isActive ? 1 : 0.6,
                      }}
                    />
                  );
                })()
              }
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepTabs;
