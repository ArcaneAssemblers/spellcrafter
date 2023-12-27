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

    useEffect(() => {
        const fetchPlayerGames = async () => {
            const { data } = await graphSdk().getPlayersGames({ address: padHex(account.address) });

            const gameIds: Array<string> = [];
            data.ownerModels?.edges?.forEach((edge) => {
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

        fetchPlayerGames();
    }, [graphSdk, account]);


    const newGame = async (account: Account) => {
        //create a new game by sending a transaction
        await createGame(account);
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
