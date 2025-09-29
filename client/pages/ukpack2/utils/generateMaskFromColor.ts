export function hexToRgb(hex: string) {
  const s = hex.replace('#', '');
  const bigint = parseInt(s.length === 3 ? s.split('').map(c=>c+c).join('') : s, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

export async function generateMaskFromColor(src: string, targetHex: string, tolerance = 60): Promise<string | null> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = () => resolve(im);
      im.onerror = (e) => reject(e);
      im.src = src;
    });

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return null;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h);
    const { r: tr, g: tg, b: tb } = hexToRgb(targetHex);

    // Create empty mask canvas (white where match, transparent elsewhere)
    const out = ctx.createImageData(w, h);
    const srcArr = data.data;
    const dstArr = out.data;

    let opaqueCount = 0;
    const totalPixels = w * h;
    for (let i = 0; i < srcArr.length; i += 4) {
      const r = srcArr[i];
      const g = srcArr[i + 1];
      const b = srcArr[i + 2];
      const a = srcArr[i + 3];
      if (a === 0) {
        // fully transparent -> keep transparent
        dstArr[i] = 0;
        dstArr[i + 1] = 0;
        dstArr[i + 2] = 0;
        dstArr[i + 3] = 0;
        continue;
      }
      const dr = r - tr;
      const dg = g - tg;
      const db = b - tb;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (dist <= Math.max(0, Math.min(255, tolerance))) {
        // keep area (white, opaque)
        dstArr[i] = 255;
        dstArr[i + 1] = 255;
        dstArr[i + 2] = 255;
        dstArr[i + 3] = 255;
        opaqueCount++;
      } else {
        // transparent elsewhere
        dstArr[i] = 0;
        dstArr[i + 1] = 0;
        dstArr[i + 2] = 0;
        dstArr[i + 3] = 0;
      }
    }

    // If mask is almost fully transparent or almost fully opaque, treat as invalid to avoid applying a full-rect color overlay
    const opaqueRatio = opaqueCount / Math.max(1, totalPixels);
    if (opaqueRatio < 0.001 || opaqueRatio > 0.95) {
      console.warn(`generateMaskFromColor: mask rejected due to opaqueRatio=${opaqueRatio.toFixed(4)}`);
      return null;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.putImageData(out, 0, 0);
    const url = canvas.toDataURL("image/png");
    return url;
  } catch (e) {
    console.warn('generateMaskFromColor failed', e);
    return null;
  }
}
