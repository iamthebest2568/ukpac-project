import { Link } from "react-router-dom";
import MetaUpdater from "../components/MetaUpdater";
import { useSession } from "../hooks/useSession";

const IndexPage = () => {
  const { navigateToPage } = useSession();

  // Keep original navigation helper available but do not auto-navigate here.
  // The user will add links to cards later.

  return (
    <>
      <MetaUpdater
        title="UK PACT - กรุงเทพฯ ลดติด"
        description="UK PACT — เชิญชวนคนกรุงเทพฯ มาร่วมออกแบบเมือง ลดปัญหาจราจรและมลพิษ ด้วยนโยบายและตัวเลือกที่ใช้งานได้จริง"
        image="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fa9dea989b2c347318a49bb8e9f717a35?format=webp&width=1200"
      />
      <div className="min-h-screen bg-white flex items-center justify-center py-12">
        <div className="w-full max-w-[1000px] px-4">
          <header className="mb-8 text-center">
            <h1
              className="font-prompt font-bold text-[#000D59]"
              style={{ fontSize: "clamp(24px, 4.5vw, 40px)" }}
            >
              เลือกหมวดหมู่
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              (คลิกการ์ดเพื่อตั้งค่า ลิงก์และเนื้อหาภายหลัง)
            </p>
          </header>

          <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {([1, 2, 3, 4] as number[]).map((i) => {
                const card = (
                  <div
                    role="button"
                    tabIndex={0}
                    data-card-id={`card-${i}`}
                    aria-label={`Card ${i} (แก้ไขเนื้อหาและลิงก์ภายหลัง)`}
                    className="group cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md focus:shadow-md transition p-6 flex flex-col items-start gap-4"
                    onClick={() => {
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
                    <div className="flex items-center justify-center w-full">
                      <div className="w-full h-40 md:h-48 bg-gray-50 rounded-md flex items-center justify-center text-gray-300">
                        <span className="text-lg">Preview Area</span>
                      </div>
                    </div>

                    <div className="w-full">
                      <h2 className="font-prompt font-semibold text-[#000D59] text-xl">
                        Card {i}
                      </h2>
                      <p className="mt-2 text-sm text-gray-600">
                        {i === 1
                          ? "Link to beforecitychange"
                          : i === 2
                          ? "Link to Game Bus"
                          : "คำอธิบายสั้น ๆ ของการ์ดนี้ — แก้ไขเนื้อหาและลิงก์ภายหลัง"}
                      </p>
                    </div>

                    <div className="mt-auto w-full flex justify-end">
                      <span className="text-xs text-gray-400">data-card-id: card-{i}</span>
                    </div>
                  </div>
                );

                // Wrap the first and second card in a router Link so they navigate client-side
                if (i === 1) {
                  return (
                    <Link key={i} to="/beforecitychange" aria-label="Open beforecitychange">
                      {card}
                    </Link>
                  );
                }

                if (i === 2) {
                  return (
                    <Link key={i} to="/ukpack2" aria-label="Open Game Bus">
                      {card}
                    </Link>
                  );
                }

                return <div key={i}>{card}</div>;
              })}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
