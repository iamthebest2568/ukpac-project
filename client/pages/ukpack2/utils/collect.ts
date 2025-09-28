export async function sendDesignImageUrl(imageUrl: string) {
  try {
    const endpoint =
      (import.meta as any).env?.VITE_FIREBASE_COLLECT_ENDPOINT ||
      (window as any).FIREBASE_COLLECT_ENDPOINT ||
      "{{FIREBASE_COLLECT_ENDPOINT}}";

    const payload = {
      imageUrl,
      project: "mydreambus",
      pagePath: "/design",
      timestamp: new Date().toISOString(),
    };

    const resp = await fetch(String(endpoint), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "cors",
    });

    if (resp.ok) {
      console.log("✅ Sent imageUrl");
      return true;
    } else {
      const text = await resp.text().catch(() => "");
      console.error("sendDesignImageUrl failed:", resp.status, text);
      return false;
    }
  } catch (e) {
    console.error("sendDesignImageUrl error:", e);
    return false;
  }
}
