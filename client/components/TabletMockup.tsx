import React from "react";

const TabletMockup: React.FC<{
  children?: React.ReactNode;
  iframeSrc?: string;
}> = ({ children, iframeSrc }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <div
        aria-hidden
        style={{
          width: 860,
          borderRadius: 28,
          padding: 10,
          background: "linear-gradient(180deg,#f7f8fb,#eef2f7)",
          boxShadow:
            "0 30px 60px rgba(2,6,23,0.16), 0 8px 20px rgba(2,6,23,0.08)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* bezel */}
        <div
          style={{
            background: "#0b0b0b",
            borderRadius: 18,
            padding: 8,
            boxSizing: "content-box",
            width: 842,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* screen area (exact 810x1080) */}
          <div
            style={{
              width: 810,
              height: 1080,
              borderRadius: 12,
              overflow: "hidden",
              background: "white",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
              display: "block",
            }}
            className="tablet-mockup-screen"
          >
            {/* This inner wrapper ensures the app content fits exactly into the viewport */}
            <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
              {iframeSrc ? (
                <iframe
                  src={iframeSrc}
                  title="Tablet viewport"
                  width={810}
                  height={1080}
                  style={{
                    border: "none",
                    display: "block",
                    width: 810,
                    height: 1080,
                  }}
                />
              ) : (
                children
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabletMockup;
