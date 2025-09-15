import React from 'react';

interface CustomizationScreenProps {
  title: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  onBack?: () => void;
  theme?: 'dark' | 'light';
}

const CustomizationScreen: React.FC<CustomizationScreenProps> = ({ title, children, footerContent, onBack, theme = 'dark' }) => {
  const isLight = theme === 'light';
  return (
    <div className={`min-h-screen flex flex-col ${isLight ? 'bg-white text-black' : 'bg-[#000d59] text-white'}`}>
      <header className="px-6 py-4 border-b border-[#081042] flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} aria-label="Back" className={`p-2 rounded-md ${isLight ? 'bg-black/5 text-black' : 'bg-white/5 text-white'}`}>
            ←
          </button>
        )}
        <h1 className="text-2xl font-prompt font-semibold">{title}</h1>
      </header>

      <div className="flex-1 overflow-auto px-6 py-6">{children}</div>

      <footer className="mt-auto">
        <div className="bg-[#00d5f9] rounded-t-3xl p-6 drop-shadow-lg">
          <div className="max-w-4xl mx-auto">{footerContent}</div>
        </div>
      </footer>
    </div>
  );
};

export default CustomizationScreen;
