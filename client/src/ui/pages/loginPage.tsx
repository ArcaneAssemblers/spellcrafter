import React, { useEffect } from "react";

import { ClickWrapper } from "../clickWrapper";
import { Phase } from "../phaseManager";
import { useDojo } from "../../hooks/useDojo";
import { truncateString } from "../../utils";


interface LoginPageProps {
  setUIState: React.Dispatch<Phase>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setUIState }) => {

  const {
    account: { account, create, isDeploying, clear,select,list },
  } = useDojo();

  //create the client game comp for the start of the loading
  const goToLobby = async () => {
    setUIState(Phase.LOBBY); 
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

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { goToLobby()}}>
          Login as {truncateString(account.address,5)}
      </div>    

    </ClickWrapper>
  );
};
