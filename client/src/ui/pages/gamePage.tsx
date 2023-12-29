import React, { useEffect, useState, useRef } from "react";
import { serialize, useHost, useGuest } from "esdeka/react";

import { ClickWrapper } from "../clickWrapper";
import { useDojo } from "../../hooks/useDojo";
import { padHex } from "../../utils";
import { useStore } from "../../store/store";
import { Account } from "starknet";
import { SpellcrafterGame, gameStateFromGameValuesQuery } from "../../game/gameState";
import { FamiliarDisplay, Region, RegionDisplay } from "../../game/config";


import cardDefs from '../../generated/cards.json';

type Command = { action: string, data: any };

export const GamePage: React.FC = () => {
    const {
        account: { account },
        networkLayer: {
            systemCalls: { forage, interact, summon, send, reapAction, sacrifice },
            network: { graphSdk }
        },
    } = useDojo();

    // used to communicate with ren-js iframe
    const channel = "spellcrafter";
    const renClientRef = useRef<HTMLIFrameElement>(null);

    const { call } = useHost(renClientRef, channel);

    const { subscribe } = useGuest(renClientRef, "command");

    const currentGameId = useStore((state) => state.currentGameId);

    const [gameState, setGameState] = useState<SpellcrafterGame>();
    const [selectedRegion, setSelectedRegion] = useState<number>(0);
    const [selectedFamiliar, setSelectedFamiliar] = useState<number>(0);
    const [selectedCard, setSelectedCard] = useState<number | undefined>(undefined);


    useEffect(() => {
        const unsubscribe = subscribe(event => {
            const { action, data } = event.data.action.payload as Command;
            console.log("Message from ren:", event);
            switch(action) {
                case "forage":
                    doForage(account, data as number);
                    break;
                case "reap":
                    doReapAction(account, data as number);
                    break;
            }
        });
        return () => {
            unsubscribe();
        };
    }, [account, subscribe]);

    useEffect(() => {
        if(!gameState) return;
        call(serialize(gameState))
    }, [gameState, call])

    const doForage = async (account: Account, region: number) => {
        if (!currentGameId) return;
        await forage(account, parseInt(currentGameId), region);
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

    const doReapAction = async (account: Account, familiar_id: number) => {
        if (!currentGameId) return;
        await reapAction(account, parseInt(currentGameId), familiar_id);
        setTimeout(() => {
            fetchGameData(currentGameId)
        }, 2000)
    }

    const doSacrifice = async (account: Account, familiar_id: number) => {
        if (!currentGameId) return;
        await sacrifice(account, parseInt(currentGameId), familiar_id);
        setTimeout(() => {
            fetchGameData(currentGameId)
        }, 2000)
    }

    const fetchGameData = async (currentGameId: string | null) => {
        if (!currentGameId) return;
        const game_id = padHex(currentGameId);
        const { data: valueData } = await graphSdk().getGameData({ game_id });

        const gameState = await gameStateFromGameValuesQuery(valueData);

        setGameState(gameState);
        setSelectedCard(gameState?.cards[0][0]);
    }

    useEffect(() => {
        fetchGameData(currentGameId);
    }, [currentGameId]);

    console.log(gameState);

    return (
        <ClickWrapper className="centered-div" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "20px" }}>
            <iframe ref={renClientRef} src="http://localhost:5174/spellcrafter" width="100%" height="500"></iframe>

            <div>
                Now playing game {currentGameId}
            </div>

            <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { call(serialize(gameState)) }}>
                Send State
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
                <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value as any as Region)}>
                    {Object.values(Region).filter(value => typeof value === 'number').map((value: any, index) => {
                        return <option value={value as Region} key={index}>{RegionDisplay[value as Region]}</option>
                    })}
                </select>
                <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doForage(account, selectedRegion) }}>
                    Forage
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
                <select value={selectedCard} onChange={e => setSelectedCard(parseInt(e.target.value))}>
                    {gameState?.cards.map(([cardId, _], index) => {
                        return <option value={cardId} key={index}>{cardDefs[cardId].name}</option>
                    })}
                </select>
                <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doInteract(account, selectedCard) }}>
                    Add to Spell
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
                <select value={selectedFamiliar} onChange={e => setSelectedFamiliar(e.target.value as any as Region)}>
                    {Object.values(Region).filter(value => typeof value === 'number').map((value: any, index) => {
                        return <option value={value as Region} key={index}>{FamiliarDisplay[value as Region]}</option>
                    })}
                </select>
                <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doSummon(account, selectedFamiliar) }}>
                    Summon
                </div>
            </div>

            <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doSend(account, gameState?.familiar?.id) }}>
                Send Familiar
            </div>

            <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doReapAction(account, gameState?.familiar?.id) }}>
                Reap
            </div>

            <div className="global-button-style" style={{ fontSize: "2.4cqw", padding: "5px 10px", fontFamily: "OL", fontWeight: "100" }} onClick={() => { doSacrifice(account, gameState?.familiar?.id) }}>
                Sacrifice Familiar
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

        </ClickWrapper>
    );
};
