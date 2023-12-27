import React, { useEffect } from "react";

import { ClickWrapper } from "../clickWrapper";
import { Phase } from "../phaseManager";
import { useDojo } from "../../hooks/useDojo";
import { truncateString } from "../../utils";
import { Account, num } from "starknet";
import { padHex } from "../../utils";

interface LobbyPageProps {
  setUIState: React.Dispatch<Phase>;
}

export const LobbyPage: React.FC<LobbyPageProps> = ({ setUIState }) => {

  //for now we use a burner account
  const {
    account: { account },
    networkLayer: {
      systemCalls: { create_game },
      network: { graphSdk }
    },
  } = useDojo();

  useEffect(() => {
    const fetchPlayerGames = async () => {
       const response = await graphSdk().getPlayersGames({ address: padHex(account.address) });
       console.log(response.data);
    }
  
    fetchPlayerGames();
  }, [graphSdk, account]);


  const newGame = async (account: Account) => {
    //create a new game by sending a transaction
    const game = await create_game(account);
  }


  return (
    <ClickWrapper className="centered-div" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "20px" }}>

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { newGame(account)}}>
          Create Game
      </div>      

    </ClickWrapper>
  );
};
