import React, { useRef } from "react";

interface CustomizationScreenProps {
  title: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  theme?: "dark" | "light";
  footerBgImage?: string;
  headerContent?: React.ReactNode;
  fullWidth?: boolean;
  // optional CSS module class to enforce consistent horizontal padding
  containerPaddingClass?: string;
}

const CustomizationScreen: React.FC<CustomizationScreenProps> = ({
  title,
  children,
  footerContent,
  theme = "dark",
  footerBgImage,
  headerContent,
  fullWidth = false,
  containerPaddingClass,
}) => {
  const isLight = theme === "light";
  const contentRef = useRef<HTMLDivElement | null>(null);

  // When fullWidth is requested, add a body-level class so the outer app container
  // can remove its overflow/padding and allow full-bleed children to extend to viewport edges.
  React.useEffect(() => {
    const className = 'full-bleed-page';
    if (fullWidth) {
      try { document.body.classList.add(className); } catch (e) {}
    }
    return () => {
      try { document.body.classList.remove(className); } catch (e) {}
    };
  }, [fullWidth]);

  return (
    <div
      className={`flex flex-col min-h-0 ${isLight ? "bg-white text-black" : "bg-[#000d59] text-white"}`}
    >
      {title?.trim() || headerContent ? (
        <header className={`${fullWidth ? "px-0" : "px-6"} flex items-center justify-center h-16`}>
          <div className={`${fullWidth ? "w-full" : "max-w-4xl w-full"} flex items-center justify-center ${containerPaddingClass || ""}`}>
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

      <div
        ref={contentRef}
        className={`flex-1 min-h-0 ${containerPaddingClass ? containerPaddingClass : (fullWidth ? "px-0 py-6" : "px-6 py-6")}` }
        style={{
          height:
            "calc(100vh - 64px - (56px + env(safe-area-inset-bottom, 0px)))",
          overflow: fullWidth ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
      {footerContent ? (
        <div className="fixed left-0 right-0 z-50" style={{ bottom: "50px" }}>
          <div
            className="bg-[#00d5f9] w-full"
            style={{ height: "calc(110px + env(safe-area-inset-bottom, 0px))" }}
          >
            <div
              className={containerPaddingClass ? `w-full ${containerPaddingClass}` : (fullWidth ? `w-full px-0` : `max-w-4xl mx-auto w-full px-4 sm:px-6`)}
              style={{
                height: "110px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...(fullWidth
                  ? { width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }
                  : {}),
              }}
            >
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
