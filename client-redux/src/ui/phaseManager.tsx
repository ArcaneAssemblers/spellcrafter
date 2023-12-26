//libs
import React, { useState, useEffect } from "react";

//components
import { LoginComponent } from "./loginComponent";

//notes
/*
    This component will render different pages based on the current phase.
    It may involve loading screens for certain phases.

    // i think this should have a timer if in the prep phase to see if it should go in the next phase
    something along the lines of checking the block count anyway
*/

export enum Phase {
  LOGIN,
  LOADING,
  PREP,
  GAME,
}

export const PhaseManager = () => {
  const [phase, setPhase] = useState<Phase>(Phase.LOGIN);

  const setUIState = (state: Phase) => {
    setPhase(state);
  }

  return (
    <>
      {phase === Phase.LOGIN && <LoginComponent setUIState={setUIState}/>}
      {/* {phase === Phase.GAME && <GamePhaseManager />} */}
    </>
  );
};

export default PhaseManager;
