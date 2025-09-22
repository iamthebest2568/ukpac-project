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

  async function submitDesignToFirebase(stateOverride?: BusDesignState) {
    const payload = {
      ...(stateOverride || state),
      timestamp: Date.now(),
    } as any;

    // Guard: if Firebase Realtime Database isn't initialized, persist locally
    try {
      if (!database) {
        // fallback: persist to localStorage for later submission
        try {
          const pending = JSON.parse(
            localStorage.getItem("ukpack2_pending_submissions") || "[]",
          );
          const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          pending.push({ id, payload });
          localStorage.setItem(
            "ukpack2_pending_submissions",
            JSON.stringify(pending),
          );
          console.warn(
            "Firebase database not initialized — saved submission locally",
            id,
          );
          return id;
        } catch (err) {
          console.error("Failed to persist locally", err);
          throw new Error(
            "Firebase not initialized and local persistence failed",
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
