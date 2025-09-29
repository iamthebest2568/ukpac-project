export async function renderFinalImageBlob(baseSrc: string, maskSrc: string | null, colorHex: string | null): Promise<Blob | null> {
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
    const width = baseImg.naturalWidth || 800;
    const height = baseImg.naturalHeight || 600;

    // create main canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    // draw base
    ctx.drawImage(baseImg, 0, 0, width, height);

    // apply color mask if present and color selected
    if (maskSrc && colorHex) {
      try {
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
