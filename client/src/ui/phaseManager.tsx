//libs
import React, { useState, useEffect } from "react";

import { LoginPage } from "./pages/loginPage";
import { LobbyPage } from "./pages/lobbyPage";

export enum Phase {
  LOGIN,
  LOBBY,
  GAME,
}

export const PhaseManager = () => {
  const [phase, setPhase] = useState<Phase>(Phase.LOGIN);

  const setUIState = (state: Phase) => {
    setPhase(state);
  }

  return (
    <>
      {phase === Phase.LOGIN && <LoginPage setUIState={setUIState}/>}
      {phase === Phase.LOBBY &&<LobbyPage setUIState={setUIState}/>}
    </>
  );
};

export default PhaseManager;
