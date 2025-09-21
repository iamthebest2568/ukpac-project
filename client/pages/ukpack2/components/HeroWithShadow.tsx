import React from 'react';

const SHADOW_URL = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff56ca3997f7a4b9482ffee091c4fec96?format=webp&width=800';

interface Props {
  children: React.ReactNode;
  shadowClassName?: string;
  containerClassName?: string;
}

const HeroWithShadow: React.FC<Props> = ({ children, shadowClassName = 'absolute bottom-3 left-1/2 transform -translate-x-1/2 w-4/5 max-w-[420px] pointer-events-none select-none z-0', containerClassName = 'relative w-full max-w-[420px] z-10' }) => {
  return (
    <div className="relative w-full flex items-end justify-center" style={{ minHeight: 120 }}>
      <img src={SHADOW_URL} alt="car shadow" className={shadowClassName} decoding="async" loading="eager" aria-hidden="true" />
      <div className={containerClassName}>{children}</div>
    </div>
  );
};

export default HeroWithShadow;
