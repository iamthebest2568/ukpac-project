import React from "react";

interface Uk2FooterProps {
  children: React.ReactNode;
  className?: string;
}

const Uk2Footer: React.FC<Uk2FooterProps> = ({ children, className = "" }) => {
  return (
    <div className={`uk2-footer-wrapper w-full ${className}`}>
      <div className="max-w-4xl mx-auto flex items-end justify-center h-full">
        <div className="flex flex-col items-center gap-3 pb-12 w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Uk2Footer;
