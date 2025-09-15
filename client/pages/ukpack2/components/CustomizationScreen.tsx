import React, { useEffect, useRef, useState } from "react";

interface CustomizationScreenProps {
  title: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  theme?: "dark" | "light";
  footerBgImage?: string;
}

const CustomizationScreen: React.FC<CustomizationScreenProps> = ({
  title,
  children,
  footerContent,
  theme = "dark",
  footerBgImage,
}) => {
  const isLight = theme === "light";
  const contentRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    function update() {
      try {
        const h = footerRef.current?.getBoundingClientRect().height || 0;
        setFooterHeight(h);
      } catch (e) {
        // ignore
      }
    }
    update();
    window.addEventListener("resize", update);
    let ro: ResizeObserver | null = null;
    try {
      // observe footer size changes (safe-guard against older browsers)
      // @ts-ignore
      ro = new (window as any).ResizeObserver((entries: any) => update());
      if (footerRef.current && ro) ro.observe(footerRef.current);
    } catch (e) {
      ro = null;
    }
    return () => {
      window.removeEventListener("resize", update);
      if (ro && footerRef.current) ro.unobserve(footerRef.current);
    };
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col ${isLight ? "bg-white text-black" : "bg-[#000d59] text-white"}`}
    >
      {title?.trim() ? (
        <header className="px-6 border-b border-[#081042] flex items-center justify-center h-16">
          <div className="max-w-4xl w-full flex items-center justify-center">
            <h1 className="text-2xl font-prompt font-semibold">{title}</h1>
          </div>
        </header>
      ) : null}

      <div
        ref={contentRef}
        className="flex-1 overflow-auto px-6 py-6"
        style={{ paddingBottom: `calc(${footerHeight}px + env(safe-area-inset-bottom, 0px))` }}
      >
        {children}
      </div>

      <footer ref={footerRef} className="fixed bottom-0 left-0 w-full z-40">
        <div
          className={`${footerBgImage ? 'rounded-t-3xl p-6 drop-shadow-lg bg-no-repeat bg-top bg-cover' : 'bg-[#00d5f9] rounded-t-3xl p-6 drop-shadow-lg'}`}
          style={footerBgImage ? { backgroundImage: `url('${footerBgImage}')` } : undefined}
       >
          <div className="max-w-4xl mx-auto px-6" style={{ paddingBottom: 'env(safe-area-inset-bottom, 1rem)' }}>
            {footerContent}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomizationScreen;
