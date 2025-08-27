import React from "react";

interface FigmaStyle1LayoutProps {
  /** Background image URL */
  backgroundImage: string;
  /** Alt text for background image */
  backgroundAlt?: string;
  /** Title text to display */
  title: string;
  /** Array of button configurations */
  buttons: Array<{
    text: string;
    onClick: () => void;
    ariaLabel?: string;
  }>;
  /** Optional replay button configuration */
  replayButton?: {
    onClick: () => void;
    ariaLabel?: string;
  };
  /** Additional CSS classes for customization */
  className?: string;
}

/**
 * FigmaStyle1Layout - Reusable layout component for figma-style1 design system
 *
 * Features:
 * - Mobile-first responsive design
 * - Full-screen background with gradient overlay
 * - Bottom-positioned content
 * - Consistent button interactions
 * - Optional enhanced replay button
 * - Accessibility support
 */
const FigmaStyle1Layout: React.FC<FigmaStyle1LayoutProps> = ({
  backgroundImage,
  backgroundAlt = "Background image",
  title,
  buttons,
  replayButton,
  className = "",
}) => {
  return (
    <div className={`figma-style1-container ${className}`}>
      <div className="figma-style1-content">
        {/* Background Image with Overlay */}
        <div className="figma-style1-background">
          <img
            src={backgroundImage}
            alt={backgroundAlt}
            className="figma-style1-background-image"
          />
          <div className="figma-style1-background-overlay" />
        </div>

        {/* Main Content */}
        <div className="figma-style1-main">
          {/* Replay Button (Optional) */}
          {replayButton && (
            <div className="figma-style1-header">
              <button
                onClick={replayButton.onClick}
                className="figma-style1-replay-button"
                aria-label={replayButton.ariaLabel || "ดูอีกครั้ง"}
              >
                <svg
                  width="133"
                  height="150"
                  viewBox="0 0 133 150"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="figma-style1-replay-svg"
                >
                  <g filter="url(#filter0_d_replay)">
                    <circle cx="58" cy="25" r="25" fill="#EFBA31" />
                  </g>
                  <path
                    d="M58.2569 12.2075C58.1426 12.2075 58.0283 12.2218 57.914 12.2218L59.0855 10.7647C59.4569 10.3075 59.3855 9.62182 58.914 9.26467C58.4569 8.89324 57.7855 8.96467 57.414 9.4361L54.5998 12.9504C54.5855 12.9647 54.5855 12.979 54.5712 13.0075C54.5283 13.0647 54.4998 13.1361 54.4712 13.1932C54.4426 13.2647 54.414 13.3218 54.3998 13.379C54.3855 13.4504 54.3855 13.5075 54.3855 13.579C54.3855 13.6504 54.3855 13.7218 54.3855 13.7932C54.3855 13.8218 54.3855 13.8361 54.3855 13.8647C54.3998 13.9075 54.4283 13.9361 54.4426 13.9932C54.4712 14.0647 54.4855 14.1218 54.5283 14.179C54.5712 14.2361 54.614 14.2932 54.6712 14.3504C54.6998 14.379 54.7283 14.4218 54.7569 14.4504C54.7712 14.4647 54.7998 14.4647 54.814 14.479C54.8569 14.5075 54.8998 14.5361 54.9569 14.5504C55.0283 14.5932 55.0998 14.6218 55.1712 14.6361C55.2283 14.6647 55.2712 14.6647 55.3283 14.6647C55.3712 14.6647 55.3998 14.679 55.4426 14.679C55.4712 14.679 55.514 14.6647 55.5426 14.6504C55.5855 14.6504 55.6283 14.6504 55.6855 14.6504C56.5998 14.4361 57.4569 14.3361 58.2712 14.3361C64.6855 14.3361 69.8998 19.5504 69.8998 25.9647C69.8998 32.379 64.6855 37.5932 58.2712 37.5932C51.8569 37.5932 46.6426 32.379 46.6426 25.9647C46.6426 23.479 47.4569 21.079 48.9998 19.0218C49.3569 18.5504 49.2569 17.879 48.7855 17.5218C48.314 17.1647 47.6426 17.2647 47.2855 17.7361C45.4569 20.1647 44.4998 23.0075 44.4998 25.9647C44.4998 33.5504 50.6712 39.7361 58.2712 39.7361C65.8712 39.7361 72.0426 33.5647 72.0426 25.9647C72.0426 18.3647 65.8426 12.2075 58.2569 12.2075Z"
                    fill="black"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M55.9961 21.1327C55.3295 20.7518 54.5 21.2331 54.5 22.001V28.5546C54.5 29.3224 55.3295 29.8038 55.9961 29.4228L61.7306 26.146C62.4024 25.7621 62.4024 24.7934 61.7306 24.4095L55.9961 21.1327Z"
                    fill="black"
                  />
                  <text
                    fill="black"
                    xmlSpace="preserve"
                    style={{ whiteSpace: "pre" }}
                    fontFamily="Kanit"
                    fontSize="14"
                    fontWeight="500"
                    letterSpacing="0px"
                  >
                    <tspan x="36.4531" y="64.23">
                      ดูอีกครั้ง
                    </tspan>
                  </text>
                  <defs>
                    <filter
                      id="filter0_d_replay"
                      x="-17"
                      y="0"
                      width="150"
                      height="150"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="50" />
                      <feGaussianBlur stdDeviation="25" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.109804 0 0 0 0 0.109804 0 0 0 0 0.133333 0 0 0 0.1 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_replay"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_replay"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
              </button>
            </div>
          )}

          {/* Content Area */}
          <div className="figma-style1-content-area">
            {/* Title */}
            <div className="figma-style1-title-container">
              <h1 className="figma-style1-title">{title}</h1>
            </div>

            {/* Buttons */}
            <div className="figma-style1-button-container">
              {buttons.map((button, index) => (
                <React.Fragment key={index}>
                  <button
                    onClick={button.onClick}
                    className="figma-style1-button"
                    aria-describedby={`button-description-${index}`}
                  >
                    <span className="figma-style1-button-text">
                      {button.text}
                    </span>
                  </button>
                  {button.ariaLabel && (
                    <div
                      id={`button-description-${index}`}
                      className="figma-style1-sr-only"
                    >
                      {button.ariaLabel}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FigmaStyle1Layout;
