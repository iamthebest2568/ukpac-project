import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { database } from "../../../firebaseConfig";
import { ref, push, set } from "firebase/database";

// State interface
export interface BusDesignState {
  chassis: string | null;
  seating: {
    totalSeats: number;
    specialSeats: number;
    childElderSeats: number;
    standingPlaces: number;
  };
  amenities: string[];
  paymentMethods: string[];
  doorConfig: {
    doorChoice: "1" | "2" | null;
    hasRamp: boolean;
    highLow: boolean;
  };
  exterior: {
    color: string | null;
    customText: string | null;
  };
  serviceInfo: {
    routeName: string | null;
    area: string | null;
    frequency: string | null;
  };
  userEngagement: {
    feedback?: string | null;
    shared?: boolean;
  };
}

export type BusDesignAction =
  | { type: "SET_CHASSIS"; payload: string }
  | { type: "UPDATE_SEATING"; payload: Partial<BusDesignState["seating"]> }
  | { type: "TOGGLE_AMENITY"; payload: string }
  | { type: "SET_PAYMENT_METHODS"; payload: string[] }
  | { type: "SET_DOOR_CONFIG"; payload: Partial<BusDesignState["doorConfig"]> }
  | { type: "SET_EXTERIOR"; payload: Partial<BusDesignState["exterior"]> }
  | {
      type: "SET_SERVICE_INFO";
      payload: Partial<BusDesignState["serviceInfo"]>;
    }
  | { type: "SET_FEEDBACK"; payload: string }
  | { type: "RESET" };

const initialState: BusDesignState = {
  chassis: null,
  seating: {
    totalSeats: 40,
    specialSeats: 0,
    childElderSeats: 0,
    standingPlaces: 0,
  },
  amenities: [],
  paymentMethods: [],
  doorConfig: { doorChoice: null, hasRamp: false, highLow: false },
  exterior: { color: null, customText: null },
  serviceInfo: { routeName: null, area: null, frequency: null },
  userEngagement: { feedback: null, shared: false },
};

function reducer(
  state: BusDesignState,
  action: BusDesignAction,
): BusDesignState {
  switch (action.type) {
    case "SET_CHASSIS":
      return { ...state, chassis: action.payload };
    case "UPDATE_SEATING":
      return { ...state, seating: { ...state.seating, ...action.payload } };
    case "TOGGLE_AMENITY":
      return state.amenities.includes(action.payload)
        ? {
            ...state,
            amenities: state.amenities.filter((a) => a !== action.payload),
          }
        : { ...state, amenities: [...state.amenities, action.payload] };
    case "SET_PAYMENT_METHODS":
      return { ...state, paymentMethods: action.payload };
    case "SET_DOOR_CONFIG":
      return {
        ...state,
        doorConfig: { ...state.doorConfig, ...action.payload },
      };
    case "SET_EXTERIOR":
      return { ...state, exterior: { ...state.exterior, ...action.payload } };
    case "SET_SERVICE_INFO":
      return {
        ...state,
        serviceInfo: { ...state.serviceInfo, ...action.payload },
      };
    case "SET_FEEDBACK":
      return {
        ...state,
        userEngagement: { ...state.userEngagement, feedback: action.payload },
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

type ContextType = {
  state: BusDesignState;
  dispatch: React.Dispatch<BusDesignAction>;
  submitDesignToFirebase: (stateOverride?: BusDesignState) => Promise<string>;
};

const BusDesignContext = createContext<ContextType | undefined>(undefined);

export const BusDesignProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    reducer,
    loadStateFromSession() || initialState,
  );

  async function submitDesignToFirebase(
    stateOverride?: BusDesignState,
    imageBlob?: Blob | null,
  ) {
    const payload = {
      ...(stateOverride || state),
      timestamp: Date.now(),
      // include session id and PDPA flag & project for server-side mapping and CSV
      sessionID: (typeof window !== 'undefined' ? (() => {
        try { return sessionStorage.getItem('ukPackSessionID') || null; } catch { return null; }
      })() : null),
      PDPA: (typeof window !== 'undefined' ? (() => {
        try { return sessionStorage.getItem('pdpa_accepted') === 'true'; } catch { return false; }
      })() : false),
      project: (typeof window !== 'undefined' ? (() => {
        try {
          const p = window.location && window.location.pathname;
          if (!p) return null;
          if (String(p).startsWith('/beforecitychange')) return 'beforecitychange';
          if (String(p).startsWith('/mydreambus') || String(p).startsWith('/ukpack2')) return 'mydreambus';
          return null;
        } catch { return null; }
      })() : null),
    } as any;

    // If an image blob is provided, upload to Firebase Storage and attach URL
    try {
      if (imageBlob) {
        try {
          // dynamic import to avoid double-initialization issues
          const mod = await import("../../../lib/firebase");
          const path = `designs/mydreambus_${Date.now()}_${Math.random().toString(36).slice(2, 9)}.png`;
          const url = await mod.uploadFileToStorage(imageBlob, path);
          payload.imageUrl = url;
          try {
            const { addDesignImageUrlToFirestore } = await import(
              "../../../lib/firebase"
            );
            await addDesignImageUrlToFirestore(url);
          } catch (_) {}
        } catch (e) {
          console.warn("Image upload failed", e);
        }
      }
    } catch (e) {}

    // Guard: if Firebase Realtime Database isn't initialized, persist locally
    try {
      if (!database) {
        // fallback: persist to localStorage for later submission
        try {
          const MAX_PENDING = 50;

          const isQuotaExceeded = (err: any) => {
            if (!err) return false;
            const name = err.name || (err as any).code;
            if (typeof name === "string") {
              return (
                name === "QuotaExceededError" ||
                name === "QUOTA_EXCEEDED_ERR" ||
                name === "NS_ERROR_DOM_QUOTA_REACHED"
              );
            }
            const msg = (err && (err.message || "")) as string;
            return /quota/i.test(msg) || /exceeded/i.test(msg);
          };

          const pendingRaw =
            localStorage.getItem("mydreambus_pending_submissions") || "[]";
          const pending = Array.isArray(JSON.parse(pendingRaw))
            ? (JSON.parse(pendingRaw) as any[])
            : [];

          // Serialize helper that will try to keep payload small. If the serialized size
          // is large, return a minimized payload to avoid filling localStorage with heavy data.
          const minimizeSubmission = (full: any) => {
            try {
              return {
                chassis: full.chassis || null,
                timestamp: full.timestamp || Date.now(),
                color: full.exterior?.color || null,
                imageUrl:
                  typeof full.imageUrl === "string" ? full.imageUrl : undefined,
                seating: { totalSeats: full.seating?.totalSeats ?? undefined },
                overlayCount: Array.isArray(full.overlayLabels)
                  ? full.overlayLabels.length
                  : undefined,
              };
            } catch (_) {
              return { timestamp: full.timestamp || Date.now() };
            }
          };

          const trySerialize = (obj: any) => {
            try {
              const s = JSON.stringify(obj);
              if (s.length > 120 * 1024)
                return JSON.stringify(minimizeSubmission(obj));
              return s;
            } catch (_) {
              return JSON.stringify(minimizeSubmission(obj));
            }
          };

          // Ensure we don't grow beyond MAX_PENDING — drop oldest entries first
          while (pending.length >= MAX_PENDING) pending.shift();

          const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          // Prefer storing a minimized payload if the full one is large
          let itemToStore: any = { id, payload };
          try {
            const serializedFull = JSON.stringify({ id, payload });
            if (serializedFull.length > 120 * 1024) {
              itemToStore = { id, payload: minimizeSubmission(payload) };
            }
          } catch (_) {
            itemToStore = { id, payload: minimizeSubmission(payload) };
          }

          pending.push(itemToStore);

          // Attempt to persist, and on quota errors try trimming oldest entries and retrying
          try {
            localStorage.setItem(
              "mydreambus_pending_submissions",
              trySerialize(pending),
            );
          } catch (e) {
            // If quota exceeded, iteratively remove oldest items and retry
            if (isQuotaExceeded(e)) {
              let lastError: any = e;
              while (pending.length > 1) {
                try {
                  pending.shift();
                  localStorage.setItem(
                    "mydreambus_pending_submissions",
                    trySerialize(pending),
                  );
                  // success
                  console.warn(
                    "Firebase database not initialized — saved submission locally after trimming oldest entries",
                    id,
                  );
                  return id;
                } catch (innerErr) {
                  lastError = innerErr;
                  if (!isQuotaExceeded(innerErr)) break; // some other error
                }
              }
              // If we get here, we couldn't persist even after trimming
              console.error(
                "Failed to persist locally after trimming",
                lastError,
              );
              throw lastError;
            }

            // If not a quota error, rethrow
            throw e;
          }

          console.warn(
            "Firebase database not initialized — saved submission locally",
            id,
          );
          return id;
        } catch (err) {
          console.error("Failed to persist locally", err);
          throw new Error(
            `Firebase not initialized and local persistence failed: ${(err && (err.message || err)) || err}`,
          );
        }
      }

      const submissionsRef = ref(database, "submissions");
      const newRef = push(submissionsRef);
      await set(newRef, payload);
      return newRef.key || "";
    } catch (err) {
      console.error("submitDesignToFirebase failed", err);
      // rethrow to allow callers to handle user-visible errors
      throw err;
    }
  }

  return (
    <BusDesignContext.Provider
      value={{ state, dispatch, submitDesignToFirebase }}
    >
      {children}
    </BusDesignContext.Provider>
  );
};

export function useBusDesign() {
  const ctx = useContext(BusDesignContext);
  if (!ctx)
    throw new Error("useBusDesign must be used within BusDesignProvider");
  return ctx;
}

function loadStateFromSession(): BusDesignState | null {
  try {
    // Migrate legacy sessionStorage keys/values safely (do not overwrite existing new keys)
    try {
      const LEGACY_KEY_MAP: Record<string, string> = {
        "สแกนจ่าย 2": "ตู้อัตโนมัติ",
      };

      // Migrate design.payment (array of labels)
      try {
        const raw = sessionStorage.getItem("design.payment");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const migrated = parsed.map((it) => LEGACY_KEY_MAP[it] || it);
            if (JSON.stringify(migrated) !== JSON.stringify(parsed)) {
              // Backup original then write migrated
              try {
                sessionStorage.setItem("design.payment.bak", raw);
              } catch (_) {}
              try {
                sessionStorage.setItem(
                  "design.payment",
                  JSON.stringify(migrated),
                );
              } catch (_) {}
            }
          }
        }
      } catch (_) {}

      // Migrate overlayIconMap keys
      try {
        const rawMap = sessionStorage.getItem("design.overlayIconMap");
        if (rawMap) {
          const map = JSON.parse(rawMap) as Record<string, string>;
          let changed = false;
          for (const oldKey of Object.keys(LEGACY_KEY_MAP)) {
            if (Object.prototype.hasOwnProperty.call(map, oldKey)) {
              const newKey = LEGACY_KEY_MAP[oldKey];
              if (!map[newKey]) {
                map[newKey] = map[oldKey];
              }
              delete map[oldKey];
              changed = true;
            }
          }
          if (changed) {
            try {
              sessionStorage.setItem("design.overlayIconMap.bak", rawMap);
            } catch (_) {}
            try {
              sessionStorage.setItem(
                "design.overlayIconMap",
                JSON.stringify(map),
              );
            } catch (_) {}
          }
        }
      } catch (_) {}
    } catch (_) {}

    const chassis = sessionStorage.getItem("design.chassis");
    const seatingRaw = sessionStorage.getItem("design.seating");
    const amenitiesRaw = sessionStorage.getItem("design.amenities");
    const paymentRaw = sessionStorage.getItem("design.payment");
    const doorsRaw = sessionStorage.getItem("design.doors");
    const color = sessionStorage.getItem("design.color");
    const slogan = sessionStorage.getItem("design.slogan");
    const feedback = sessionStorage.getItem("design.feedback");

    const seating = seatingRaw ? JSON.parse(seatingRaw) : undefined;
    const amenities = amenitiesRaw ? JSON.parse(amenitiesRaw) : undefined;
    const paymentMethods = paymentRaw ? JSON.parse(paymentRaw) : undefined;
    const doorConfig = doorsRaw ? JSON.parse(doorsRaw) : undefined;

    return {
      chassis: chassis || null,
      seating: seating || initialState.seating,
      amenities: amenities || [],
      paymentMethods: paymentMethods || [],
      doorConfig: doorConfig || initialState.doorConfig,
      exterior: { color: color || null, customText: slogan || null },
      serviceInfo: initialState.serviceInfo,
      userEngagement: { feedback: feedback || null, shared: false },
    } as BusDesignState;
  } catch (e) {
    return null;
  }
}
