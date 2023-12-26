import React, { useEffect } from "react";
import { MAP_HEIGHT,MAP_WIDTH } from "../utils/settingsConstants";

import { ClickWrapper } from "./clickWrapper";
import { Phase } from "./phaseManager";
import { useDojo } from "../hooks/useDojo";
import { setClientCameraComponent, setClientCameraEntityIndex, setClientClickPositionComponent, setClientGameComponent, truncateString } from "../utils";


interface LoginPageProps {
  setUIState: React.Dispatch<Phase>;
}

export const LoginComponent: React.FC<LoginPageProps> = ({ setUIState }) => {

  //for now we use a burner account
  const {
    account: { account, create, isDeploying, clear,select,list },
    networkLayer: {
      network: { clientComponents },
    },
  } = useDojo();

  //create the client game comp for the start of the loading
  const createGameClient = async (guest: boolean) => {
    setClientGameComponent(1, 1, 1, guest, 0, clientComponents);
    setClientClickPositionComponent(1, 1, 1, 1, clientComponents);
    setClientCameraComponent(MAP_WIDTH / 2, MAP_HEIGHT / 2, clientComponents);
    setClientCameraEntityIndex(MAP_WIDTH / 2, MAP_HEIGHT / 2, clientComponents);
    setUIState(Phase.LOADING); 
  }


  return (
    <ClickWrapper className="centered-div" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "20px" }}>

      <div style={{ fontFamily: "Zelda", fontWeight: "100", backgroundColor: "white", padding: "5px 10px", fontSize: "3.5cqw", borderRadius: "5px", textAlign: "center", marginBottom: "20px" }}>
        Rising Revenant
      </div>

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { createGameClient(false)}}>
          Wallet Login {truncateString(account.address,5)}
      </div>

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { createGameClient(true)}}>
        Guest Login
      </div>

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={create}>
        {isDeploying ? "deploying burner" : "create burner"}
      </div>

      <select onChange={(e) => select(e.target.value)}>
          {list().map((account, index) => {
            return (
              <option value={account.address} key={index}>
                {account.address}
              </option>
            );
          })}
          i
      </select>

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={clear}>
        delete burners
      </div>
      <img src="LOGO_WHITE.png" style={{ width: "20%", height: "20%", marginTop: "20px" }} />
    </ClickWrapper>
  );
};
