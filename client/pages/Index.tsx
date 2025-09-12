import React from "react";
import { useSession } from "../hooks/useSession";
import { Link } from "react-router-dom";

const IndexPage = () => {
  const { navigateToPage } = useSession();

  // Keep original navigation helper available but do not auto-navigate here.
  // The user will add links to cards later.

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12">
      <div className="w-full max-w-[1000px] px-4">
        <header className="mb-8 text-center">
          <h1 className="font-prompt font-bold text-[#000D59]" style={{ fontSize: "clamp(24px, 4.5vw, 40px)" }}>
            เลือกหมวดหมู่
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">(คลิกการ์ดเพื่อตั้งค่า ลิงก์และเนื้อหาภายหลัง)</p>
        </header>

        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                role="button"
                tabIndex={0}
                data-card-id={`card-${i}`}
                aria-label={`Card ${i} (แก้ไขเนื้อหาและลิงก์ภายหลัง)`}
                className="group cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md focus:shadow-md transition p-6 flex flex-col items-start gap-4"
                onClick={() => {
                  // Intentionally no navigation. User will add links later.
                  // Keep this handler so the element is interactive but does not change app flow.
                  // eslint-disable-next-line no-console
                  console.log(`card-${i} clicked`);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    // eslint-disable-next-line no-console
                    console.log(`card-${i} activated`);
                  }
                }}
              >
                {i === 1 && (
                  <a href="/ask02" className="absolute inset-0 z-10" aria-label="Open Mini game 1" />
                )}
                <div className="flex items-center justify-center w-full">
                  <div className="w-full h-40 md:h-48 bg-gray-50 rounded-md flex items-center justify-center text-gray-300">
                    <span className="text-lg">Preview Area</span>
                  </div>
                </div>

                <div className="w-full">
                  <h2 className="font-prompt font-semibold text-[#000D59] text-xl">Card {i}</h2>
                  <p className="mt-2 text-sm text-gray-600">คำอธ��บายสั้น ๆ ของการ์ดนี้ — แก้ไขเนื้อหาและลิงก์ภายหลัง</p>
                </div>

                <div className="mt-auto w-full flex justify-end">
                  <span className="text-xs text-gray-400">data-card-id: card-{i}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default IndexPage;
