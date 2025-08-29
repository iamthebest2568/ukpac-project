import React from "react";

interface FigmaStyle1LayoutProps {
  /** Background image URL or video URL */
  backgroundImage: string;
  /** Alt text for background image */
  backgroundAlt?: string;
  /** Whether the background is a video */
  isVideo?: boolean;
  /** Title text to display */
  title: string;
  /** Array of button configurations */
  buttons: Array<{
    text: string;
    onClick: () => void;
    ariaLabel?: string;
    isSelected?: boolean;
    variant?: "default" | "dark";
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
  isVideo = false,
}) => {
  return (
    <div className={`figma-style1-container ${className}`}>
      <div className="figma-style1-content">
        {/* Background Image/Video with Overlay */}
        <div className="figma-style1-background">
          {isVideo ? (
            <video
              src={backgroundImage}
              autoPlay={true}
              loop={true}
              muted={true}
              playsInline={true}
              controls={false}
              preload="auto"
              className="figma-style1-background-image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              onLoadStart={() => console.log('Video loading started')}
              onCanPlay={() => console.log('Video can play')}
              onError={(e) => console.error('Video error:', e)}
              onLoadedData={() => console.log('Video data loaded')}
            />
          ) : (
            <img
              src={backgroundImage}
              alt={backgroundAlt}
              className="figma-style1-background-image"
            />
          )}
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
                <div className="flex flex-col items-center">
                  {/* Yellow Circle with Replay Icon */}
                  <div className="w-[50px] h-[50px] bg-[#EFBA31] rounded-full flex items-center justify-center mb-2 shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="black"/>
                    </svg>
                  </div>
                  {/* Text */}
                  <span className="text-black font-kanit text-sm font-medium">ดูอีกครั้ง</span>
                </div>
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
