import React, { useEffect, useState } from "react";

import { ClickWrapper } from "../clickWrapper";
import { Phase } from "../phaseManager";
import { useDojo } from "../../hooks/useDojo";
import { Account, num } from "starknet";
import { padHex } from "../../utils";
import { useStore } from "../../store/store";

interface LobbyPageProps {
    setUIState: React.Dispatch<Phase>;
}

export const LobbyPage: React.FC<LobbyPageProps> = ({ setUIState }) => {

    const {
        account: { account },
        networkLayer: {
            systemCalls: { createGame },
            network: { graphSdk }
        },
    } = useDojo();

    const [games, setGames] = useState<Array<string>>([]);

    const fetchPlayerGames = async (account: Account) => {
        const { data } = await graphSdk().getPlayersGames({ address: padHex(account.address) });

        const gameIds: Array<string> = [];
        data.ownerModels?.edges?.forEach((edge) => {
            if(edge?.node?.entity?.models?.length && edge?.node?.entity?.models?.length > 1) return; // A familiar has a Owner and Familiar component but a game just has an Owner. This filters out the former
            edge?.node?.entity?.models?.forEach((model) => {
                switch (model?.__typename) {
                    case "Owner":
                        gameIds.push(model?.entity_id);
                        break;
                    default:
                        break;
                }
            })
        })
        console.log(gameIds);
        setGames(gameIds)
    }

    useEffect(() => {
        fetchPlayerGames(account);
    }, [account]);


    const newGame = async (account: Account) => {
        //create a new game by sending a transaction
        await createGame(account);
        setTimeout(() => {
            fetchPlayerGames(account)
        }, 2000)
    }

    const setCurrentGameId = useStore((state) => state.setCurrentGameId);

    const setGameAndPlay = (gameId: string) => {
        setCurrentGameId(gameId);
        setUIState(Phase.GAME);
    }

    return (
        <ClickWrapper className="centered-div" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "20px" }}>

        {games.map((gameId, index) => {
            return (<div key={index} className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { setGameAndPlay(gameId) }}>
                Play {gameId}
            </div>)
        })}

      <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { newGame(account)}}>
          New Game
      </div>      

    </ClickWrapper>
    );
};
