import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../../ukpack2/components/CustomizationScreen";
import SelectionCard from "../../ukpack2/components/SelectionCard";
import CtaButton from "../../ukpack2/components/CtaButton";
import StepTabs from "../../ukpack2/components/StepTabs";
import ConfirmModal from "../components/ConfirmModal";
import { clearDesignStorage } from "../../ukpack2/utils/clearDesign";
import VehiclePreview from "../components/VehiclePreview";
import styles from "./chassis.module.css";

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
  "สแกนจ่าย 2":
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
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F91c62d1140ba42828ef9648da47a49ad?format=webp&width=800"
    alt=""
    aria-hidden="true"
    className="max-h-12 sm:max-h-16 w-auto object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconMedium = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F81895dfac78f4bd88c3c0235d48fff80?format=webp&width=800"
    alt=""
    aria-hidden="true"
    className="max-h-12 sm:max-h-16 w-auto object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconLarge = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F77fae6aebf004c59a359e095f0bc823b?format=webp&width=800"
    alt=""
    aria-hidden="true"
    className="h-full w-auto object-contain select-none -translate-y-0.5"
    decoding="async"
    loading="eager"
  />
);
const IconExtra = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F70e4ddd14fbf493682a6e61008ae4621?format=webp&width=800"
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
    labelText: "รถเมล์ขนาดเล็ก 16-30 ท��่นั่ง",
    icon: <IconSmall />,
  },
  {
    key: "medium",
    label: "รถเมล์ม���ตรฐาน 30-50 ที่นั่ง",
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

const HERO_IMAGE: Record<string, string> = {
  small:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9fadd57b4ec048189e5ae416e5f2a4f4",
  medium:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbcd1013232914b39b73ebd2bd35d7bbd",
  large:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F297c5816ab8c4adeb3cc73b6f66ab9e0",
  extra:
    "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F8b4be3122d774f95b4c5e5bde1cd7c49",
};
const HERO_SHADOW =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb1e30b1544304677996b179fc27ae5c7?format=webp&width=800";
const HERO_STAR =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F026572d6e36d487bbb4798f7dd20d4a3?format=webp&width=256";

const ChassisScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>(OPTIONS[0].key);
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
  }, [selected]);

  const handleNext = () => {
    // navigation will use the already persisted "design.chassis"
    navigate("/ukpack2/seating");
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
        title="ปรับแต่งรถเมล์ของคุณ"
        theme="light"
        fullWidth
        containerPaddingClass={styles.containerPadding}
        footerContent={
          <div className="flex justify-center">
            <CtaButton text="ถัดไป" onClick={handleNext} />
          </div>
        }
      >
        <div className={`${styles.contentGrid} ${styles.containerPadding}`}>
          {/* Left: preview area (full width) */}
          <div className={`${styles.previewWrapper}`}>
            <div className={styles.previewInner}>
              <div style={{ position: 'relative' }}>
                <VehiclePreview
                  imageSrc={HERO_IMAGE[selected]}
                  label={selectedLabel}
                  overlayLabels={overlayLabels}
                  overlayIconMap={{ ...AMENITIES_ICON_SMALL, ...PAYMENT_ICON_SMALL, ...DOOR_ICON_SMALL }}
                  colorHex={null}
                  className={styles.containerPadding}
                />

                <img
                  src={HERO_STAR}
                  alt="สัญลักษณ์ดาว"
                  className={styles.starBadge}
                  decoding="async"
                  loading="eager"
                  aria-hidden="true"
                />
              </div>
            </div>

            <p className={styles.selectedLabel}>
              <span className="chassis-label-mobile">รถที่เลือก : </span>
              {selectedLabel}
            </p>
          </div>

          {/* Right: tabs + selection cards (full width) */}
          <div className={styles.controlsWrapper}>
            <div className={styles.tabsWrapper}>
              <StepTabs active={1} />
            </div>

            <div style={{ marginTop: 12 }}>
              <div className={styles.selectionGrid}>
                <SelectionCard
                  key={OPTIONS[0].key}
                  icon={OPTIONS[0].icon}
                  label={OPTIONS[0].label}
                  isSelected={selected === OPTIONS[0].key}
                  onClick={() => setSelected(OPTIONS[0].key)}
                  variant="light"
                  appearance="bare"
                  hideLabel={true}
                  size="sm"
                />

                <SelectionCard
                  key={OPTIONS[1].key}
                  icon={OPTIONS[1].icon}
                  label={OPTIONS[1].label}
                  isSelected={selected === OPTIONS[1].key}
                  onClick={() => setSelected(OPTIONS[1].key)}
                  variant="light"
                  appearance="bare"
                  hideLabel={true}
                  size="lg"
                />

                <SelectionCard
                  key={OPTIONS[2].key}
                  icon={OPTIONS[2].icon}
                  label={OPTIONS[2].label}
                  isSelected={selected === OPTIONS[2].key}
                  onClick={() => setSelected(OPTIONS[2].key)}
                  variant="light"
                  appearance="bare"
                  hideLabel={true}
                  size="sm"
                />

                <SelectionCard
                  key={OPTIONS[3].key}
                  icon={OPTIONS[3].icon}
                  label={OPTIONS[3].label}
                  isSelected={selected === OPTIONS[3].key}
                  onClick={() => setSelected(OPTIONS[3].key)}
                  variant="light"
                  appearance="bare"
                  hideLabel={true}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </CustomizationScreen>

      <ConfirmModal
        isOpen={isExitModalOpen}
        title="ออกจากหน้าจอ"
        message="คุณแน่ใจหรือไม่ว่าต้องการออก? การเปลี่ยนแปลงของคุณจะไม่ถูกบันทึก"
        onConfirm={confirmExit}
        onCancel={() => setExitModalOpen(false)}
        contentClassName={`${styles.containerPadding} ${styles.modalContent}`}
      />
    </>
  );
};

export default ChassisScreen;
