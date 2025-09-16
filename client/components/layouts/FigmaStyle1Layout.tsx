import React from "react";

import { memo, Fragment, useEffect, useState } from "react";

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
  children,
}: FigmaStyle1LayoutProps) => {
  // Determine if this is the source selection page
  const isSourceSelection = className?.includes("source-selection-page");

  // Platform detection to allow iOS vs Android spacing control
  const [platformClass, setPlatformClass] = useState("");
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent || "";
    const isAndroid = /Android/i.test(ua);
    const isIPad = /iPad/.test(ua) || (navigator.platform === 'MacIntel' && typeof (window as any).ontouchend === 'object');
    const isIPhone = /iPhone/.test(ua);
    if (isAndroid) setPlatformClass("is-android");
    else if (isIPhone || isIPad) setPlatformClass("is-ios");
  }, []);

  return (
    <div className={`figma-style1-container ${className} ${platformClass}`}>
      <div className="figma-style1-content">
        {/* Background Image (overlay only rendered when useBlueOverlay is true) */}
        <div className="figma-style1-background">
          {/* Use responsive img with srcset to control focal point and load appropriate sizes on mobile */}
          {backgroundImage ? (
            (() => {
              // helper to set width param on builder.io image urls (safe fallback if params exist)
              const setWidth = (url: string, w: number) => {
                try {
                  const u = new URL(url);
                  u.searchParams.set("width", String(w));
                  return u.toString();
                } catch (e) {
                  // fallback: append param
                  return url + (url.includes("?") ? "&" : "?") + `width=${w}`;
                }
              };

              const src480 = setWidth(backgroundImage, 480);
              const src720 = setWidth(backgroundImage, 720);
              const src1080 = setWidth(backgroundImage, 1080);
              const src2160 = setWidth(backgroundImage, 2160);

              return (
                <img
                  src={src720}
                  srcSet={`${src480} 480w, ${src720} 720w, ${src1080} 1080w, ${src2160} 2160w`}
                  sizes="(max-width: 480px) 100vw, (max-width: 1024px) 100vw, 100vw"
                  alt={backgroundAlt}
                  className="figma-style1-background-image"
                  loading={imageLoading}
                  decoding="async"
                />
              );
            })()
          ) : null}

          {useBlueOverlay ? (
            <div
              className={`figma-style1-background-overlay figma-style1-background-overlay--blue`}
            />
          ) : null}
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
                  <div
                    className="w-[50px] h-[50px] rounded-full flex items-center justify-center mb-2 shadow-lg"
                    style={{ backgroundColor: "#FFE000" }}
                  >
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
            {/* Title (always rendered if provided) */}
            {title && (
              <div className="figma-style1-title-container">
                <h1
                  className={`figma-style1-title ${isSourceSelection ? "figma-style1-title--black" : ""}`}
                >
                  {title}
                </h1>
              </div>
            )}

            {/* If children are provided, render them (useful for custom screens) */}
            {children ? (
              <>{children}</>
            ) : (
              <>
                {/* Buttons */}
                <div className="figma-style1-button-container">
                  {buttons?.map((button, index) => (
                    <Fragment key={index}>
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
                    </Fragment>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FigmaStyle1Layout);
