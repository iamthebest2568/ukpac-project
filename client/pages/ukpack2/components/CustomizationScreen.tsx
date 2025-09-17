import React, { useEffect, useRef, useState } from "react";

interface CustomizationScreenProps {
  title: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  theme?: "dark" | "light";
  footerBgImage?: string;
  headerContent?: React.ReactNode;
}

const CustomizationScreen: React.FC<CustomizationScreenProps> = ({
  title,
  children,
  footerContent,
  theme = "dark",
  footerBgImage,
  headerContent,
}) => {
  const isLight = theme === "light";
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={`min-h-screen flex flex-col ${isLight ? "bg-white text-black" : "bg-[#000d59] text-white"}`}
    >
      {title?.trim() || headerContent ? (
        <header className="px-6 flex items-center justify-center h-16">
          <div className="max-w-4xl w-full flex items-center justify-center">
            {headerContent ? (
              <div className="w-full flex items-center justify-center">
                {headerContent}
              </div>
            ) : (
              <h1 className="text-2xl font-prompt font-semibold customization-title">
                {title}
              </h1>
            )}
          </div>
        </header>
      ) : null}

      <div ref={contentRef} className="flex-1 min-h-0 uk2-scroll px-6 py-6">
        {children}
      </div>
      {footerContent ? (
        <div>
          <div
            className={`${footerBgImage ? "rounded-t-3xl p-6 drop-shadow-lg bg-no-repeat bg-top bg-cover" : "bg-[#00d5f9] rounded-t-3xl p-6 drop-shadow-lg"}`}
            style={
              footerBgImage
                ? { backgroundImage: `url('${footerBgImage}')` }
                : undefined
            }
          >
            <div
              className="max-w-4xl mx-auto px-6"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 1rem)" }}
            >
              {footerContent}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomizationScreen;
