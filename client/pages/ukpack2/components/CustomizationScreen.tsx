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
      className={`h-screen flex flex-col ${isLight ? "bg-white text-black" : "bg-[#000d59] text-white"}`}
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

      <div ref={contentRef} className="flex-1 min-h-0 px-6 py-6 pb-28 overflow-auto">
        {children}
      </div>
      {footerContent ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
          <div
            className={`${footerBgImage ? "rounded-t-3xl p-4 sm:p-6 drop-shadow-lg bg-no-repeat bg-top bg-cover" : "bg-[#00d5f9] rounded-t-3xl p-4 sm:p-6 drop-shadow-lg"} mx-4 sm:mx-6 pointer-events-auto`}
            style={
              footerBgImage
                ? { backgroundImage: `url('${footerBgImage}')` }
                : undefined
            }
          >
            <div
              className="max-w-4xl mx-auto w-full px-4 sm:px-6"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 1rem)" }}
            >
              <div className="w-full flex items-center justify-center sm:justify-between gap-3">
                <div className="hidden sm:flex items-center text-sm text-white/90">
                  {title && <span className="font-medium">{title}</span>}
                </div>

                <div className="w-full sm:w-auto flex items-center justify-center">
                  {footerContent}
                </div>

                <div className="hidden sm:block" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomizationScreen;
