//libs
import { useState } from "react";

import { LoginPage } from "./pages/loginPage";
import { LobbyPage } from "./pages/lobbyPage";
import { GamePage } from "./pages/gamePage";

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
      {phase === Phase.GAME &&<GamePage/>}
    </>
  );
};

export default PhaseManager;
