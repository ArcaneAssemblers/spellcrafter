import React, { useEffect, useState } from "react";

import { ClickWrapper } from "../clickWrapper";
import { useDojo } from "../../hooks/useDojo";
import { padHex } from "../../utils";
import { useStore } from "../../store/store";
import { Account } from "starknet";
import { SpellcrafterGame, gameStateFromGameValuesQuery } from "../../game/gameState";


export const GamePage: React.FC = () => {

    const {
        account: { account },
        networkLayer: {
            systemCalls: { forage },
            network: { graphSdk }
        },
    } = useDojo();

    const currentGameId = useStore((state) => state.currentGameId);

    const [gameState, setGameState] = useState<SpellcrafterGame>();

    const doForage = async (account: Account) => {
        //create a new game by sending a transaction
        if (!currentGameId) return;
        await forage(account, parseInt(currentGameId), 0);
    }

    useEffect(() => {
        const fetchGameData = async () => {
            if(!currentGameId) return;
            const { data } = await graphSdk().getGameValues({ game_id: padHex(currentGameId) });
            setGameState(gameStateFromGameValuesQuery(data));
        }

        fetchGameData();
    }, [graphSdk, currentGameId]);

    console.log(gameState)

    return (
        <ClickWrapper className="centered-div" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "20px" }}>

      <div>
          Now playing {currentGameId}
      </div>     

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doForage(account)}}>
          Forage
      </div>    

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doForage(account)}}>
          Interact
      </div>   

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doForage(account)}}>
          Summon
      </div>  

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doForage(account)}}>
          Send
      </div>

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doForage(account)}}>
          Sacrifice
      </div>

    </ClickWrapper>
    );
};
