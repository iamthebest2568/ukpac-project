import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationScreen from '../components/CustomizationScreen';
import ProgressDots from '../components/ProgressDots';
import SelectionCard from '../components/SelectionCard';
import CtaButton from '../components/CtaButton';
import SecondaryButton from '../components/SecondaryButton';
import NumericalStepper from '../components/NumericalStepper';

const SeatingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [totalSeats, setTotalSeats] = useState<number>(40);
  const [specialSeats, setSpecialSeats] = useState<number>(4);
  const [childElderSeats, setChildElderSeats] = useState<number>(2);
  const [standingPlaces, setStandingPlaces] = useState<number>(10);

  const handleNext = () => {
    try {
      const seating = { totalSeats, specialSeats, childElderSeats, standingPlaces };
      sessionStorage.setItem('design.seating', JSON.stringify(seating));
    } catch (e) {}
    navigate('/ukpack2/amenities');
  };

  return (
    <CustomizationScreen
      title="ปรับแต่งรถเมล์ของคุณ"
      footerContent={
        <div className="flex justify-end">
          <CtaButton text="ถัดไป" onClick={handleNext} />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <ProgressDots total={5} currentStep={2} />
        </div>

        <div className="w-full h-48 bg-[#081042] rounded-md flex items-center justify-center text-sm text-gray-300">Top-down seat map preview</div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-white font-sarabun">จำนวนที่นั่งทั้งหมด</div>
            <div className="flex items-center gap-2">
              <NumericalStepper value={totalSeats} onChange={setTotalSeats} min={0} max={200} />
              <SecondaryButton text="พิมพ์" onClick={() => console.log('print', totalSeats)} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-white font-sarabun">จำนวนที่นั่งพิเศษ</div>
            <NumericalStepper value={specialSeats} onChange={setSpecialSeats} min={0} max={50} />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-white font-sarabun">เด็ก / ผู้สูงอายุ</div>
            <NumericalStepper value={childElderSeats} onChange={setChildElderSeats} min={0} max={50} />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-white font-sarabun">จำนวนที่ยืน</div>
            <NumericalStepper value={standingPlaces} onChange={setStandingPlaces} min={0} max={200} />
          </div>
        </div>
      </div>
    </CustomizationScreen>
  );
};

export default SeatingScreen;
