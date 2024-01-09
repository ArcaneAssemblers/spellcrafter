import React, { useEffect, useState, useRef } from "react";
import { serialize, useHost, useGuest } from "esdeka/react";

import { ClickWrapper } from "../clickWrapper";
import { useDojo } from "../../hooks/useDojo";
import { padHex } from "../../utils";
import { useStore } from "../../store/store";
import { Account } from "starknet";
import { SpellcrafterGame, gameStateFromGameValuesQuery } from "../../game/gameState";
import { FamiliarDisplay, Region, RegionDisplay } from "../../game/config";

import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Ratio from 'react-bootstrap/Ratio';

import cardDefs from '../../generated/cards.json';

type Command = { action: string, data: any };
const MAX_TRIES = 100;
const INTERVAL = 500;

export const GamePage: React.FC = () => {
    const {
        account: { account },
        networkLayer: {
            systemCalls: { forage, interact, summon, send, reapAction, sacrifice, wait },
            network: { graphSdk }
        },
    } = useDojo();

    // used to communicate with ren-js iframe
    const channel = "spellcrafter";
    const renClientRef = useRef<HTMLIFrameElement>(null);
    const connection = useRef(false);
    const [connectionTries, setConnectionTries] = useState(MAX_TRIES);

    const { call } = useHost(renClientRef, channel);

    const { subscribe } = useGuest(renClientRef, "command");

    const currentGameId = useStore((state) => state.currentGameId);

    const [gameState, setGameState] = useState<SpellcrafterGame>();
    const [selectedRegion, setSelectedRegion] = useState<number>(0);
    const [selectedFamiliar, setSelectedFamiliar] = useState<number>(0);
    const [selectedCard, setSelectedCard] = useState<number | undefined>(undefined);

    // Send a connection request to the request
    useEffect(() => {
        if (!gameState) return () => { /* Consistency */ };
        if (connection.current || connectionTries <= 0) {
            return () => { /* Consistency */ };
        }

        call(serialize(gameState));
        const timeout = setTimeout(() => {
            call(serialize(gameState));
            setConnectionTries(connectionTries - 1);
        }, INTERVAL);

        return () => {
            clearTimeout(timeout);
        };
    }, [gameState, call, connectionTries, connection]);

    // whenever the game state changes send it to the ren client
    useEffect(() => {
        if (!gameState) return;
        call(serialize(gameState))
    }, [gameState, call])

    const callThenUpdate = async (f, account, data) => {
        if (!currentGameId) return;
        await f(account, currentGameId, data);
        setTimeout(() => {
            fetchGameData(currentGameId)
        }, 2000)
    };

    useEffect(() => {
        const unsubscribe = subscribe(event => {
            const { action, data } = event.data.action.payload as Command;
            console.log("Message from ren:", event);
            switch (action) {
                case "connected":
                    connection.current = true;
                    break;
                case "forage":
                    callThenUpdate(forage, account, data as number);
                    break;
                case "interact":
                    callThenUpdate(interact, account, data as number);
                    break;
                case "summon":
                    callThenUpdate(summon, account, data as number);
                    break;
                case "send":
                    callThenUpdate(send, account, data as number);
                    break;
                case "sacrifice":
                    callThenUpdate(sacrifice, account, data as number);
                    break;
                case "reap":
                    callThenUpdate(reapAction, account, data as number);
                    break;
                case "wait":
                    callThenUpdate(wait, account, undefined);
                    break;
                default:
                    console.error("Ren client sent unknown action:", action);
            }
        });
        return () => {
            unsubscribe();
        };
    }, [account, subscribe]);

    const fetchGameData = async (currentGameId: string | null) => {
        if (!currentGameId) return;
        const game_id = padHex(currentGameId);
        const { data: valueData } = await graphSdk().getGameData({ game_id });

        const gameState = await gameStateFromGameValuesQuery(valueData);

        setGameState(gameState);
        if (gameState?.cards.length > 0) {
            setSelectedCard(gameState?.cards[0][0]);
        }
    }

    useEffect(() => {
        fetchGameData(currentGameId);
    }, [currentGameId]);

    console.log(gameState);

    return (
        <Stack>

            <Ratio aspectRatio={1080 / 1920}>
                <iframe ref={renClientRef} src={import.meta.env.BASE_URL + "/ren_client/"}></iframe>
            </Ratio>


            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Debug State</Accordion.Header>
                    <Accordion.Body>
                        <div>
                            Now playing game {currentGameId}
                        </div>

                        <div className="card">
                            <pre>Time: {gameState?.time}</pre>
                        </div>

                        <div className="card">
                            <pre>{JSON.stringify(gameState?.stats, null, 2)}</pre>
                        </div>

                        <div className="card">
                            <pre>{JSON.stringify(gameState?.familiar, null, 2)}</pre>
                        </div>

                        <div className="card">
                            {gameState?.cards.map(([id, count]) => {
                                return <p key={id}>{cardDefs[id].name}: {count}</p>
                            })}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Debug Controls</Accordion.Header>
                    <Accordion.Body>
                        <Stack gap={3}>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value as any as Region)}>
                                    {Object.values(Region).filter(value => typeof value === 'number').map((value: any, index) => {
                                        return <option value={value as Region} key={index}>{RegionDisplay[value as Region]}</option>
                                    })}
                                </select>
                                <Button onClick={() => { callThenUpdate(forage, account, selectedRegion) }}>
                                    Forage
                                </Button>
                            </div>

                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <select value={selectedCard} onChange={e => setSelectedCard(parseInt(e.target.value))}>
                                    {gameState?.cards.map(([cardId, _], index) => {
                                        return <option value={cardId} key={index}>{cardDefs[cardId].name}</option>
                                    })}
                                </select>
                                <Button onClick={() => { callThenUpdate(interact, account, selectedCard) }}>
                                    Add to Spell
                                </Button>
                            </div>

                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <select value={selectedFamiliar} onChange={e => setSelectedFamiliar(e.target.value as any as Region)}>
                                    {Object.values(Region).filter(value => typeof value === 'number').map((value: any, index) => {
                                        return <option value={value as Region} key={index}>{FamiliarDisplay[value as Region]}</option>
                                    })}
                                </select>
                                <Button onClick={() => { callThenUpdate(summon, account, selectedFamiliar) }}>
                                    Summon
                                </Button>
                            </div>

                            <Button onClick={() => { callThenUpdate(send, account, gameState?.familiar?.id) }}>
                                Send Familiar
                            </Button>

                            <Button onClick={() => { callThenUpdate(reapAction, account, gameState?.familiar?.id) }}>
                                Reap
                            </Button>

                            <Button onClick={() => { callThenUpdate(sacrifice, account, gameState?.familiar?.id) }}>
                                Sacrifice Familiar
                            </Button>

                            <Button onClick={() => { callThenUpdate(wait, account, undefined) }}>
                                Wait
                            </Button>
                        </Stack>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Stack>
    );
};
