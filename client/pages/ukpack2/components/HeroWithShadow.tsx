import React from 'react';

const SHADOW_URL = 'https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff56ca3997f7a4b9482ffee091c4fec96?format=webp&width=800';

interface Props {
  children: React.ReactNode;
  shadowClassName?: string;
  containerClassName?: string;
}

const HeroWithShadow: React.FC<Props> = ({ children, shadowClassName = 'absolute bottom-0 w-[72%] max-w-[420px] pointer-events-none select-none', containerClassName = 'relative w-[72%] max-w-[420px]' }) => {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: '160px' }}>
      <img src={SHADOW_URL} alt="เงารถ" className={shadowClassName} decoding="async" loading="eager" aria-hidden="true" />
      <div className={containerClassName}>{children}</div>
    </div>
  );
};

export default HeroWithShadow;
