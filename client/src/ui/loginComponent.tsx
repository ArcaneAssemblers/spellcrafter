import React, { useEffect } from "react";
import { MAP_HEIGHT,MAP_WIDTH } from "../utils/settingsConstants";

import { ClickWrapper } from "./clickWrapper";
import { Phase } from "./phaseManager";
import { useDojo } from "../hooks/useDojo";
import { truncateString } from "../utils";


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
    setUIState(Phase.LOADING); 
  }


  return (
    <ClickWrapper className="centered-div" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "20px" }}>

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

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { createGameClient(false)}}>
          Login as {truncateString(account.address,5)}
      </div>

    </ClickWrapper>
  );
};
