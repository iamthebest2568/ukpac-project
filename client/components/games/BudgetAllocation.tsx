import { useState, useEffect } from "react";

interface BudgetAllocationProps {
  sessionID: string | null;
  onNavigate: (gameId: string) => void;
}

const BudgetAllocation = ({ sessionID, onNavigate }: BudgetAllocationProps) => {
  const [budgetAllocation, setBudgetAllocation] = useState({
    trainDiscount: 0,
    busQuality: 0,
    parking: 0
  });

  const totalBudget = 100;
  const allocatedBudget = budgetAllocation.trainDiscount + budgetAllocation.busQuality + budgetAllocation.parking;
  const remainingBudget = totalBudget - allocatedBudget;

  const budgetItems = [
    { key: 'trainDiscount', label: 'ลดค่าโดยสารรถไฟฟ้า' },
    { key: 'busQuality', label: 'ปรับปรุงคุณภาพรถเมล์' },
    { key: 'parking', label: 'ที่จอดรถ' }
  ];

  const handleBudgetChange = (key: keyof typeof budgetAllocation, value: string) => {
    const numValue = parseInt(value) || 0;
    const currentTotal = Object.entries(budgetAllocation)
      .filter(([k]) => k !== key)
      .reduce((sum, [, v]) => sum + v, 0);
    
    // Ensure the new value doesn't exceed remaining budget
    const maxAllowable = totalBudget - currentTotal;
    const finalValue = Math.min(numValue, maxAllowable);

    setBudgetAllocation(prev => ({
      ...prev,
      [key]: finalValue
    }));
  };

  const handleNext = () => {
    console.log({
      sessionID: sessionID,
      game: 'budget',
      data: budgetAllocation
    });
    onNavigate('thankYou');
  };

  const isComplete = allocatedBudget === totalBudget;

  return (
    <div className="dark">
      <div className="game-container py-8">
        <h2 className="question-text">
          คุณจะให้งบประมาณแต่ละข้อเท่าไร
        </h2>
        
        <div className="bg-game-navy bg-opacity-50 p-4 rounded-lg mb-6 border border-gray-600">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">งบทั้งหมด:</span>
            <span className="text-game-yellow font-bold">{totalBudget}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">งบที่เหลือ:</span>
            <span className={`font-bold ${remainingBudget < 0 ? 'text-red-400' : 'text-green-400'}`}>
              {remainingBudget}
            </span>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {budgetItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border border-gray-600">
              <label className="text-white font-medium flex-1">
                {item.label}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max={totalBudget}
                  value={budgetAllocation[item.key as keyof typeof budgetAllocation]}
                  onChange={(e) => handleBudgetChange(item.key as keyof typeof budgetAllocation, e.target.value)}
                  className="budget-input"
                  placeholder="0"
                />
                <span className="text-gray-400">บาท</span>
              </div>
            </div>
          ))}
        </div>

        {remainingBudget < 0 && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg text-red-200 text-sm text-center">
            งบประมาณเกินที่กำหนด กรุณาปรับลดจำนวน
          </div>
        )}

        {remainingBudget > 0 && (
          <div className="mb-4 p-3 bg-yellow-900 bg-opacity-50 border border-yellow-500 rounded-lg text-yellow-200 text-sm text-center">
            คุณยังมีงบประมาณเหลือ {remainingBudget} บาท
          </div>
        )}

        <button 
          className="btn-primary"
          onClick={handleNext}
          disabled={!isComplete}
        >
          ต่อไป
        </button>

        {!isComplete && (
          <p className="text-center text-sm text-gray-400 mt-2">
            กรุณาจัดสรรงบประมาณให้ครบ {totalBudget} บาท
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetAllocation;
