export function clearDesignStorage(): void {
  try {
    // Remove any keys that belong to the current design flow (prefix `design.`)
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key) continue;
      if (key.startsWith("design.")) keysToRemove.push(key);
    }

    keysToRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch (e) {
    // ignore errors (e.g. sessionStorage not available)
  }
}
