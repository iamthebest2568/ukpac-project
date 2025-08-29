/**
 * Flow Navigation Hook
 * Manages navigation between flow sequences (mini-games)
 */

import { useSession } from "./useSession";

interface UseFlowNavigationReturn {
  handleMN1Complete: (data: any) => void;
  handleMN2Complete: (data: any) => void;
  handleMN3Complete: (data: any) => void;
  handleEndSequenceComplete: (data: any) => void;
}

export const useFlowNavigation = (): UseFlowNavigationReturn => {
  const { setFlowData, navigateToPage } = useSession();

  const handleMN1Complete = (data: any) => {
    console.log("=== handleMN1Complete ===");
    console.log("Received data from MN1:", data);
    const newFlowData = { mn1: data };
    console.log("Setting flowData to:", newFlowData);
    setFlowData((prev) => {
      const updated = { ...prev, mn1: data };
      console.log("Updated flowData:", updated);
      return updated;
    });
    navigateToPage("/minigame-mn2");
    console.log("=== End handleMN1Complete ===");
  };

  const handleMN2Complete = (data: any) => {
    setFlowData((prev) => ({ ...prev, mn2: data }));
    navigateToPage("/ask04");
  };

  const handleMN3Complete = (data: any) => {
    setFlowData((prev) => ({ ...prev, mn3: data }));
    navigateToPage("/ask04-budget");
  };

  const handleEndSequenceComplete = (data: any) => {
    setFlowData((prev) => ({ ...prev, endSequence: data }));
    navigateToPage("/"); // Return to index after completing the journey
  };

  return {
    handleMN1Complete,
    handleMN2Complete,
    handleMN3Complete,
    handleEndSequenceComplete,
  };
};
