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
            systemCalls: { forage, interact, summon, send },
            network: { graphSdk }
        },
    } = useDojo();

    const currentGameId = useStore((state) => state.currentGameId);

    const [gameState, setGameState] = useState<SpellcrafterGame>();

    const doForage = async (account: Account) => {
        if (!currentGameId) return;
        await forage(account, parseInt(currentGameId), 0);
        setTimeout(() => {
            fetchGameData(currentGameId)
        }, 2000)
    }

    const doInteract = async (account: Account, cardId: number) => {
        if (!currentGameId) return;
        await interact(account, parseInt(currentGameId), cardId);
        setTimeout(() => {
            fetchGameData(currentGameId)
        }, 2000)
    }

    const doSummon = async (account: Account, familiarType: number) => {
        if (!currentGameId) return;
        await summon(account, parseInt(currentGameId), familiarType);
        setTimeout(() => {
            fetchGameData(currentGameId)
        }, 2000)
    }

    const doSend = async (account: Account, familiar_id: number) => {
        if (!currentGameId) return;
        await send(account, parseInt(currentGameId), familiar_id);
        setTimeout(() => {
            fetchGameData(currentGameId)
        }, 2000)
    }

    const fetchGameData = async (currentGameId: string | null) => {
        if (!currentGameId) return;
        const game_id = padHex(currentGameId);
        const { data: valueData } = await graphSdk().getGameData({ game_id });

        const gameState = await gameStateFromGameValuesQuery(valueData);

        // if there is a familiar then fetch the occupied data

        // const { data: occupiedData } = await graphSdk().getOccupied({ entity_id: padHex(currentGameId) });


        setGameState(gameState);
    }

    useEffect(() => {
        fetchGameData(currentGameId);
    }, [currentGameId]);

    console.log(gameState)

    return (
        <ClickWrapper className="centered-div" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "20px" }}>

            <div>
                Now playing {currentGameId}
            </div>

            <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doForage(account) }}>
                Forage
            </div>

            <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doInteract(account, gameState.cards[0][0]) }}>
                Interact
            </div>

            <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doSummon(account, 0) }}>
                Summon
            </div>


            <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doSend(account, gameState?.familiar?.id) }}>
                Send
            </div>

            {/* <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doForage(account)}}>
          Send
      </div>

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doForage(account)}}>
          Sacrifice
      </div> */}

        </ClickWrapper>
    );
};
