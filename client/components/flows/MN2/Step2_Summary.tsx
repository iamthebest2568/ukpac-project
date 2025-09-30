/**
 * UK PACK - MN2 Step 2: Policy Summary
 * Fixed responsive design for icons and text
 */

import { useEffect, useState, useRef } from "react";
import { useSession } from "../../../hooks/useSession";
import Uk1Button from "../../shared/Uk1Button";
import {
  uploadFileToStorage,
  saveMinigameSummaryImageUrl,
  initFirebase,
} from "../../../lib/firebase";

interface Step2_SummaryProps {
  sessionID: string | null;
  onNext: (data: any) => void;
  onBack?: () => void;
  journeyData?: any;
  useUk1Button?: boolean;
}

interface SummaryCard {
  priority: string;
  beneficiaries: { label: string; iconSrc: string; id: string }[];
}

// Options for captureAndUpload: allow callers to control output dimensions, quality and DPR
interface CaptureOptions {
  // exact output width in pixels (CSS px) — optional
  targetWidth?: number;
  // exact output height in pixels (CSS px) — optional
  targetHeight?: number;
  // maximum dimension (width or height) used to scale down large content when targetWidth/Height not provided
  maxDimension?: number;
  // image quality 0..1 for JPEG
  quality?: number;
  // device pixel ratio to rasterize at (1..3). If not provided, defaults to window.devicePixelRatio clamped to 2.
  dpr?: number;
  // allow upscaling content to fill target area (default false)
  upscale?: boolean;
  // crop output to content size (remove extra whitespace). Default true
  cropToContent?: boolean;
}

const Step2_Summary = ({
  sessionID,
  onNext,
  onBack,
  journeyData,
  useUk1Button = false,
}: Step2_SummaryProps) => {
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [lastStorageUrl, setLastStorageUrl] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [captureStatus, setCaptureStatus] = useState<string | null>(null);
  const { navigateToPage } = useSession();

  // Cleared: do not reference external images or mappings. Keep only textual labels.

  useEffect(() => {
    // Extract priorities from journey data
    let prioritiesData: string[] =
      journeyData?.priorities?.selectedPriorities ||
      journeyData?.mn1?.priorities?.selectedPriorities ||
      [];

    // Extract beneficiary selections
    let beneficiariesSelections: {
      priority: string;
      beneficiaries: string[];
    }[] =
      journeyData?.beneficiaries?.selections ||
      journeyData?.mn2?.beneficiaries?.selections ||
      [];

    // If priorities missing, derive from beneficiaries selections order
    if (!prioritiesData || prioritiesData.length === 0) {
      prioritiesData = (beneficiariesSelections || []).map(
        (s: any) => s.priority,
      );
    }

    // Build lookup map
    const lookup: Record<string, string[]> = {};
    beneficiariesSelections.forEach((s: any) => {
      lookup[s.priority] = Array.isArray(s.beneficiaries)
        ? s.beneficiaries
        : [];
    });

    // Create summary cards
    let cards: SummaryCard[] = prioritiesData.map((priority: string) => {
      const entries = lookup[priority] || [];
      const beneficiaryObjects = entries
        .filter((entry: any) => entry !== "other")
        .map((entry: any) => {
          if (entry && typeof entry === "object" && entry.id) {
            return {
              id: entry.id,
              label: entry.label || String(entry.id),
              iconSrc: (entry as any).iconSrc || null,
            };
          }
          const id = String(entry || "");
          return {
            id,
            label: id || "(ไม่ได้ระบุ)",
            iconSrc: null,
          };
        });

      return {
        priority,
        beneficiaries: beneficiaryObjects,
      };
    });

    // If no priorities found but there are beneficiary selections, build cards from selections order
    if (
      (!cards || cards.length === 0) &&
      Array.isArray(beneficiariesSelections) &&
      beneficiariesSelections.length > 0
    ) {
      cards = beneficiariesSelections.map((s: any) => {
        const beneficiaryObjects = (s.beneficiaries || [])
          .filter((entry: any) => entry !== "other")
          .map((entry: any) => {
            if (entry && typeof entry === "object" && entry.id) {
              return {
                id: entry.id,
                label: entry.label || String(entry.id),
                iconSrc: (entry as any).iconSrc || null,
              };
            }
            const id = String(entry || "");
            return {
              id,
              label: id || "(ไม่ได้ระบุ)",
              iconSrc: null,
            };
          });
        return {
          priority: s.priority || "(ไม่ได้ระบุ)",
          beneficiaries: beneficiaryObjects,
        };
      });
    }

    setSummaryCards(cards);
  }, [journeyData]);

  // Auto-capture and upload the main content as an image (runs once when summaryCards first available)
  const hasCapturedRef = useRef(false);

  useEffect(() => {
    if (summaryCards && summaryCards.length > 0 && !hasCapturedRef.current) {
      hasCapturedRef.current = true;
      // small delay to ensure DOM settled and fonts/images loaded
      const t = setTimeout(() => {
        (async () => {
          try {
            await initFirebase();
          } catch (_) {}
          try {
            await captureAndUpload();
          } catch (e) {
            try {
              const msg = e && (e as any).message ? (e as any).message : String(e);
              setCaptureError(msg);
            } catch (_) {}
            console.warn("captureAndUpload failed", e);
          }
        })();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [summaryCards]);

  const handleShareGame = () => {
    // Handle share game logic
    console.log("Share game");
  };

  const handleEndGame = () => {
    const data = {
      summary: { summaryReviewed: true, summaryCards, confirmed: true },
    };
    onNext(data);
  };

  const handleNo = () => {
    // User is not satisfied — navigate to ask05 for feedback
    const data = {
      summary: { summaryReviewed: true, summaryCards, confirmed: false },
    };

    try {
      onNext(data);
    } catch (e) {}

    navigateToPage("ask05", data);
  };

  // Capture helper: serialize DOM to SVG -> rasterize to canvas -> resize to 3:4 (portrait) -> upload
  async function captureAndUpload(options?: CaptureOptions) {
    // backup hidden elements so we can restore them in finally
    let _hiddenBackup: {
      el: HTMLElement;
      display: string | null;
      visibility: string | null;
    }[] = [];
    try {
      // Find target element robustly: prefer explicit id, then main within this document, then container by class.
      function findContentElement(): HTMLElement | null {
        // Prefer locating content inside same-origin iframes first (portal mounts often render there)
        try {
          const iframes = Array.from(document.getElementsByTagName('iframe')) as HTMLIFrameElement[];
          for (const f of iframes) {
            try {
              const doc = f.contentDocument || (f.contentWindow && f.contentWindow.document);
              if (!doc) continue;
              const byId = doc.getElementById('mn2-step2-content');
              if (byId) return byId as HTMLElement;
              const inside = doc.querySelector('.figma-style1-container') || doc.querySelector('main');
              if (inside) return inside as HTMLElement;
            } catch (e) {
              // cross-origin or inaccessible iframe - skip
              continue;
            }
          }
        } catch (e) {}

        // 1. exact id in top-level document
        try {
          const byId = document.getElementById("mn2-step2-content");
          if (byId) return byId as HTMLElement;
        } catch (_) {}

        // 2. main#main-content or first main
        try {
          const mainById = document.getElementById(
            "main-content",
          ) as HTMLElement | null;
          if (mainById) {
            const inside = mainById.querySelector(
              ".figma-style1-container",
            ) as HTMLElement | null;
            if (inside) return inside;
            return mainById;
          }
        } catch (_) {}

        try {
          const main = document.querySelector("main") as HTMLElement | null;
          if (main) {
            const inside = main.querySelector(
              ".figma-style1-container",
            ) as HTMLElement | null;
            if (inside) return inside;
            return main;
          }
        } catch (_) {}

        // 3. any element with the container class
        try {
          const container = document.querySelector(
            ".figma-style1-container",
          ) as HTMLElement | null;
          if (container) return container;
        } catch (_) {}

        return null;
      }

      setCaptureStatus('locating content element');
      let el = findContentElement();
      if (!el) {
        // retry a few times to allow iframe mount and portal to initialize
        const maxAttempts = 6;
        for (let attempt = 1; attempt <= maxAttempts && !el; attempt++) {
          setCaptureStatus(`waiting for content (attempt ${attempt})`);
          await new Promise((r) => setTimeout(r, 200 * attempt));
          try {
            el = findContentElement() as HTMLElement | null;
            if (el) break;
          } catch (_) {
            el = null;
          }
        }
      }

      if (!el) {
        // fallback: try inspecting all iframes individually (best-effort)
        try {
          const iframes = Array.from(document.getElementsByTagName("iframe")) as HTMLIFrameElement[];
          for (const f of iframes) {
            try {
              const doc = f.contentDocument || (f.contentWindow && f.contentWindow.document);
              if (!doc) continue;
              const candidate = doc.getElementById("mn2-step2-content") || doc.querySelector(".figma-style1-container") || doc.querySelector("main");
              if (candidate) {
                el = candidate as HTMLElement;
                setCaptureStatus('found content in iframe (fallback)');
                break;
              }
            } catch (e) {
              // cross-origin or inaccessible iframe - skip
              continue;
            }
          }
        } catch (_) {}
      }

      if (!el) {
        console.warn("mn2-step2-content element not found");
        setCaptureError('content element not found');
        setCaptureStatus(null);
        return;
      }
      setCaptureStatus('content element located');

      // Temporarily hide footers/sticky controls in the live document to avoid overlays
      try {
        const selector =
          'footer, [style*="position: sticky"], [style*="position: fixed"], .figma-style1-button-container';
        const list = Array.from(
          document.querySelectorAll(selector),
        ) as HTMLElement[];
        _hiddenBackup = list.map((el) => ({
          el,
          display: el.style.display || null,
          visibility: el.style.visibility || null,
        }));
        for (const e of list) {
          try {
            e.style.setProperty("display", "none", "important");
            e.style.setProperty("visibility", "hidden", "important");
          } catch (_) {}
        }
      } catch (_) {}

      // Clone the node to avoid modifying the live DOM
      const clone = el.cloneNode(true) as HTMLElement;
      // Remove footer/sticky elements from clone to avoid overlaying captured content
      try {
        const foot = clone.querySelector("footer");
        if (foot && foot.parentNode) foot.parentNode.removeChild(foot);
        const stickyEls = clone.querySelectorAll(
          "[style*='position: sticky'], .figma-style1-button-container, footer",
        );
        stickyEls.forEach((s) => {
          try {
            (s as HTMLElement).style.display = "none";
          } catch (_) {}
        });
      } catch (_) {}

      // Render a clone offscreen to measure full content size (including scrolled parts)
      const ownerDoc = (el as any).ownerDocument || document;

      // Prepare offscreen measure container
      const measureContainer = ownerDoc.createElement("div");
      measureContainer.style.position = "absolute";
      measureContainer.style.left = "-99999px";
      measureContainer.style.top = "0px";
      measureContainer.style.width = "auto";
      measureContainer.style.height = "auto";
      measureContainer.style.overflow = "visible";
      measureContainer.style.visibility = "hidden";
      measureContainer.style.pointerEvents = "none";

      let importedForMeasure: HTMLElement;
      try {
        importedForMeasure = ownerDoc.importNode(clone, true) as HTMLElement;
      } catch (_) {
        importedForMeasure = clone as HTMLElement;
      }

      importedForMeasure.style.boxSizing = "border-box";
      // keep same layout width as source to preserve wrapping
      try {
        const originalRect = el.getBoundingClientRect();
        importedForMeasure.style.width = `${Math.max(1, Math.round(originalRect.width))}px`;
      } catch (_) {
        importedForMeasure.style.width = "auto";
      }
      importedForMeasure.style.height = "auto";
      importedForMeasure.style.maxHeight = "none";
      importedForMeasure.style.overflow = "visible";

      // Ensure nested scrollable elements expand to show full content
      try {
        const descendants = Array.from(
          importedForMeasure.querySelectorAll("*"),
        ) as HTMLElement[];
        for (const d of descendants) {
          try {
            const cs = (ownerDoc.defaultView || window).getComputedStyle(
              d as any,
            );
            const overflow =
              (cs &&
                (cs.getPropertyValue("overflow") ||
                  cs.getPropertyValue("overflow-y") ||
                  cs.getPropertyValue("overflow-x"))) ||
              "";
            // if element is scrollable or clipped, expand it
            if (/auto|scroll|hidden/.test(overflow)) {
              try {
                const sh =
                  (d as any).scrollHeight || (d as any).offsetHeight || null;
                if (sh && sh > 0) {
                  d.style.maxHeight = "none";
                  d.style.height = `${sh}px`;
                  d.style.overflow = "visible";
                }
              } catch (_) {}
            }
            // Normalize fixed/absolute positioning so elements render in flow
            const pos = cs && cs.getPropertyValue("position");
            if (pos === "fixed" || pos === "absolute") {
              d.style.position = "static";
            }
            // Remove transforms which may clip or offset content
            d.style.transform = "none";
            d.style.webkitTransform = "none";
          } catch (_) {}
        }
      } catch (_) {}

      measureContainer.appendChild(importedForMeasure);
      try {
        (ownerDoc.body || ownerDoc.documentElement).appendChild(
          measureContainer,
        );
      } catch (_) {
        try {
          ownerDoc.documentElement.appendChild(measureContainer);
        } catch (_) {}
      }

      setCaptureStatus('waiting for images/fonts in clone');
      // Wait for images/font faces to load inside the clone
      try {
        const imgs = Array.from(
          importedForMeasure.querySelectorAll("img"),
        ) as HTMLImageElement[];
        await Promise.all(
          imgs.map(
            (img) =>
              new Promise((res) => {
                if (img.complete) return res(true);
                img.onload = () => res(true);
                img.onerror = () => res(true);
                try {
                  img.crossOrigin = "anonymous";
                } catch (_) {}
              }),
          ),
        );
      } catch (e) {
        console.warn('image/font wait failed', e);
      }
      try {
        if ((ownerDoc as any).fonts && (ownerDoc as any).fonts.ready)
          await (ownerDoc as any).fonts.ready;
      } catch (e) {
        console.warn('fonts.ready failed', e);
      }

      setCaptureStatus('measuring content');
      // Measure natural size
      let measuredW = Math.ceil(
        importedForMeasure.scrollWidth ||
          importedForMeasure.offsetWidth ||
          importedForMeasure.getBoundingClientRect().width ||
          800,
      );
      let measuredH = Math.ceil(
        importedForMeasure.scrollHeight ||
          importedForMeasure.offsetHeight ||
          importedForMeasure.getBoundingClientRect().height ||
          Math.ceil((measuredW * 4) / 3),
      );

      // If cropping to content, compute tight bounds of non-empty descendants to remove trailing whitespace/padding
      try {
        const cropToContentOpt =
          options && typeof options.cropToContent === "boolean"
            ? options.cropToContent
            : true;
        if (cropToContentOpt) {
          const rootRect = importedForMeasure.getBoundingClientRect();
          let minTop = Infinity;
          let minLeft = Infinity;
          let maxBottom = -Infinity;
          let maxRight = -Infinity;
          const nodes = [
            importedForMeasure as HTMLElement,
            ...(Array.from(
              importedForMeasure.querySelectorAll("*"),
            ) as HTMLElement[]),
          ];
          for (const n of nodes) {
            try {
              const r = n.getBoundingClientRect();
              const w = r.width || (n as any).offsetWidth || 0;
              const h = r.height || (n as any).offsetHeight || 0;
              const hasVisible =
                (w > 0 && h > 0 && (n.textContent || "").trim().length > 0) ||
                n.querySelector("img") ||
                n.tagName === "IMG" ||
                (n.childElementCount > 0 &&
                  (n.innerText || "").trim().length > 0);
              if (!hasVisible) continue;
              const top = r.top - rootRect.top;
              const left = r.left - rootRect.left;
              const bottom = r.bottom - rootRect.top;
              const right = r.right - rootRect.left;
              if (top < minTop) minTop = top;
              if (left < minLeft) minLeft = left;
              if (bottom > maxBottom) maxBottom = bottom;
              if (right > maxRight) maxRight = right;
            } catch (_) {}
          }
          if (maxBottom > -Infinity && maxRight > -Infinity) {
            // tighten measured sizes
            const tightW = Math.ceil(
              Math.max(1, maxRight - Math.min(0, minLeft)),
            );
            const tightH = Math.ceil(
              Math.max(1, maxBottom - Math.min(0, minTop)),
            );
            // only override if significantly smaller to avoid breaking layout
            if (tightW > 0 && tightH > 0) {
              measuredW = tightW;
              measuredH = tightH;
            }
          }
        }
      } catch (_) {}

      // Remove measure container
      try {
        if (measureContainer.parentNode)
          measureContainer.parentNode.removeChild(measureContainer);
      } catch (_) {}

      // Create a fresh clone to serialize/inline from
      let importedClone: Node;
      try {
        importedClone = ownerDoc.importNode(clone, true);
      } catch (_) {
        importedClone = clone;
      }

      const elemW = Math.max(1, measuredW);
      const elemH = Math.max(1, measuredH);

      (importedClone as HTMLElement).style.boxSizing = "border-box";
      (importedClone as HTMLElement).style.width = `${elemW}px`;
      (importedClone as HTMLElement).style.height = `${elemH}px`;
      (importedClone as HTMLElement).style.margin = "0";
      (importedClone as HTMLElement).style.overflow = "visible";

      // Determine output dimensions and quality options BEFORE building the wrapper so we can render the final canvas size
      const maxDimensionOpt =
        typeof options?.maxDimension === "number"
          ? Math.max(1, Math.floor(options!.maxDimension!))
          : 2000;
      const quality =
        typeof options?.quality === "number"
          ? Math.max(0, Math.min(1, options!.quality!))
          : 0.8;
      const requestedDpr =
        typeof options?.dpr === "number"
          ? Math.max(1, Math.min(3, options!.dpr!))
          : Math.min(2, window.devicePixelRatio || 1);

      // Natural content size (measured)
      const naturalW = Math.max(1, Math.round(elemW));
      const naturalH = Math.max(1, Math.round(elemH));

      // Desired maximum size from options (if provided)
      const tw =
        typeof options?.targetWidth === "number"
          ? Math.max(1, Math.round(options!.targetWidth!))
          : undefined;
      const th =
        typeof options?.targetHeight === "number"
          ? Math.max(1, Math.round(options!.targetHeight!))
          : undefined;
      const desiredW = tw || naturalW;
      const desiredH = th || naturalH;

      // By default, cropToContent = true (do not leave extra blank space). If true, final output will be no larger than the content dimensions.
      const cropToContent =
        options && typeof options.cropToContent === "boolean"
          ? options.cropToContent
          : true;

      // Compute output dimensions (CSS pixels)
      let outputW = cropToContent ? Math.min(desiredW, naturalW) : desiredW;
      let outputH = cropToContent ? Math.min(desiredH, naturalH) : desiredH;

      // Ensure we respect maxDimensionOpt
      if (Math.max(outputW, outputH) > maxDimensionOpt) {
        const _scale = maxDimensionOpt / Math.max(outputW, outputH);
        outputW = Math.max(1, Math.round(outputW * _scale));
        outputH = Math.max(1, Math.round(outputH * _scale));
      }

      // Canvas CSS dimensions
      let canvasW = outputW;
      let canvasH = outputH;

      const wrapper = ownerDoc.createElement("div");
      wrapper.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
      wrapper.style.width = `${elemW}px`;
      wrapper.style.height = `${elemH}px`;
      wrapper.style.background = "#ffffff";
      wrapper.style.overflow = "visible";
      wrapper.style.fontFamily =
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      // Inject style to hide scrollbars and normalize overflow/position so clone renders without scrollbars
      try {
        const styleEl = ownerDoc.createElement("style");
        styleEl.innerHTML = `
          * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
          *::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
          html, body { overflow: visible !important; }
          .no-scrollbar { overflow: visible !important; }
        `;
        wrapper.appendChild(styleEl);
      } catch (_) {}

      // Remove any inline max-height/overflow constraints on descendants to ensure full rendering
      try {
        const descendants = Array.from(
          (importedClone as HTMLElement).querySelectorAll("*") as any,
        ) as HTMLElement[];
        for (const d of descendants) {
          d.style.maxHeight = "none";
          d.style.overflow = "visible";
        }
      } catch (_) {}

      // Inline computed styles from the live document into the cloned subtree to preserve appearance
      try {
        async function inlineComputedStyles(
          sourceRoot: HTMLElement,
          targetRoot: HTMLElement,
        ) {
          // Copy computed styles in document order (best-effort)
          const srcNodes = [
            sourceRoot,
            ...Array.from(sourceRoot.querySelectorAll("*")),
          ];
          const dstNodes = [
            targetRoot,
            ...Array.from(targetRoot.querySelectorAll("*")),
          ];
          const len = Math.min(srcNodes.length, dstNodes.length);
          for (let i = 0; i < len; i++) {
            try {
              const src = srcNodes[i] as HTMLElement;
              const dst = dstNodes[i] as HTMLElement;
              const cs = (ownerDoc.defaultView || window).getComputedStyle(
                src as any,
              );
              for (let k = 0; k < cs.length; k++) {
                const prop = cs[k];
                let val = cs.getPropertyValue(prop);
                const priority = cs.getPropertyPriority(prop);
                try {
                  dst.style.setProperty(prop, val, priority);
                } catch (_) {}
              }

              // Preserve value/checked for inputs
              if (src.tagName === "INPUT") {
                try {
                  (dst as HTMLInputElement).value =
                    (src as HTMLInputElement).value || "";
                  (dst as HTMLInputElement).checked =
                    (src as HTMLInputElement).checked || false;
                } catch (_) {}
              }
            } catch (_) {
              continue;
            }
          }

          // Handle images separately to inline them as data URLs (avoid CORS)
          try {
            const srcImgs = Array.from(
              sourceRoot.querySelectorAll("img"),
            ) as HTMLImageElement[];
            const dstImgs = Array.from(
              targetRoot.querySelectorAll("img"),
            ) as HTMLImageElement[];
            for (let i = 0; i < dstImgs.length; i++) {
              try {
                const dstImg = dstImgs[i];
                const srcImg = srcImgs[i];
                if (!srcImg) continue;
                const s = srcImg.getAttribute("src") || srcImg.src || "";
                if (s && /^https?:\/\//i.test(s)) {
                  try {
                    const prox = `/api/proxy-image?url=${encodeURIComponent(s)}`;
                    const r = await fetch(prox);
                    if (r.ok) {
                      const b = await r.blob();
                      const reader = new FileReader();
                      const dataUrl = await new Promise<string | null>(
                        (res) => {
                          reader.onloadend = () => res(reader.result as string);
                          reader.readAsDataURL(b);
                        },
                      );
                      if (dataUrl) dstImg.setAttribute("src", dataUrl);
                      else dstImg.setAttribute("src", prox);
                    } else {
                      dstImg.setAttribute("src", prox);
                    }
                  } catch (_) {
                    dstImg.setAttribute("src", s);
                  }
                } else if (s) {
                  dstImg.setAttribute("src", s);
                }
                // copy alt
                const alt = srcImg.getAttribute("alt");
                if (alt) dstImg.setAttribute("alt", alt);
                // copy inline width/height if present
                if (srcImg.width) dstImg.width = srcImg.width;
                if (srcImg.height) dstImg.height = srcImg.height;
              } catch (_) {
                continue;
              }
            }
          } catch (_) {}

          // Inline background-image URLs to data URLs for elements that have them
          try {
            const all = Array.from(
              targetRoot.querySelectorAll("*"),
            ) as HTMLElement[];
            for (const node of all) {
              try {
                const bg = (ownerDoc.defaultView || window)
                  .getComputedStyle(node)
                  .getPropertyValue("background-image");
                if (bg && bg !== "none") {
                  const m = /url\([\"']?([^\)\"']+)[\"']?\)/.exec(bg);
                  if (m && m[1]) {
                    const originalUrl = m[1];
                    if (/^https?:\/\//i.test(originalUrl)) {
                      try {
                        const prox = `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
                        const r = await fetch(prox);
                        if (r.ok) {
                          const b = await r.blob();
                          const reader = new FileReader();
                          const dataUrl = await new Promise<string | null>(
                            (res) => {
                              reader.onloadend = () =>
                                res(reader.result as string);
                              reader.readAsDataURL(b);
                            },
                          );
                          if (dataUrl) {
                            node.style.backgroundImage = `url('${dataUrl}')`;
                          } else {
                            node.style.backgroundImage = `url('${prox}')`;
                          }
                        } else {
                          node.style.backgroundImage = `url('${prox}')`;
                        }
                      } catch (_) {
                        // leave as is
                      }
                    }
                  }
                }
              } catch (_) {}
            }
          } catch (_) {}
        }

        let sourceRootForInline = el as HTMLElement;
        try {
          if ((el as any).ownerDocument) {
            sourceRootForInline = el as HTMLElement;
          }
        } catch (_) {}

        // run inlineComputedStyles (note: contains awaits for image inlining)
        await inlineComputedStyles(
          sourceRootForInline,
          importedClone as HTMLElement,
        );

        // Force-load lazy images inside clone and copy src/srcset from data attributes
        try {
          const imgs = Array.from(
            (importedClone as HTMLElement).querySelectorAll("img"),
          ) as HTMLImageElement[];
          for (const img of imgs) {
            try {
              img.loading = "eager";
              const dsSrc =
                img.getAttribute("data-src") ||
                img.getAttribute("data-srcset") ||
                img.getAttribute("data-lazy-src");
              if (dsSrc && !img.src) {
                img.src = dsSrc;
              }
              const ds = img.getAttribute("data-srcset");
              if (ds && !img.getAttribute("srcset"))
                img.setAttribute("srcset", ds);
            } catch (_) {}
          }
        } catch (_) {}

        // Copy pseudo-elements ::before and ::after into real nodes so they render in foreignObject
        try {
          const srcAll = Array.from(
            (sourceRootForInline as HTMLElement).querySelectorAll("*"),
          ) as HTMLElement[];
          const dstAll = Array.from(
            (importedClone as HTMLElement).querySelectorAll("*"),
          ) as HTMLElement[];
          const pairsLen = Math.min(srcAll.length, dstAll.length);
          for (let i = 0; i < pairsLen; i++) {
            try {
              const s = srcAll[i];
              const d = dstAll[i];
              ["::before", "::after"].forEach((pseudo) => {
                try {
                  const cs = (ownerDoc.defaultView || window).getComputedStyle(
                    s as any,
                    pseudo as any,
                  );
                  const content = cs.getPropertyValue("content");
                  if (
                    content &&
                    content !== "none" &&
                    content !== '""' &&
                    content !== "''"
                  ) {
                    // strip quotes
                    const text = content.replace(/^['"]|['"]$/g, "") || "";
                    const span = ownerDoc.createElement("span");
                    span.textContent = text;
                    // copy some styles
                    const props = [
                      "color",
                      "font-size",
                      "font-weight",
                      "position",
                      "top",
                      "left",
                      "right",
                      "bottom",
                      "display",
                      "background-color",
                      "padding",
                      "margin",
                      "border",
                      "white-space",
                      "letter-spacing",
                      "transform",
                      "z-index",
                    ];
                    for (const p of props) {
                      try {
                        const v = cs.getPropertyValue(p);
                        if (v) (span.style as any).setProperty(p, v);
                      } catch (_) {}
                    }
                    // mark and insert
                    span.setAttribute("data-pseudo", pseudo);
                    if (pseudo === "::before")
                      d.insertBefore(span, d.firstChild);
                    else d.appendChild(span);
                  }
                } catch (_) {}
              });
            } catch (_) {}
          }
        } catch (_) {}
      } catch (e) {
        console.warn("inlineComputedStyles failed", e);
      }

      // Determine final output dimensions (CSS pixels) and center the content inside
      const finalOutputW = Math.max(1, canvasW);
      const finalOutputH = Math.max(1, canvasH);

      // Fit scale: by default do not upscale (avoid blur). If options.upscale is true and cropToContent is false, allow scale>1 to enlarge content
      const rawScale = Math.min(finalOutputW / elemW, finalOutputH / elemH);
      const cropToContentOpt =
        options && typeof options.cropToContent === "boolean"
          ? options.cropToContent
          : true;
      const fitScale = cropToContentOpt
        ? Math.min(1, rawScale)
        : options && options.upscale
          ? rawScale
          : Math.min(1, rawScale);
      const scaledW = Math.max(1, Math.round(elemW * fitScale));
      const scaledH = Math.max(1, Math.round(elemH * fitScale));
      const offsetLeft = Math.round((finalOutputW - scaledW) / 2);
      const offsetTop = Math.round((finalOutputH - scaledH) / 2);

      // Build a holder to center and (optionally) scale the imported clone
      try {
        wrapper.style.width = `${finalOutputW}px`;
        wrapper.style.height = `${finalOutputH}px`;
        wrapper.style.position = "relative";
        wrapper.style.display = "block";
        wrapper.style.overflow = "hidden";

        const contentHolder = ownerDoc.createElement("div");
        contentHolder.style.position = "absolute";
        contentHolder.style.left = `${offsetLeft}px`;
        contentHolder.style.top = `${offsetTop}px`;
        contentHolder.style.transformOrigin = "top left";
        contentHolder.style.transform = `scale(${fitScale})`;
        contentHolder.style.width = `${elemW}px`;
        contentHolder.style.height = `${elemH}px`;
        contentHolder.style.margin = "0";
        contentHolder.style.padding = "0";
        try {
          contentHolder.appendChild(importedClone as Node);
        } catch (_) {
          wrapper.appendChild(importedClone as Node);
        }

        wrapper.appendChild(contentHolder);
      } catch (_) {
        // fallback: just append the clone if centering fails
        try {
          wrapper.appendChild(importedClone as Node);
        } catch (_) {}
      }

      const serialized = new XMLSerializer().serializeToString(wrapper);

      setCaptureStatus('serializing to svg and rasterizing');
      const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${finalOutputW}' height='${finalOutputH}'>\n  <foreignObject width='100%' height='100%'>\n    ${serialized}\n  </foreignObject>\n</svg>`;

      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

      await new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => res(true);
        img.onerror = (e) => rej(e);
        img.crossOrigin = "anonymous";
        img.src = url;
      });

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;

      try {
        await new Promise((res, rej) => {
          img.onload = () => res(true);
          img.onerror = (e) => rej(e);
        });
      } catch (e) {
        console.warn('svg image rasterize failed', e);
        setCaptureError('svg rasterize failed: ' + (e && (e as any).message ? (e as any).message : String(e)));
        setCaptureStatus(null);
        throw e;
      }

      setCaptureStatus('creating canvas');
      // Create canvas and apply DPR for crispness
      const canvas = ownerDoc.createElement
        ? (ownerDoc.createElement("canvas") as HTMLCanvasElement)
        : document.createElement("canvas");
      canvas.width = Math.round(canvasW * requestedDpr);
      canvas.height = Math.round(canvasH * requestedDpr);
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.setTransform(requestedDpr, 0, 0, requestedDpr, 0, 0);

      // Fill background white
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Draw the source SVG image (already centered inside the svg) into the canvas
      ctx.drawImage(
        img as any,
        0,
        0,
        finalOutputW,
        finalOutputH,
        0,
        0,
        canvasW,
        canvasH,
      );

      // Convert to blob via data URL (JPEG with configurable quality)
      const dataUrl = canvas.toDataURL("image/jpeg", quality);

      // set preview for UI
      try {
        setPreviewDataUrl(dataUrl);
      } catch (_) {}

      // Convert dataURL to blob without fetch (avoids CSP/fetch failures)
      const dataParts = dataUrl.split(",");
      const meta = dataParts[0];
      const base64 = dataParts[1];
      const mimeMatch = meta.match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const byteString = atob(base64);
      const len = byteString.length;
      const u8 = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        u8[i] = byteString.charCodeAt(i);
      }
      const blob: Blob = new Blob([u8], { type: mime });
      if (!blob) throw new Error("Failed to create image blob");

      // Prepare path and upload
      const ts = Date.now();
      const filename = `mn2-step2-summary_${ts}.jpg`;
      const storagePath = `minigame-summary-captures/${filename}`;

      setCaptureStatus('uploading to storage');
      const storageUrl = await uploadFileToStorage(blob, storagePath);

      // Save record to Firestore with required fields
      try {
        await saveMinigameSummaryImageUrl(storageUrl);
      } catch (e) {
        console.warn("saveMinigameSummaryImageUrl failed", e);
      }

      try {
        setLastStorageUrl(storageUrl);
      } catch (_) {}

      setCaptureStatus('done');
      setTimeout(() => setCaptureStatus(null), 2000);

      return storageUrl;
    } catch (e) {
      console.warn("captureAndUpload error", e);
      try {
        const msg = e && (e as any).message ? (e as any).message : String(e);
        setCaptureError(msg);
      } catch (_) {}
      setCaptureStatus(null);
      throw e;
    } finally {
      // restore any hidden elements
      try {
        if (_hiddenBackup && _hiddenBackup.length) {
          for (const item of _hiddenBackup) {
            try {
              if (item.display === null)
                item.el.style.removeProperty("display");
              else item.el.style.setProperty("display", item.display);
              if (item.visibility === null)
                item.el.style.removeProperty("visibility");
              else item.el.style.setProperty("visibility", item.visibility);
            } catch (_) {}
          }
        }
      } catch (_) {}
    }
  }

  // Manual capture button component (for testing)

  // Minimal cleared UI: no external layout components, no external classes.
  return (
    <div
      className="figma-style1-container figma-style1-ukpack1"
      style={{
        boxSizing: "border-box",
        color: "#000",
        padding: "clamp(8px, 3vw, 16px)",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <header style={{ marginBottom: 12, textAlign: "center" }}>
        <h1 style={{ margin: "0 auto", fontSize: 22, fontWeight: 700 }}>
          นโยบายที่คุณเสนอ
        </h1>
      </header>

      <main
        id="mn2-step2-content"
        style={{
          flex: 1,
          overflow: "auto",
          paddingBottom: "calc(env(safe-area-inset-bottom, 12px) + 120px)",
        }}
      >
        {summaryCards && summaryCards.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {summaryCards.map((card, i) => (
              <section
                key={i}
                style={{
                  border: "1px solid #0A2A66",
                  borderRadius: 12,
                  padding: 12,
                  background: "#fff",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 8 }}>
                  <div
                    style={{ fontSize: 16, fontWeight: 700, color: "#0A2A66" }}
                  >
                    {card.priority}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: 12,
                    justifyItems: "center",
                  }}
                >
                  {card.beneficiaries.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        width: "100%",
                        maxWidth: 88,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        position: "relative",
                      }}
                    >
                      {/* icon only - no visible label */}
                      {((b as any).iconSrc as string) ? (
                        <img
                          src={(b as any).iconSrc}
                          alt=""
                          style={{
                            width: 64,
                            height: 64,
                            objectFit: "contain",
                            borderRadius: 8,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: 8,
                            background: "#eee",
                          }}
                          aria-hidden
                        />
                      )}
                      {/* Hidden text for screen readers only */}
                      <span
                        style={{
                          position: "absolute",
                          width: 1,
                          height: 1,
                          padding: 0,
                          margin: -1,
                          overflow: "hidden",
                          clip: "rect(0, 0, 0, 0)",
                          border: 0,
                        }}
                      >
                        {b.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p>No summary cards available</p>
        )}
      </main>

      {/* Debug UI: only show when explicitly enabled via ?debug=1 or localStorage 'mn2.captureDebug' === '1' */}
      {typeof window !== 'undefined' && (new URLSearchParams(window.location.search).get('debug') === '1' || (typeof localStorage !== 'undefined' && localStorage.getItem('mn2.captureDebug') === '1')) ? (
        <div style={{ marginTop: 12, marginBottom: 12, textAlign: "center" }}>
          {previewDataUrl ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Capture preview</div>
              <img src={previewDataUrl} alt="summary preview" style={{ maxWidth: "320px", width: "100%", height: "auto", border: "1px solid #ddd", borderRadius: 8 }} />
              {lastStorageUrl ? (
                <a href={lastStorageUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#0A2A66" }}>{lastStorageUrl}</a>
              ) : null}
            </div>
          ) : captureError ? (
            <div style={{ color: "crimson", fontSize: 14 }}>{captureError}</div>
          ) : (
            <div style={{ fontSize: 13, color: "#666" }}>No preview available yet</div>
          )}
          <div style={{ marginTop: 8 }}>
            <Uk1Button onClick={async () => {
              try {
                setCaptureError(null);
                await initFirebase();
                const url = await captureAndUpload();
                console.log("manual capture result:", url);
              } catch (e) {
                try {
                  const msg = e && (e as any).message ? (e as any).message : String(e);
                  setCaptureError(msg);
                } catch (_) {}
                console.warn("manual capture failed", e);
              }
            }} style={{ height: 40, borderRadius: 28, padding: "0 16px" }}>
              Capture again
            </Uk1Button>
          </div>
        </div>
      ) : null}

      <footer
        style={{
          position: "sticky",
          bottom: "calc(env(safe-area-inset-bottom, 12px))",
          marginTop: 24,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: 325,
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "0 var(--space-sm)",
            boxSizing: "border-box",
          }}
        >
          <Uk1Button
            onClick={() => {
              try {
                handleEndGame();
              } catch (_) {}
            }}
            style={{ height: 53, borderRadius: 40 }}
          >
            ใช่, ไปต่อ
          </Uk1Button>
          <Uk1Button
            variant="secondary"
            onClick={() => {
              try {
                navigateToPage && (navigateToPage("/minigame-mn1") as any);
              } catch (_) {}
            }}
            style={{ height: 53, borderRadius: 40 }}
          >
            ไม่ใช่, ลองอีกครั้ง
          </Uk1Button>
        </div>
      </footer>
    </div>
  );
};

export default Step2_Summary;
