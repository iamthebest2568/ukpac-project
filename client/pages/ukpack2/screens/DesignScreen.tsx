import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizationScreen from "../components/CustomizationScreen";
import ColorPalette from "../components/ColorPalette";
import {
  addDesignImageUrlToFirestore,
  saveMinigameResult,
} from "../../../lib/firebase";
import MetaUpdater from "../../../components/MetaUpdater";
import { OVERLAY_ICON_SRC } from "../utils/overlayIcons";
import CtaButton from "../components/CtaButton";
import MyFooter from "../mydreambus/components/MyFooter";
import { HERO_IMAGE, CHASSIS_LABELS } from "../utils/heroImages";
import { generateMaskFromColor } from "../utils/generateMaskFromColor";
import VehiclePreview from "../components/VehiclePreview";

// small amenity icons (same assets as other screens)
const IconAir = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fee1c18a935564e92bb49991fac3b76df?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconFan = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe01792ee89e240808ed47d8576b55d71?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconSeat = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F93439b2533284cdf914fc93cafa1cf26?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconWifi = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb0789bfd1100472f8351704764607d31?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconPlug = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F09a78e31a3de44e98772b0eef382af6f?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconTv = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcb0cbf9ef6764e2d9e6f06e87827f5e9?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconCup = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fe903bdf27bab4175824c159bc19a02ba?format=webp&width=800"
    alt="image"
    className="h-6 w-6 object-contain select-none"
    decoding="async"
    loading="eager"
  />
);
const IconCamSmall = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="7"
      width="14"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M19 8l2-2v10l2-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AMENITIES_ICON_MAP: Record<string, JSX.Element> = {
  แอร์: <IconAir />,
  พัดลม: <IconFan />,
  ที่นั่งพิเศษ: <IconSeat />,
  "ที่จับ/ราวยืนที่ปลอดภัย": <IconWifi />,
  "ช่องชาร์จมือถือ/USB": <IconPlug />,
  "Wi‑Fi ฟรี": <IconTv />,
  "ระบบประกาศบอกป้าย(เสียง/จอ)": <IconCup />,
  กล้องวงจรปิด: <IconCamSmall />,
};

const MONEY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F9349b93d24274adc91be5f4657facdda?format=webp&width=800";
const SCAN_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fbc97b87e6027435fb25a72f5478406cd?format=webp&width=800";
const SCAN2_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F56620e798eb94153b2390271f30d0dae?format=webp&width=800";
const TOUCH_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F4e22405c00c84fbfb1cd43fea6d8f8b4?format=webp&width=800";
const MONTHLY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Ff841cf7477174217b2aa753d7acb4b21?format=webp&width=800";
const BUS_EMPLOY_ICON =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F47fc617541cf45f28b7aa2d1b8deaf64?format=webp&width=800";

// New van template used only on Design page for 'large' chassis
const VAN_TEMPLATE_NEW =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F6e3fda4ab8a540c083f6ca22ff8d5a60?format=webp&width=800";
// New standard bus template used only on Design page for 'medium' chassis
const STANDARD_TEMPLATE_NEW =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F0191441489bd48f4b3fe378328c36744?format=webp&width=800";
// New mini-bus template used only on Design page for 'small' chassis
const MINIBUS_TEMPLATE_NEW =
  "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcc8259bc3e1145879149fb51f3517521?format=webp&width=800";

const DEFAULT_COLORS = [
  {
    id: "353635-new",
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F6cd69d1c234d4a76a0ed41ea01305797?format=webp&width=800",
    filter: "hue-rotate(0deg) saturate(0) brightness(0.25)",
    colorHex: "#353635",
  },
  {
    id: "7d53a2",
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F00940e952f104c52930267d96b4b2af5?format=webp&width=800",
    filter: "hue-rotate(300deg) saturate(1.2) brightness(0.9)",
    colorHex: "#7d53a2",
  },
  {
    id: "fee000",
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fb8bed674c69e4fbf8938b06844b190c9?format=webp&width=800",
    filter: "hue-rotate(60deg) saturate(1.4) brightness(1.1)",
    colorHex: "#fee000",
  },
  {
    id: "bbbdbf",
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F803a56e88e08447c9ab15d0467c55ea3?format=webp&width=800",
    filter: "hue-rotate(0deg) saturate(0) brightness(0.8)",
    colorHex: "#bbbdbf",
  },
  {
    id: "4453a4",
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F999ac23ceef54cff9055c12ac4974dee?format=webp&width=800",
    filter: "hue-rotate(220deg) saturate(1.3) brightness(0.95)",
    colorHex: "#4453a4",
  },
  {
    id: "f68c1f",
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fdc1c5b39791f47e3bb6627c58b1d204d?format=webp&width=800",
    filter: "hue-rotate(30deg) saturate(1.3) brightness(1)",
    colorHex: "#f68c1f",
  },
  {
    id: "ffffff",
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fba23b0e3eb784768b38ddd27be4dab85?format=webp&width=800",
    filter: "hue-rotate(0deg) saturate(0) brightness(1.4)",
    colorHex: "#ffffff",
  },
  {
    id: "208541",
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F5bbf8091266941a7aa6661f5847195aa?format=webp&width=800",
    filter: "hue-rotate(120deg) saturate(1.3) brightness(0.95)",
    colorHex: "#208541",
  },
  {
    id: "eb2127",
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F525c7ba870e843b382836543ad6603fb?format=webp&width=800",
    filter: "hue-rotate(0deg) saturate(1.6) brightness(0.95)",
    colorHex: "#eb2127",
  },
  {
    id: "603a17",
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fd6e630c909ac4834a996652aee7ea713?format=webp&width=800",
    filter: "hue-rotate(20deg) saturate(0.8) brightness(0.7)",
    colorHex: "#603a17",
  },
  {
    id: "6cc283",
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F3c92ed63c4ed420eb5fc8b6ac7233112?format=webp&width=800",
    filter: "hue-rotate(140deg) saturate(1.2) brightness(1)",
    colorHex: "#6cc283",
  },
  {
    id: "ef416b",
    preview:
      "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F581cd64e0d274cff87af2fcd0b172222?format=webp&width=800",
    filter: "hue-rotate(340deg) saturate(1.3) brightness(1)",
    colorHex: "#ef416b",
  },
];

const DesignScreen: React.FC = () => {
  const navigate = useNavigate();
  // color selection state: selected color preview and hex (persisted to sessionStorage)
  const [selectedColorHex, setSelectedColorHex] = useState<string | null>(
    () => {
      try {
        const raw = sessionStorage.getItem("design.color");
        if (raw) {
          const parsed = JSON.parse(raw);
          return parsed?.colorHex ?? null;
        }
      } catch (e) {}
      return null;
    },
  );
  const [selectedColorPreview, setSelectedColorPreview] = useState<
    string | null
  >(() => {
    try {
      const raw = sessionStorage.getItem("design.color");
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed?.preview ?? null;
      }
    } catch (e) {}
    return null;
  });
  const [slogan, setSlogan] = useState<string>("");
  const [showTextarea, setShowTextarea] = useState<boolean>(false);
  const [sloganDraft, setSloganDraft] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isSaveHover, setIsSaveHover] = useState(false);
  const [extraMaskUrl, setExtraMaskUrl] = useState<string | null>(null);
  const [largeMaskUrl, setLargeMaskUrl] = useState<string | null>(null);
  const [mediumMaskUrl, setMediumMaskUrl] = useState<string | null>(null);
  const [smallMaskUrl, setSmallMaskUrl] = useState<string | null>(null);

  useEffect(() => {
    if (showTextarea) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [showTextarea]);

  // Generate dynamic mask for pickup (extra) from provided template by detecting #fd8b00 areas
  useEffect(() => {
    try {
      const key = "design.dynamicMask.extra";
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setExtraMaskUrl(cached);
      } else {
        const templateUrl =
          "https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2Fcff745fa9fbf4b468dbef9bc16106083?format=webp&width=800";
        generateMaskFromColor(templateUrl, "#fd8b00", 60).then((url) => {
          if (url) {
            setExtraMaskUrl(url);
            try {
              sessionStorage.setItem(key, url);
            } catch (_) {}
          }
        });
      }
    } catch (_) {}
  }, []);

  // Generate dynamic mask for van (large) from provided template by detecting #fd8b00 areas
  useEffect(() => {
    try {
      const key = "design.dynamicMask.large.v2";
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setLargeMaskUrl(cached);
      } else {
        const templateUrl = VAN_TEMPLATE_NEW;
        generateMaskFromColor(templateUrl, "#fd8b00", 100).then((url) => {
          if (url) {
            setLargeMaskUrl(url);
            try {
              sessionStorage.setItem(key, url);
            } catch (_) {}
          }
        });
      }
    } catch (_) {}
  }, []);

  // Generate dynamic mask for standard (medium) by detecting #fd8b00 areas
  useEffect(() => {
    try {
      const key = "design.dynamicMask.medium.v3";
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setMediumMaskUrl(cached);
      } else {
        const templateUrl = STANDARD_TEMPLATE_NEW;
        generateMaskFromColor(templateUrl, "#fd8b00", 100).then((url) => {
          if (url) {
            setMediumMaskUrl(url);
            try {
              sessionStorage.setItem(key, url);
            } catch (_) {}
          }
        });
      }
    } catch (_) {}
  }, []);

  // Generate dynamic mask for small by detecting #fd8b00 areas
  useEffect(() => {
    try {
      const key = "design.dynamicMask.small.v2";
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setSmallMaskUrl(cached);
      } else {
        const templateUrl = MINIBUS_TEMPLATE_NEW;
        generateMaskFromColor(templateUrl, "#fd8b00", 100).then((url) => {
          if (url) {
            setSmallMaskUrl(url);
            try {
              sessionStorage.setItem(key, url);
            } catch (_) {}
          }
        });
      }
    } catch (_) {}
  }, []);

  // Write imageUrl to Firestore (once per chassis per session) and show confirmation
  const [savedInfo, setSavedInfo] = useState<{
    id: string;
    url: string;
    col?: string;
  } | null>(null);
  useEffect(() => {
    try {
      let selected = "medium";
      try {
        const saved = sessionStorage.getItem("design.chassis");
        if (saved) selected = saved;
      } catch (_) {}
      const url =
        selected === "large"
          ? VAN_TEMPLATE_NEW
          : selected === "medium"
            ? STANDARD_TEMPLATE_NEW
            : selected === "small"
              ? MINIBUS_TEMPLATE_NEW
              : HERO_IMAGE[selected];
      if (!url) return;
      const key = `mydreambus_design_image_sent_${selected}`;
      // If we've previously saved info, show it immediately but still attempt to send again
      try {
        const existing = sessionStorage.getItem(key);
        if (existing) {
          try {
            const parsed = JSON.parse(existing);
            if (parsed && parsed.url) {
              setSavedInfo({
                id: parsed.id || "",
                url: parsed.url,
                col: parsed.col,
              });
            }
          } catch (_) {}
        }
      } catch (_) {}

      // Always attempt to write the design image URL to Firestore (allow repeated sends)
      addDesignImageUrlToFirestore(url)
        .then((res) => {
          setSavedInfo({ id: res.id, url, col: (res as any).collection });
          try {
            sessionStorage.setItem(
              key,
              JSON.stringify({ id: res.id, url, col: (res as any).collection }),
            );
          } catch (_) {}
        })
        .catch((err) =>
          console.warn("addDesignImageUrlToFirestore error", err),
        );
    } catch (_) {}
    // run on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isUploadingResult, setIsUploadingResult] = useState(false);

  // Helper: render final composed image to PNG blob
  const renderFinalImageBlob = async (): Promise<Blob | null> => {
    try {
      // determine selected chassis and image/mask sources
      const chassis = (() => {
        try {
          return sessionStorage.getItem("design.chassis") || "medium";
        } catch (e) {
          return "medium";
        }
      })();
      const baseSrc =
        chassis === "large"
          ? VAN_TEMPLATE_NEW
          : chassis === "medium"
            ? STANDARD_TEMPLATE_NEW
            : chassis === "small"
              ? MINIBUS_TEMPLATE_NEW
              : HERO_IMAGE[chassis];
      const maskSrc = (() => {
        const MASKS: Record<string, string | null> = {
          small: smallMaskUrl,
          medium: mediumMaskUrl,
          large: largeMaskUrl,
          extra: extraMaskUrl,
        };
        return MASKS[chassis] || null;
      })();

      if (!baseSrc) return null;

      // load images
      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = (e) => reject(e);
          img.src = src;
        });

      const baseImg = await loadImage(baseSrc);
      const width = baseImg.naturalWidth || 800;
      const height = baseImg.naturalHeight || 600;

      // create main canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get canvas context");

      // draw base
      ctx.drawImage(baseImg, 0, 0, width, height);

      // apply color mask if present and color selected
      try {
        const raw = sessionStorage.getItem("design.color");
        const parsed = raw ? JSON.parse(raw) : null;
        const colorHex = parsed?.colorHex || selectedColorHex;
        if (maskSrc && colorHex) {
          const maskImg = await loadImage(maskSrc);

          // create color canvas
          const colorCanvas = document.createElement("canvas");
          colorCanvas.width = width;
          colorCanvas.height = height;
          const cctx = colorCanvas.getContext("2d");
          if (!cctx) throw new Error("Failed to get color canvas context");

          // fill with color
          cctx.fillStyle = colorHex;
          cctx.fillRect(0, 0, width, height);

          // Use mask: keep color only where mask is opaque
          cctx.globalCompositeOperation = "destination-in";
          cctx.drawImage(maskImg, 0, 0, width, height);
          cctx.globalCompositeOperation = "source-over";

          // draw color overlay onto main canvas
          ctx.drawImage(colorCanvas, 0, 0, width, height);
        }
      } catch (e) {
        console.warn("apply color mask failed", e);
      }

      // return blob
      return await new Promise<Blob | null>((resolve) => {
        try {
          canvas.toBlob((b) => {
            resolve(b);
          }, "image/png");
        } catch (e) {
          console.warn("canvas.toBlob failed", e);
          resolve(null);
        }
      });
    } catch (e) {
      console.warn("renderFinalImageBlob failed", e);
      return null;
    }
  };

  const handleFinish = async () => {
    try {
      // Persist final slogan
      sessionStorage.setItem("design.slogan", slogan);
    } catch (e) {}

    setIsUploadingResult(true);
    try {
      // render image blob
      const blob = await renderFinalImageBlob();
      if (blob) {
        try {
          const raw = sessionStorage.getItem("design.color");
          const parsed = raw ? JSON.parse(raw) : null;
          const colorHex = parsed?.colorHex || selectedColorHex || null;

          // attempt to get userId from auth if available
          let userId: string | null = null;
          try {
            // dynamic import to avoid adding firebase/auth earlier in this module
            const { getAuth } = await import("firebase/auth");
            const auth = getAuth();
            if (auth && (auth as any).currentUser)
              userId = (auth as any).currentUser.uid;
          } catch (_) {}

          // Upload moved to InfoScreen: skip network upload here.
        } catch (e) {
          console.warn("skipped upload in DesignScreen (moved to InfoScreen)", e);
        }
      }
    } catch (e) {
      console.warn("handleFinish upload failed", e);
    } finally {
      setIsUploadingResult(false);
    }

    try {
      // Persist final rendered image & state so subsequent pages use the design image
      const final = {
        imageSrc: (() => {
          const chassis = (() => {
            try {
              const saved = sessionStorage.getItem("design.chassis");
              return saved || "medium";
            } catch (e) {
              return "medium";
            }
          })();
          return chassis === "large"
            ? VAN_TEMPLATE_NEW
            : chassis === "medium"
              ? STANDARD_TEMPLATE_NEW
              : chassis === "small"
                ? MINIBUS_TEMPLATE_NEW
                : HERO_IMAGE[chassis];
        })(),
        chassis: (() => {
          try {
            return sessionStorage.getItem("design.chassis") || "medium";
          } catch (e) {
            return "medium";
          }
        })(),
        color: (() => {
          try {
            const raw = sessionStorage.getItem("design.color");
            return raw ? JSON.parse(raw) : null;
          } catch (e) {
            return null;
          }
        })(),
        colorMaskSrc: (() => {
          try {
            const saved = sessionStorage.getItem("design.chassis") || "medium";
            const MASKS: Record<string, string | null> = {
              small: smallMaskUrl,
              medium: mediumMaskUrl,
              large: largeMaskUrl,
              extra: extraMaskUrl,
            };
            return MASKS[saved] || null;
          } catch (e) {
            return null;
          }
        })(),
        overlayIconMap: (() => {
          try {
            const raw = sessionStorage.getItem("design.overlayIconMap");
            return raw ? JSON.parse(raw) : null;
          } catch (e) {
            return null;
          }
        })(),
      };
      sessionStorage.setItem("design.finalImage", JSON.stringify(final));
      // mark finalized so other pages prefer final image over chassis-only previews
      sessionStorage.setItem("design.finalized", "1");
    } catch (e) {}

    navigate("/mydreambus/submit");
  };

  return (
    <>
      <MetaUpdater
        title="UK PACT - กรุงเทพฯ ลดติด"
        description="ออกแบบรถเมล์เพื่อช่วยลดปัญหการจราจรในกรุงเทพฯ — เลือกขนาดรถ สี และสิ่งอำนวยความสะดวกที่ต้องการ"
        image="https://cdn.builder.io/api/v1/image/assets%2F0eb7afe56fd645b8b4ca090471cef081%2F44cea8aeb6d4415e899494a90c6f59b1?format=webp&width=1200"
      />
      <CustomizationScreen
        title="ออกแบบรถเมล์ของคุณ"
        theme="light"
        footerContent={
          <MyFooter>
            <div className="w-full flex justify-center">
              <CtaButton text="ออกแบบเสร็จแล้ว" onClick={handleFinish} />
            </div>
          </MyFooter>
        }
      >
        <div className="space-y-6">
          {/* Firestore confirmation panel (trial) */}
          {savedInfo && (
            // Hidden for UI only — functionality and state remain unchanged
            <div style={{ display: "none" }} aria-hidden="true">
              <div className="max-w-2xl w-full mx-auto bg-white border-2 border-[#000D59] rounded-xl p-3 mb-2">
                <div className="text-sm text-[#001a73] font-medium">
                  บันทึกภาพตัวอย่างไปยัง Firestore แล้ว
                </div>
                <div className="mt-1 text-[11px] text-[#001a73]">
                  Collection: {savedInfo.col || "(unknown)"}
                </div>
                <div className="mt-2 flex gap-3 items-start">
                  <img
                    src={savedInfo.url}
                    alt="image"
                    className="w-32 h-20 object-contain rounded border"
                  />
                  <div className="text-xs break-words flex-1">
                    <div>
                      <span className="font-semibold">Doc ID:</span>{" "}
                      {savedInfo.id || "(ไม่ทราบ)"}
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold">URL:</span>{" "}
                      {savedInfo.url}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="w-full rounded-md flex flex-col items-center justify-center gap-2">
            {(() => {
              const MASKS: Record<string, string | null> = {
                // Upload mask images (black=masked area) for each chassis variant and paste URLs here.
                small: smallMaskUrl,
                medium: mediumMaskUrl,
                large: largeMaskUrl,
                extra: extraMaskUrl,
              };

              // NOTE: Pre-rendered image swapping and first-swatch override removed.
              // Previous implementation allowed mapping specific chassis+color to a
              // pre-rendered vehicle image (PRE_RENDERED) and to override the
              // preview image when the first swatch was clicked (FIRST_SWATCH_IMAGE).
              //
              // This was removed to simplify behavior: the preview now always uses
              // the base HERO_IMAGE for the selected chassis. Color is applied via
              // VehiclePreview using colorFilter / colorHex (overlay or blend).
              // If you later want pre-rendered mappings, reintroduce PRE_RENDERED
              // as a mapping and implement a findPreRendered helper here.

              // (no PRE_RENDERED / overrideImage state present)
              let selected = "medium";
              try {
                const saved = sessionStorage.getItem("design.chassis");
                if (saved) selected = saved;
              } catch (e) {}
              const label = CHASSIS_LABELS[selected] || "";
              // Use the base hero image for the selected chassis. For 'large' (van) and 'medium' (standard), use the new design templates.
              // Color overlay is handled by VehiclePreview via colorFilter / colorHex.
              const img =
                selected === "large"
                  ? VAN_TEMPLATE_NEW
                  : selected === "medium"
                    ? STANDARD_TEMPLATE_NEW
                    : selected === "small"
                      ? MINIBUS_TEMPLATE_NEW
                      : HERO_IMAGE[selected];
              return img ? (
                <>
                  <VehiclePreview
                    className="vehicle-preview"
                    imageSrc={img}
                    label={label}
                    showSelectedText
                    colorHex={selectedColorHex}
                    colorMaskSrc={MASKS[selected]}
                    overlayLabels={(() => {
                      const amenities = (() => {
                        try {
                          const raw =
                            sessionStorage.getItem("design.amenities");
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
                      const doorsRaw = (() => {
                        try {
                          const raw = sessionStorage.getItem("design.doors");
                          return raw
                            ? (JSON.parse(raw) as any)
                            : raw
                              ? String(raw)
                              : null;
                        } catch {
                          return sessionStorage.getItem("design.doors");
                        }
                      })();
                      const overlayLabels: string[] = [
                        ...(amenities || []),
                        ...(payments || []),
                      ];
                      if (doorsRaw)
                        overlayLabels.push(
                          typeof doorsRaw === "string"
                            ? doorsRaw
                            : doorsRaw.doorChoice ||
                                (doorsRaw.hasRamp
                                  ? "ramp"
                                  : doorsRaw.highLow
                                    ? "emergency"
                                    : ""),
                        );
                      return overlayLabels;
                    })()}
                    overlayIconMap={OVERLAY_ICON_SRC}
                  />
                </>
              ) : (
                <div className="w-full h-72 rounded-md flex items-center justify-center text-sm text-gray-300">
                  Bus preview (color applied)
                </div>
              );
            })()}
          </div>
          <div className="max-w-4xl w-full mx-auto">
            <div className="bg-white rounded-xl p-6 border-2 border-[#000D59]">
              <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-2">
                ออกแบบสี
              </h2>
              <ColorPalette
                colors={DEFAULT_COLORS}
                selectedColor={selectedColorPreview || selectedColorHex || ""}
                onColorSelect={(colorHex?: string | null, preview?: string) => {
                  try {
                    sessionStorage.setItem(
                      "design.color",
                      JSON.stringify({ colorHex, preview }),
                    );
                  } catch (e) {}
                  setSelectedColorHex(colorHex ?? null);
                  setSelectedColorPreview(preview ?? null);
                }}
              />

              <h2 className="text-xl font-prompt font-semibold text-[#003366] mt-4">
                ลักษณะพิเศษอื่นๆ ของรถคุณ
              </h2>
              <div>
                <input
                  type="text"
                  value={slogan}
                  readOnly
                  onClick={() => {
                    setSloganDraft(slogan);
                    setShowTextarea(true);
                  }}
                  placeholder="พิมพ์ คุณสมบัติพิเศษ"
                  className="w-full rounded-xl px-4 py-2 bg-white border-2 border-[#000D59] text-[#003366] placeholder-gray-400 cursor-text text-center"
                />

                {showTextarea && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl p-4 max-w-lg w-full mx-4">
                      <style>{`.save-btn-modal:hover { color: #000D59 !important; }`}</style>
                      <h3 className="text-lg font-prompt font-semibold text-[#000d59]">
                        ลักษณะพิเศษอื่นๆของรถคุณ
                      </h3>
                      <textarea
                        ref={textareaRef}
                        value={sloganDraft}
                        onChange={(e) => setSloganDraft(e.target.value)}
                        placeholder={
                          "[พิมพ์คุณสมบัติพิเศษเพิ่มเติมของ\nรถเมล์ในฝันของคุณ]"
                        }
                        className="mt-3 w-full h-36 p-3 border-2 border-[#000D59] rounded-xl text-sm resize-none text-center"
                        style={{ whiteSpace: "pre-wrap" }}
                      />
                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          onClick={() => setShowTextarea(false)}
                          className="px-4 py-2 rounded-xl bg-[#ffe000] text-[#000D59] hover:bg-[#000D59] hover:text-white transition-colors"
                        >
                          ยกเลิก
                        </button>
                        <button
                          onMouseEnter={() => setIsSaveHover(true)}
                          onMouseLeave={() => setIsSaveHover(false)}
                          onClick={() => {
                            setSlogan(sloganDraft);
                            setShowTextarea(false);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#000D59] hover:bg-[#ffe000] transition-colors save-btn-modal"
                          style={{ color: isSaveHover ? "#000D59" : "#ffffff" }}
                        >
                          <span
                            style={{
                              color: isSaveHover ? "#000D59" : "#ffffff",
                            }}
                          >
                            บันทึก
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CustomizationScreen>
    </>
  );
};

export default DesignScreen;
