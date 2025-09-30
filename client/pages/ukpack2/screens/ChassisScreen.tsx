import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import SelectionCard from "../components/SelectionCard";
import CtaButton from "../components/CtaButton";
import StepTabs from "../components/StepTabs";
import ConfirmModal from "../components/ConfirmModal";
import { clearDesignStorage } from "../utils/clearDesign";
import VehiclePreview from "../components/VehiclePreview";
import MyFooter from "../mydreambus/components/MyFooter";
import styles from "./chassis.module.css";
import { useBusDesign } from "../context/BusDesignContext";
import { HERO_IMAGE, CHASSIS_LABELS } from "../utils/heroImages";

const AMENITIES_ICON_SMALL = {
  แอร์: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee1c18a935564e92bb49991fac3b76df?format=webp&width=800",
  พัดลม:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe01792ee89e240808ed47d8576b55d71?format=webp&width=800",
  ที่นั่งพิเศษ:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F93439b2533284cdf914fc93cafa1cf26?format=webp&width=800",
  "ที่จับ/ราวยืนที่ปลอดภัย":
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb0789bfd1100472f8351704764607d31?format=webp&width=800",
};
const PAYMENT_ICON_SMALL: Record<string, string> = {
  เงินสด:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbc8b22cedfbb4640a702f724881f196d?format=webp&width=800",
  สแกนจ่าย:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb8992da4be824b339d3df5f0a076ed93?format=webp&width=800",
  ตู้อัตโนมัติ:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F56620e798eb94153b2390271f30d0dae?format=webp&width=800",
  แตะบัตร:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdb2e47a586b841d1af014e9196f3c411?format=webp&width=800",
  กระเป๋ารถเมล์:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F41c089c5dd4b448993c4e02c02cdf7ac?format=webp&width=800",
  "ตั๋วรายเดือน/รอบ":
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fca6467eff0c74a77a8e5757f25a24e41?format=webp&width=800",
};
const DOOR_ICON_SMALL: Record<string, string> = {
  "1": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9811f9bca05c43feae9eafdcbab3c8d9?format=webp&width=800",
  "2": "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8f9b21942af243b3b80b0e5ac8b12631?format=webp&width=800",
  ramp: "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fece2b6fc843340f0997f2fd7d3ca0aea?format=webp&width=800",
  emergency:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F98de0624be3d4ae6b96d83edcf8891f9?format=webp&width=800",
};

const IconSmall = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F420a5ff990cd41c6a7a452493475fae2?format=webp&width=800"
    alt=""
    aria-hidden="true"
    className="h-full w-auto object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconSmallAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F3b9901c651b5482cac2b4383e52a8c0b?format=webp&width=800"
    alt=""
    aria-hidden="true"
    className="h-full w-auto object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconMedium = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F89f62ca539ba485eb5059b6596bc6b01?format=webp&width=800"
    alt=""
    aria-hidden="true"
    className="h-full w-auto object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconMediumAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5dad81672ed34962a53794192bcb896b?format=webp&width=800"
    alt=""
    aria-hidden="true"
    className="h-full w-auto object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconLarge = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe47a852ed9744f70941c98e44c3630b4?format=webp&width=800"
    alt=""
    aria-hidden="true"
    className="h-full w-auto object-contain select-none -translate-y-0.5"
    decoding="async"
    loading="eager"
  />
);
const IconLargeAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff8fa561ea6644c12906ead333f782ef6?format=webp&width=800"
    alt=""
    aria-hidden="true"
    className="h-full w-auto object-contain select-none -translate-y-0.5"
    decoding="async"
    loading="eager"
  />
);
const IconExtra = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F21e52ce7cc0346a597412cd2bb6d5568?format=webp&width=800"
    alt=""
    aria-hidden="true"
    className="h-full w-auto object-contain select-none -translate-y-0.5"
    decoding="async"
    loading="eager"
  />
);
const IconExtraAlt = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fd57a13dc07be4731a71396e6301fc7b5?format=webp&width=800"
    alt=""
    aria-hidden="true"
    className="h-full w-auto object-contain select-none -translate-y-0.5"
    decoding="async"
    loading="eager"
  />
);

const OPTIONS = [
  {
    key: "small",
    label: "รถเมล์ขนาดเล็ก 16-30 ที่นั่ง",
    labelText: "รถเมล์ขนาดเล็ก 16-30 ที่นั่ง",
    icon: <IconSmall />,
  },
  {
    key: "medium",
    label: "รถเมล์มาตรฐาน 30-50 ท่นั่ง",
    labelText: "รถเมล์มาตรฐาน 30-50 ที่นั่ง",
    icon: <IconMedium />,
  },
  {
    key: "large",
    label: (
      <>
        <span>รถตู้โดยสาร</span>
        <br />
        9-15 ที่นั่ง
      </>
    ),
    labelText: "รถตู้โดยสาร 9-15 ที่นั่ง",
    icon: <IconLarge />,
  },
  {
    key: "extra",
    label: "รถกะบะดัดแปลง 8–12 ที่นั่ง",
    labelText: "รถกะบะดัดแปลง 8–12 ที่นั่ง",
    icon: <IconExtra />,
  },
];

const HERO_SHADOW =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb1e30b1544304677996b179fc27ae5c7?format=webp&width=800";
const HERO_STAR =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F026572d6e36d487bbb4798f7dd20d4a3?format=webp&width=256";

const ChassisScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useBusDesign();

  const [selected, setSelected] = useState<string>(() => {
    try {
      // prefer context value, fallback to sessionStorage, then default
      if (typeof window !== "undefined") {
        const saved = sessionStorage.getItem("design.chassis");
        return (saved || OPTIONS[0].key) as string;
      }
    } catch (e) {
      // ignore
    }
    return OPTIONS[0].key;
  });

  // icon variant shown is derived directly from `selected` to avoid stale click flags
  // (show the Alt variant when the option is the current selected chassis)
  const selectedLabel = useMemo(() => {
    const found = OPTIONS.find((o) => o.key === selected)?.labelText || "";
    return String(found).replace(/(\d+)-(\d+)/, "$1–$2");
  }, [selected]);
  const [isExitModalOpen, setExitModalOpen] = useState(false);

  // Clear any previous unfinished selections when (re)entering the flow
  useEffect(() => {
    clearDesignStorage();
  }, []);

  // Persist chassis selection whenever it changes so other screens reflect it immediately
  React.useEffect(() => {
    try {
      sessionStorage.setItem("design.chassis", selected);
    } catch (e) {
      // ignore
    }

    try {
      dispatch({ type: "SET_CHASSIS", payload: selected });
    } catch (e) {
      // ignore
    }
  }, [selected, dispatch]);

  // If context chassis changes externally, update local selected
  React.useEffect(() => {
    try {
      if (state?.chassis && state.chassis !== selected) {
        setSelected(state.chassis);
      }
    } catch (e) {
      // ignore
    }
  }, [state?.chassis]);

  const handleNext = () => {
    // navigation will use the already persisted "design.chassis"
    navigate("/mydreambus/seating");
  };

  const confirmExit = () => {
    setExitModalOpen(false);
    navigate("/");
  };

  const overlayLabels = (() => {
    const amenities = (() => {
      try {
        const raw = sessionStorage.getItem("design.amenities");
        return raw ? (JSON.parse(raw) as string[]) : [];
      } catch {
        return [] as string[];
      }
    })();
    const payments = (() => {
      try {
        const raw = sessionStorage.getItem("design.payment");
        return raw ? (JSON.parse(raw) as string[]) : [];
      } catch {
        return [] as string[];
      }
    })();
    const doors = (() => {
      try {
        const raw = sessionStorage.getItem("design.doors");
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return typeof parsed === "string"
          ? parsed
          : parsed?.doorChoice ||
              (parsed?.hasRamp ? "ramp" : parsed?.highLow ? "emergency" : null);
      } catch {
        return sessionStorage.getItem("design.doors");
      }
    })();

    return [
      ...(amenities || []),
      ...(payments || []),
      ...(doors ? [doors as string] : []),
    ];
  })();

  return (
    <>
      <CustomizationScreen
        headerContent={
          <div style={{ width: "100%", textAlign: "center" }}>
            <div
              style={{ fontSize: 22, fontWeight: 700 }}
              className="font-prompt"
            >
              ออกแบบรถเมล์ของคุณ
            </div>
            <div
              style={{ fontSize: 20, fontWeight: 700 }}
              className="font-prompt"
            >
              เลือกประเภทรถ
            </div>
          </div>
        }
        theme="light"
        fullWidth
        footerContent={
          <Uk2Footer>
            <div className="w-full flex justify-center">
              <CtaButton text="ถัดไป" onClick={handleNext} />
            </div>
          </Uk2Footer>
        }
      >
        <div className={styles.contentGrid}>
          {/* Left: preview area (full width) */}
          <div className={`${styles.previewWrapper}`}>
            <div className={styles.previewInner}>
              <div style={{ position: "relative" }}>
                <VehiclePreview
                  className="vehicle-preview"
                  imageSrc={HERO_IMAGE[selected]}
                  label={selectedLabel}
                  overlayLabels={overlayLabels}
                  overlayIconMap={{
                    ...AMENITIES_ICON_SMALL,
                    ...PAYMENT_ICON_SMALL,
                    ...DOOR_ICON_SMALL,
                  }}
                  showSelectedText={true}
                  starSrc={HERO_STAR}
                />
              </div>
            </div>
          </div>

          {/* Right: tabs + selection cards (full width) */}
          <section
            className={`${styles.controlsSection} ${styles.controlsWrapper}`}
          >
            <div className={styles.tabsWrapper}>
              <StepTabs active={1} />
            </div>
            <div className={styles.controlsBox}>
              <div className={styles.controlsContent}>
                <div className={`${styles.selectionGrid} doorControls`}>
                  <div className={styles.selectionRow}>
                    <SelectionCard
                      key={OPTIONS[0].key}
                      icon={
                        selected === OPTIONS[0].key ? (
                          <IconSmallAlt />
                        ) : (
                          <IconSmall />
                        )
                      }
                      label={OPTIONS[0].label}
                      isSelected={selected === OPTIONS[0].key}
                      onClick={() => {
                        setSelected(OPTIONS[0].key);
                      }}
                      variant="light"
                      appearance="group"
                      hideLabel={true}
                      size="sm"
                      layout="horizontal"
                      fill
                    />

                    <SelectionCard
                      key={OPTIONS[1].key}
                      icon={
                        selected === OPTIONS[1].key ? (
                          <IconMediumAlt />
                        ) : (
                          <IconMedium />
                        )
                      }
                      label={OPTIONS[1].label}
                      isSelected={selected === OPTIONS[1].key}
                      onClick={() => {
                        setSelected(OPTIONS[1].key);
                      }}
                      variant="light"
                      appearance="group"
                      hideLabel={true}
                      size="lg"
                      layout="horizontal"
                      fill
                    />
                  </div>

                  <div className={styles.selectionRow}>
                    <SelectionCard
                      key={OPTIONS[2].key}
                      icon={
                        selected === OPTIONS[2].key ? (
                          <IconLargeAlt />
                        ) : (
                          <IconLarge />
                        )
                      }
                      label={OPTIONS[2].label}
                      isSelected={selected === OPTIONS[2].key}
                      onClick={() => {
                        setSelected(OPTIONS[2].key);
                      }}
                      variant="light"
                      appearance="group"
                      hideLabel={true}
                      size="sm"
                      layout="horizontal"
                      fill
                    />

                    <SelectionCard
                      key={OPTIONS[3].key}
                      icon={
                        selected === OPTIONS[3].key ? (
                          <IconExtraAlt />
                        ) : (
                          <IconExtra />
                        )
                      }
                      label={OPTIONS[3].label}
                      isSelected={selected === OPTIONS[3].key}
                      onClick={() => {
                        setSelected(OPTIONS[3].key);
                      }}
                      variant="light"
                      appearance="group"
                      hideLabel={true}
                      size="sm"
                      layout="horizontal"
                      fill
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </CustomizationScreen>

      <ConfirmModal
        isOpen={isExitModalOpen}
        title="ออกจากหน้าจอ"
        message="คุณแน่ใจหรือไม่ว่า้องการออก? กาเปล���่ยนแปลงของคุณจะไม่ถูกบันทึก"
        onConfirm={confirmExit}
        onCancel={() => setExitModalOpen(false)}
        contentClassName={`${styles.containerPadding} ${styles.modalContent}`}
      />
    </>
  );
};

export default ChassisScreen;
