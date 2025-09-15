/**
 * UK PACK - MN1 Mini-Game Flow Container
 * Manages the first step of the Policy Designer mini-game (priorities selection)
 */

import { useState } from "react";

import Flow_MiniGame_MN01 from "./Flow_MiniGame_MN01";

interface Flow_MiniGame_MN1Props {
  sessionID: string | null;
  onComplete: (data: any) => void;
  onBack?: () => void;
}

// Delegate MN1 flow to the new MN01 implementation so the old steps are discarded
const Flow_MiniGame_MN1 = ({ sessionID, onComplete, onBack }: Flow_MiniGame_MN1Props) => {
  return (
    <Flow_MiniGame_MN01 sessionID={sessionID} onComplete={onComplete} onBack={onBack} />
  );
};

export default Flow_MiniGame_MN1;
