import React from "react";
import { exportEventsAsCSV } from "../../services/dataLogger.js";

const UkDashboard: React.FC = () => {
  const handleExport = () => {
    const csv = exportEventsAsCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ukpack2-events-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center p-6">
      <button
        onClick={handleExport}
        className="bg-[#ffe000] text-[#000d59] px-6 py-4 rounded-full font-prompt font-semibold shadow hover:brightness-95"
      >
        Export CSV
      </button>
    </div>
  );
};

export default UkDashboard;
