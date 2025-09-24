import React, { useRef } from "react";

interface CustomizationScreenProps {
  title: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  theme?: "dark" | "light";
  footerBgImage?: string;
  // optional tailwind/css class to override footer background for specific pages (e.g. 'bg-white')
  footerBgClass?: string;
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
  footerBgClass,
  headerContent,
  fullWidth = false,
  containerPaddingClass,
}) => {
  const isLight = theme === "light";
  const contentRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [footerHeight, setFooterHeight] = React.useState<number>(0);

  React.useEffect(() => {
    const update = () => {
      try {
        // measure footer height and set padding for content to avoid overlap
        const h = footerRef.current?.offsetHeight || 0;
        setFooterHeight(h);
      } catch (e) {}
    };
    // schedule measurement after render
    setTimeout(update, 0);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [footerContent, fullWidth]);

  // When fullWidth is requested, add a body-level class so the outer app container
  // can remove its overflow/padding and allow full-bleed children to extend to viewport edges.
  React.useEffect(() => {
    const className = "full-bleed-page";
    if (fullWidth) {
      try {
        document.body.classList.add(className);
      } catch (e) {}
    }
    return () => {
      try {
        document.body.classList.remove(className);
      } catch (e) {}
    };
  }, [fullWidth]);

  return (
    <div
      className={`flex flex-col min-h-0 ${isLight ? "bg-white text-black" : "bg-[#000d59] text-white"}`}
    >
      {title?.trim() || headerContent ? (
        <header
          className={`${fullWidth ? "px-0" : "px-6"} flex items-center justify-center py-3 md:py-4`}
          style={
            fullWidth
              ? undefined
              : {
                  paddingLeft: "var(--page-horizontal-padding)",
                  paddingRight: "var(--page-horizontal-padding)",
                }
          }
        >
          <div
            className={`${fullWidth ? "w-full" : "max-w-4xl w-full"} flex items-center justify-center ${containerPaddingClass || ""}`}
          >
            {headerContent ? (
              <div className="w-full flex items-center justify-center">
                {headerContent}
              </div>
            ) : (
              <h1
                className="text-lg md:text-2xl font-prompt font-semibold customization-title text-center w-full break-words leading-tight"
                style={{ whiteSpace: "normal" }}
              >
                {title}
              </h1>
            )}
          </div>
        </header>
      ) : null}

      <div
        ref={contentRef}
        className={`flex-1 min-h-0 overflow-auto uk2-scroll ${containerPaddingClass ? containerPaddingClass : fullWidth ? "px-0 py-4" : "px-4 py-4"}`}
        style={{
          // keep space for the fixed/sticky footer so content isn't hidden behind it
          paddingBottom: footerContent ? `calc(${footerHeight}px + 12px)` : undefined,
          // when fullWidth, allow content to expand and let page-level scrolling handle it
          overflow: fullWidth ? "visible" : undefined,
        }}
      >
        {children}
      </div>
      {footerContent ? (
        <div
          ref={footerRef}
          className={`${footerBgClass || "bg-[#00d5f9]"} fixed left-0 right-0 z-50`}
          style={{ bottom: 0, paddingTop: "12px", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
          role="contentinfo"
        >
          <div
            className={
              containerPaddingClass
                ? `w-full ${containerPaddingClass}`
                : fullWidth
                  ? `w-full px-0`
                  : `max-w-4xl mx-auto w-full px-4 sm:px-6`
            }
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...(fullWidth
                ? {
                    width: "100vw",
                    marginLeft: "calc(50% - 50vw)",
                    marginRight: "calc(50% - 50vw)",
                  }
                : {}),
            }}
          >
            <div className="w-full flex items-center justify-center">
              {footerContent}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomizationScreen;
