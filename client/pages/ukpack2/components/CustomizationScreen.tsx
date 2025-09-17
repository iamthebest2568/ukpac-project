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
      className={`h-screen flex flex-col overflow-hidden ${isLight ? "bg-white text-black" : "bg-[#000d59] text-white"}`}
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

      <div ref={contentRef} className="flex-1 min-h-0 px-6 py-6" style={{ height: "calc(100vh - 64px - (56px + env(safe-area-inset-bottom, 0px)))", overflow: 'hidden' }}>
        {children}
      </div>
      {footerContent ? (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="bg-[#00d5f9] w-full" style={{ height: "calc(64px + env(safe-area-inset-bottom, 0px))" }}>
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="w-full flex items-center justify-center">
                {footerContent}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomizationScreen;
