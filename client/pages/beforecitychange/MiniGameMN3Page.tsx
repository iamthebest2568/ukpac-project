/* MiniGame MN3 Page - Budget Allocation */

import { useEffect, useState } from "react";
import Flow_MiniGame_MN3 from "../components/flows/Flow_MiniGame_MN3";
import { useSession } from "../hooks/useSession";

const MiniGameMN3Page = () => {
  const { sessionID } = useSession();
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Preload related assets silently
    import("./Ask04BudgetPage").catch(() => {});
  }, []);

  if (completed) {
    const summary = result?.budget_step3_result?.resultSummary || [];
    const satisfaction = result?.budget_step3_result?.satisfaction || "";
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center bg-white"
        style={{ maxWidth: 1080, margin: "0 auto" }}
      >
        <div className="w-full px-6 py-10 text-center">
          <h1 className="font-prompt text-[28px] md:text-[36px] font-bold text-black mb-2">
            เสร็จสิ้นการจัดสรรงบประมาณ
          </h1>
          <p className="font-prompt text-[16px] md:text-[18px] text-[#333] mb-6">
            ความพึงพอใจ: {satisfaction || "-"}
          </p>

          {summary.length > 0 && (
            <div className="max-w-[800px] mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summary.map((item: any) => (
                  <div key={item.priority} className="p-4 border rounded-lg text-left">
                    <div className="font-prompt text-[16px] md:text-[18px] font-semibold mb-1">
                      {item.icon ? `${item.icon} ` : ""}
                      {item.priority}
                    </div>
                    <div className="text-sm text-[#555]">
                      จัดสรร: {item.allocation} | {Math.round(item.percentage)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                setCompleted(false);
                setResult(null);
              }}
              className="px-6 h-[48px] rounded-[40px] bg-[#EFBA31] border border-black font-prompt text-[16px] font-medium hover:scale-105 transition"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Flow_MiniGame_MN3
      sessionID={sessionID}
      onComplete={(data) => {
        setResult(data);
        setCompleted(true);
      }}
    />
  );
};

export default MiniGameMN3Page;
