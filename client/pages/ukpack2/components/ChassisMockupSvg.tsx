import React from "react";

const ChassisMockupSvg: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className} aria-hidden="true">
      <svg
        width="100%"
        height="auto"
        viewBox="0 0 480 320"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#eef6ff" />
            <stop offset="100%" stopColor="#e6fff7" />
          </linearGradient>
        </defs>

        <rect
          x="8"
          y="50"
          rx="12"
          ry="12"
          width="464"
          height="180"
          fill="url(#g1)"
          stroke="#d0d2d3"
          strokeWidth="1"
        />

        {/* wheels */}
        <circle cx="120" cy="255" r="18" fill="#1c1e55" />
        <circle cx="360" cy="255" r="18" fill="#1c1e55" />

        {/* windows */}
        <rect
          x="40"
          y="78"
          width="392"
          height="40"
          rx="6"
          fill="#ffffff"
          opacity="0.9"
        />
        <rect
          x="40"
          y="126"
          width="280"
          height="22"
          rx="4"
          fill="#ffffff"
          opacity="0.85"
        />

        {/* door */}
        <rect
          x="330"
          y="120"
          width="40"
          height="60"
          rx="4"
          fill="#f7fafc"
          stroke="#d0d2d3"
        />

        {/* small label */}
        <text
          x="24"
          y="40"
          fill="#1c1e55"
          fontFamily="Prompt, sans-serif"
          fontSize="12"
          fontWeight={600}
        >
          รถตัวอย่าง
        </text>

        {/* badge star */}
        <g transform="translate(420 60)">
          <circle cx="0" cy="0" r="14" fill="#ffd166" />
          <text
            x="-4"
            y="4"
            fontSize="12"
            fontFamily="Prompt, sans-serif"
            fontWeight={700}
            fill="#1c1e55"
          >
            ★
          </text>
        </g>
      </svg>
    </div>
  );
};

export default ChassisMockupSvg;
