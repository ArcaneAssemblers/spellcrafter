import React, { useEffect, useState } from "react";

import { ClickWrapper } from "../clickWrapper";
import { Phase } from "../phaseManager";
import { useDojo } from "../../hooks/useDojo";
import { Account, num } from "starknet";
import { padHex } from "../../utils";
import { useStore } from "../../store/store";

import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';

import headerImageUrl from './concept-art.png';

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
            if (edge?.node?.entity?.models?.length && edge?.node?.entity?.models?.length > 1) return; // A familiar has a Owner and Familiar component but a game just has an Owner. This filters out the former
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
        <Stack gap={3}>

        <Image src={headerImageUrl} rounded fluid/>


            {games.map((gameId, index) => {
                return (<Button onClick={() => { setGameAndPlay(gameId) }}>
                    Play {gameId}
                </Button>)
            })}

            <Button onClick={() => { newGame(account) }}>
                New Game
            </Button>

        </Stack>
    );
};
