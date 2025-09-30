import React from "react";

interface MyFooterProps {
  children?: React.ReactNode;
  className?: string;
}

const MyFooter: React.FC<MyFooterProps> = ({ children, className }) => {
  return (
    <footer className={`mydreambus-footer ${className || ""}`.trim()}>
      <div className="footer-row">
        {children ? (
          children
        ) : (
          <button className="cta-button" type="button">
            ถัดไป
          </button>
        )}
      </div>
    </footer>
  );
};

export default MyFooter;
