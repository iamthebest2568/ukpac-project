import { useNavigate } from "react-router-dom";
import CtaButton from "../components/CtaButton";
import MyFooter from "../../mydreambus/components/MyFooter";

const HERO_SRC =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F02ba14ac31e7499d8feb398adebc6580?format=webp&width=800";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 0,
      }}
    >
      {/* Top: image */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          paddingTop: 12,
        }}
      >
        <img
          src={HERO_SRC}
          alt="image"
          style={{
            display: "block",
            margin: "0 auto",
            width: "100%",
            maxWidth: "min(92vw, 442px)", // reduced ~15% from 520px
            height: "auto",
            maxHeight: "50vh",
            objectFit: "contain",
            boxSizing: "border-box",
            paddingLeft: 16,
            paddingRight: 16,
          }}
        />
      </div>

      {/* Bottom: text + buttons (with decorative background) */}
      <MyFooter>
        <div
          style={{
            width: "100%",
            paddingBottom: "calc(env(safe-area-inset-bottom, 16px) + 24px)",
            paddingTop: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              transform: "translateY(-60px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              width: "100%",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "12px 20px",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              <div>รถเมล์ในฝันที่คุณอยากขึ้นทุกวัน</div>
              <div>จะมีหน้าตาอย่างไร?</div>
            </div>
            <div
              style={{
                width: "100%",
                paddingLeft: 20,
                paddingRight: 20,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CtaButton
                text="เริ่มออกแบบ"
                onClick={() => {
                  navigate("/mydreambus/pdpa");
                }}
                style={{ width: "min(360px, 80%)", marginTop: 0 }}
              />
            </div>
          </div>
        </div>
      </MyFooter>
    </div>
  );
};

export default SplashScreen;
