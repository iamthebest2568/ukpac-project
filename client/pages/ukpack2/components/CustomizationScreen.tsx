import React from "react";

interface CustomizationScreenProps {
  title: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  theme?: "dark" | "light";
}

const CustomizationScreen: React.FC<CustomizationScreenProps> = ({
  title,
  children,
  footerContent,
  theme = "dark",
}) => {
  const isLight = theme === "light";
  return (
    <div
      className={`min-h-screen flex flex-col ${isLight ? "bg-white text-black" : "bg-[#000d59] text-white"}`}
    >
      <header className="px-6 border-b border-[#081042] flex items-center justify-center h-16">
        <div className="max-w-4xl w-full flex items-center justify-center">
          <h1 className="text-2xl font-prompt font-semibold">{title}</h1>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-6 py-6 pb-28">{children}</div>

      <footer className="fixed bottom-0 left-0 w-full z-40">
        <div className="bg-[#00d5f9] rounded-t-3xl p-6 drop-shadow-lg">
          <div className="max-w-4xl mx-auto px-6" style={{ paddingBottom: 'env(safe-area-inset-bottom, 1rem)' }}>
            {footerContent}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomizationScreen;
