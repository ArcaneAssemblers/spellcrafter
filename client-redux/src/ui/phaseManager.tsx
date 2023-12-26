//libs
import React, { useState, useEffect } from "react";

//components
import { LoadingComponent } from "./loadingComponent";
import { LoginComponent } from "./loginComponent";
import { PrepPhaseManager } from "./PrepPhasePages/prepPhaseManager";
import { GamePhaseManager } from "./Pages/gamePhaseManager";

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

  //phase is right nwo dealt i think by the wrong component, i think after lloading should be the deciding factor

  //to delete
  // useEffect(() => {
  //   const handleKeyPress = (event: KeyboardEvent) => {
  //     switch (event.key) {
  //       case "1":
  //         setPhase(Phase.LOGIN);
  //         break;
  //       case "2":
  //         setPhase(Phase.LOADING);
  //         break;
  //       case "3":
  //         setPhase(Phase.PREP);
  //         break;
  //       case "4":
  //         setPhase(Phase.GAME);
  //         break;
  //       default:
  //         break;
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyPress);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyPress);
  //   };
  // }, [phase]);

  const setUIState = (state: Phase) => {
    setPhase(state);
  }

  return (
    <>
      {phase === Phase.LOGIN && <LoginComponent setUIState={setUIState}/>}
      {phase === Phase.LOADING && <LoadingComponent setUIState={setUIState}/>}
      {phase === Phase.PREP && <PrepPhaseManager setUIState={setUIState}/>}
      {phase === Phase.GAME && <GamePhaseManager />}
    </>
  );
};

export default PhaseManager;
