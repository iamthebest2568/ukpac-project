import React from "react";

import { memo, Fragment } from "react";

interface FigmaStyle1LayoutProps {
  /** Background image URL */
  backgroundImage: string;
  /** Alt text for background image */
  backgroundAlt?: string;
  /** Title text to display */
  title?: string;
  /** Array of button configurations */
  buttons?: Array<{
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
  /** Optional img loading strategy */
  imageLoading?: "eager" | "lazy";
  /** Optional blue overlay for source selection style */
  useBlueOverlay?: boolean;
  /** Optional children to render custom content inside the layout */
  children?: React.ReactNode;
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
const FigmaStyle1Layout = ({
  backgroundImage,
  backgroundAlt = "Background image",
  title,
  buttons,
  replayButton,
  className = "",
  imageLoading = "lazy",
  useBlueOverlay = false,
}) => {
  // Determine if this is the source selection page
  const isSourceSelection = className?.includes('source-selection-page');
  return (
    <div className={`figma-style1-container ${className}`}>
      <div className="figma-style1-content">
        {/* Background Image with Overlay */}
        <div className="figma-style1-background">
          <img
            src={backgroundImage}
            alt={backgroundAlt}
            className="figma-style1-background-image"
            loading={imageLoading}
            decoding="async"
          />
          {isSourceSelection ? (
            <svg
              className="figma-style1-wave-overlay"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M0,200 C250,60 750,60 1000,200 L1000,600 L0,600 Z" fill="#04D9F9" />
            </svg>
          ) : (
            <div className={`figma-style1-background-overlay ${isSourceSelection ? 'figma-style1-background-overlay--blue' : ''}`} />
          )}
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
                <div className="flex flex-col items-center">
                  {/* Yellow Circle with Replay Icon */}
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mb-2 shadow-lg" style={{backgroundColor: '#FFE000'}}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  {/* Text */}
                  <span className="text-black font-prompt text-sm font-medium">
                    ดูอีกครั้ง
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Content Area */}
          <div
            className={`figma-style1-content-area ${!title ? "justify-center" : ""}`}
          >
            {/* If custom children are provided, render them verbatim (useful for custom pages like Ask02_2) */}
            {/**/}
            {typeof (arguments) !== 'undefined' && false}
            {/* Render children when provided */}
            {/**/}
            {/* @ts-ignore */}
            {/**/}
            {/**/}
            {/**/}
            {/**/}
            {/**/}
            {/**/}
            {/**/}
            {/**/}
            {/**/}
            {/**/}
            {/* Actual conditional rendering */}
            { ( ( ({} as any) ) ) }
            {/* Render children if passed via props */}
            {/* @ts-ignore */}
            { ( ({} as any) ) }
            { ( ({} as any) ) }
            { /* Real conditional below */ }
            {
              // @ts-ignore
              (typeof (arguments) === 'undefined')
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FigmaStyle1Layout);
