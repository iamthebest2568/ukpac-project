import React from 'react';

interface SummaryCardProps {
  designData: Record<string, any>;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ designData }) => {
  const entries = Object.entries(designData || {});

  const CHASSIS_LABELS: Record<string, string> = {
    small: 'รถเมล์ขนาดเล็ก 16–30 ที่นั่ง',
    medium: 'รถเมล์ขนาดกลาง 31–40 ที่นั่ง',
    large: 'รถเมล์ขนาดใหญ่ 41-50 ที่นั่ง',
    extra: 'รถเมล์รุ่นพิเศษ 51+ ที่นั่ง',
  };

  const formatValue = (key: string, value: any) => {
    if (key === 'chassis') return CHASSIS_LABELS[String(value)] || String(value);
    if (key === 'seating') {
      if (!value) return '-';
      if (typeof value === 'object') return String(value.totalSeats ?? JSON.stringify(value));
      return String(value);
    }
    if (key === 'amenities' || key === 'payment') {
      if (Array.isArray(value)) return value.join(', ');
      return String(value || '-');
    }
    if (key === 'doors') {
      if (!value) return '-';
      if (typeof value === 'string') {
        if (value === '1') return '1 ประตู';
        if (value === '2') return '2 ประตู';
        if (value === 'ramp') return 'ทางลาดสำหรับรถเข็น/ผู้พิการ';
        if (value === 'emergency') return 'ประตูฉุกเฉิน';
        return value;
      }
      if (typeof value === 'object') return value.doorChoice ? (value.doorChoice === '1' ? '1 ประตู' : value.doorChoice === '2' ? '2 ประตู' : String(value.doorChoice)) : JSON.stringify(value);
    }
    if (key === 'color') {
      // show a small swatch and truncate URL
      const url = String(value || '');
      return (
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md" style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover' }} />
          <span className="truncate max-w-[200px]">{url}</span>
        </div>
      );
    }
    return typeof value === 'object' ? JSON.stringify(value) : String(value ?? '-');
  };

  return (
    <div className="bg-white rounded-lg p-4 text-sm text-gray-800">
      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        {entries.map(([k, v]) => (
          <React.Fragment key={k}>
            <div className="font-sarabun text-xs text-gray-500 break-words capitalize">{k}</div>
            <div className="font-sarabun text-sm font-semibold break-words">{formatValue(k, v)}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;
