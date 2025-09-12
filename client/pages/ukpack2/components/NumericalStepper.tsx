import React from 'react';

interface NumericalStepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

const NumericalStepper: React.FC<NumericalStepperProps> = ({ value, onChange, min = 0, max = 999 }) => {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={dec}
        className="px-3 py-1 border border-white rounded-md text-white bg-transparent hover:bg-white/5"
        aria-label="ลด"
      >
        −
      </button>
      <div className="min-w-[48px] text-center text-white font-sarabun font-semibold text-lg">{value}</div>
      <button
        type="button"
        onClick={inc}
        className="px-3 py-1 border border-white rounded-md text-white bg-transparent hover:bg-white/5"
        aria-label="เพิ่ม"
      >
        +
      </button>
    </div>
  );
};

export default NumericalStepper;
