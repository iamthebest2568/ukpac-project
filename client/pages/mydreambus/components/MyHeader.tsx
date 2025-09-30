import React from "react";

interface MyHeaderProps {
  short?: React.ReactNode;
  long?: React.ReactNode;
  imageSrc?: string;
  className?: string;
}

const MyHeader: React.FC<MyHeaderProps> = ({ short, long, imageSrc, className }) => {
  return (
    <header className={`mydreambus-header ${className || ""}`.trim()}>
      <div className="header-row">
        <div className="header-short">{short}</div>
        <div aria-hidden className="header-actions" />
      </div>
      {long ? <div className="header-row"><div className="header-long">{long}</div></div> : null}
      {imageSrc ? (
        <div className="header-row">
          <img src={imageSrc} alt="header" className="header-image" />
        </div>
      ) : null}
    </header>
  );
};

export default MyHeader;
