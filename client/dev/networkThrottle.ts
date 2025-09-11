// Dev-only network throttling helper
// Usage: imported in main.tsx during development only

export interface ThrottleOptions {
  latency?: number; // base ms delay
  jitter?: number; // random additional ms
  enableByDefault?: boolean; // whether enabled by default in dev
}

export function initNetworkThrottle(opts: ThrottleOptions = {}) {
  if (!(import.meta as any).env.DEV) return;
  const { latency = 800, jitter = 300, enableByDefault = false } = opts;
  // Allow opt-out via localStorage
  const local = typeof window !== 'undefined' ? localStorage.getItem('devNetworkThrottle') : null;
  const isEnabled = local === 'on' || (local === null && enableByDefault);

  (window as any).__DEV_NETWORK_THROTTLE = isEnabled;

  (window as any).toggleDevNetworkThrottle = (value?: boolean) => {
    const newVal = typeof value === 'boolean' ? value : !(window as any).__DEV_NETWORK_THROTTLE;
    (window as any).__DEV_NETWORK_THROTTLE = newVal;
    try {
      localStorage.setItem('devNetworkThrottle', newVal ? 'on' : 'off');
    } catch {}
    console.info('Dev network throttle set to', newVal);
    return newVal;
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // Wrap fetch to delay responses
  if (typeof window.fetch === 'function') {
    const origFetch = window.fetch.bind(window);
    window.fetch = async (...args: any) => {
      const responsePromise = origFetch(...args);
      const response = await responsePromise;
      if (!(window as any).__DEV_NETWORK_THROTTLE) return response;
      const wait = latency + Math.floor(Math.random() * jitter);
      await delay(wait);
      return response;
    };
  }

  // Wrap XMLHttpRequest.send to delay sending (affects XHR-based libraries)
  try {
    const XHR = (window as any).XMLHttpRequest;
    if (XHR && XHR.prototype) {
      const origSend = XHR.prototype.send;
      XHR.prototype.send = function (body: any) {
        if (!(window as any).__DEV_NETWORK_THROTTLE) {
          return origSend.call(this, body);
        }
        const wait = latency + Math.floor(Math.random() * jitter);
        const xhr = this as any;
        // Delay the actual send to simulate slow network
        const argsBody = body;
        setTimeout(() => {
          try {
            origSend.call(xhr, argsBody);
          } catch (e) {
            // ignore
          }
        }, wait);
      };
    }
  } catch (e) {
    // ignore if XHR wrap fails
  }

  console.info('Dev network throttle initialized (DEV only). Toggle with window.toggleDevNetworkThrottle()');
}
