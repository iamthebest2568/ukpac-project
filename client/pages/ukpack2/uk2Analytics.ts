import { logEvent } from "../../services/dataLogger.js";

let initialized = false;

function safeText(node: HTMLElement) {
  return (node.textContent || "").trim().slice(0, 200);
}

function datasetToObj(ds: DOMStringMap) {
  const obj: Record<string, string> = {};
  for (const k of Object.keys(ds)) {
    obj[k] = ds[k] as string;
  }
  return obj;
}

export function initUkpack2Analytics() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  // Page view
  logEvent({ event: "PAGE_VIEW", payload: { path: window.location.pathname } });

  // Click delegation
  document.addEventListener(
    "click",
    (e) => {
      try {
        const target = e.target as HTMLElement;
        if (!target) return;
        const el =
          target.closest &&
          (target.closest("[data-uk2-ignore]") as HTMLElement);
        if (el) return; // ignore

        const btn = (target.closest &&
          target.closest(
            "button, a, [role=button], [data-uk2-event]",
          )) as HTMLElement;
        if (!btn) return;

        const tag = btn.tagName.toLowerCase();
        const id = btn.id || null;
        const classes = btn.className || null;
        const text = safeText(btn);
        const ds = datasetToObj(btn.dataset || {});
        const definedEvent =
          btn.dataset && (btn.dataset["uk2Event"] || btn.dataset["event"]);
        const evName = definedEvent || `CLICK_${tag.toUpperCase()}`;

        logEvent({
          event: evName,
          payload: {
            tag,
            id,
            classes,
            text,
            dataset: ds,
            url: window.location.pathname,
          },
        });
      } catch (_) {}
    },
    true,
  );

  // Input changes (mask values by default)
  document.addEventListener(
    "change",
    (e) => {
      try {
        const target = e.target as
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement;
        if (!target) return;
        const tag = target.tagName.toLowerCase();
        const name =
          (target as HTMLInputElement).name || (target as any).id || null;
        const type = (target as HTMLInputElement).type || null;
        const allow =
          target.dataset && target.dataset["uk2AllowValue"] === "true";
        let value: string | null = null;
        if (allow) value = String((target as any).value).slice(0, 500);
        else
          value =
            type === "checkbox" || type === "radio"
              ? String((target as any).checked)
              : "[REDACTED]";

        logEvent({
          event: "INPUT_CHANGE",
          payload: { tag, name, type, value, url: window.location.pathname },
        });
      } catch (_) {}
    },
    true,
  );

  // Form submits
  document.addEventListener(
    "submit",
    (e) => {
      try {
        const form = e.target as HTMLFormElement;
        if (!form) return;
        const id = form.id || null;
        const name = form.getAttribute("name") || null;
        const fields: string[] = [];
        try {
          const elements = Array.from(
            form.elements || ([] as any),
          ) as HTMLInputElement[];
          for (const el of elements) {
            if (el && (el.name || el.id)) fields.push(el.name || el.id);
          }
        } catch (er) {}

        logEvent({
          event: "FORM_SUBMIT",
          payload: { id, name, fields, url: window.location.pathname },
        });
      } catch (_) {}
    },
    true,
  );

  // visibility / session pause/resume already logged in dataLogger
}
