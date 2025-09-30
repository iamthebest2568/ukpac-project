export async function renderFinalImageBlob(baseSrc: string, maskSrc: string | null, colorHex: string | null, targetWidth?: number | null, targetHeight?: number | null): Promise<Blob | null> {
  try {
    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
      });

    const baseImg = await loadImage(baseSrc);
    const naturalW = baseImg.naturalWidth || 800;
    const naturalH = baseImg.naturalHeight || 600;
    const width = targetWidth && targetWidth > 0 ? targetWidth : naturalW;
    const height = targetHeight && targetHeight > 0 ? targetHeight : naturalH;

    // create main canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    // draw base image scaled to target dimensions
    try {
      ctx.drawImage(baseImg, 0, 0, width, height);
    } catch (e) {
      // fallback: attempt drawing with intrinsic size
      try {
        ctx.drawImage(baseImg, 0, 0, naturalW, naturalH);
      } catch (ee) {
        console.warn("drawImage failed", ee);
      }
    }

    // apply color mask if present and color selected
    if (maskSrc && colorHex) {
      try {
        const maskImg = await loadImage(maskSrc);

        // quick diagnostic: measure mask opaque coverage
        try {
          const tmp = document.createElement("canvas");
          tmp.width = width;
          tmp.height = height;
          const tctx = tmp.getContext("2d");
          if (tctx) {
            tctx.drawImage(maskImg, 0, 0, width, height);
            try {
              const id = tctx.getImageData(0, 0, width, height).data;
              let opaque = 0;
              for (let i = 0; i < id.length; i += 4) {
                if (id[i + 3] > 16) opaque++;
              }
              const total = width * height || 1;
              const pct = opaque / total;
              console.debug("mask coverage", { width, height, opaque, total, pct });
              // if mask covers nearly entire image (likely invalid), fallback to multiply tint
              if (pct > 0.98 || pct < 0.002) {
                console.warn("mask appears invalid (too large/small). Using multiply tint fallback", pct);
                ctx.save();
                ctx.globalCompositeOperation = "multiply";
                ctx.fillStyle = colorHex;
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
                // done
                return await new Promise<Blob | null>((resolve) => {
                  try {
                    canvas.toBlob((b) => resolve(b), "image/png");
                  } catch (err) {
                    console.warn("canvas.toBlob failed", err);
                    resolve(null);
                  }
                });
              }
            } catch (e) {
              // getImageData can throw if CORS tainted; ignore diagnostics then
            }
          }
        } catch (dE) {
          // ignore diagnostics
        }

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

        // draw color overlay onto main canvas using multiply blend so base detail remains
        try {
          ctx.save();
          ctx.globalCompositeOperation = "multiply";
          ctx.drawImage(colorCanvas, 0, 0, width, height);
          ctx.restore();
        } catch (e) {
          // fallback to direct draw
          ctx.drawImage(colorCanvas, 0, 0, width, height);
        }
      } catch (e) {
        console.warn("apply color mask failed", e);
      }
    }

    // If no mask but colorHex present, try multiply blend fallback
    else if (!maskSrc && colorHex) {
      try {
        ctx.fillStyle = colorHex;
        ctx.globalCompositeOperation = "multiply";
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
      } catch (e) {
        console.warn("apply color fallback failed", e);
      }
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
}

// Simple scaler: load base image and scale to target dims, returns PNG blob
export async function scaleImageToBlob(baseSrc: string, targetWidth: number, targetHeight: number): Promise<Blob | null> {
  try {
    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
      });

    const img = await loadImage(baseSrc);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    // draw image centered with contain behavior
    const ratio = Math.min(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight);
    const drawW = img.naturalWidth * ratio;
    const drawH = img.naturalHeight * ratio;
    const dx = (targetWidth - drawW) / 2;
    const dy = (targetHeight - drawH) / 2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,targetWidth,targetHeight);
    ctx.drawImage(img, dx, dy, drawW, drawH);

    return await new Promise<Blob | null>((resolve) => {
      try {
        canvas.toBlob((b) => resolve(b), 'image/png');
      } catch (e) {
        console.warn('scaleImageToBlob toBlob failed', e);
        resolve(null);
      }
    });
  } catch (e) {
    console.warn('scaleImageToBlob failed', e);
    return null;
  }
}
