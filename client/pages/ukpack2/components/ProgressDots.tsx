import React from 'react';

interface ProgressDotsProps {
  total?: number;
  active?: number; // 1-based index
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ total = 5, active = 1 }) => {
  const dots = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-3" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={active}>
      {dots.map((d) => {
        const isActive = d === active;
        const common = 'w-3 h-3 rounded-full flex items-center justify-center';
        const activeClass = 'bg-[#ffe000] border-transparent shadow-sm';
        const inactiveClass = 'bg-transparent border border-white/60';

        return (
          <div
            key={d}
            className={`${common} ${isActive ? activeClass : inactiveClass}`}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`Step ${d} ${isActive ? 'active' : 'inactive'}`}
          />
        );
      })}
    </div>
  );
};

export default ProgressDots;
