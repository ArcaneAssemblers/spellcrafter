//Libs
import { useEffect, useState } from "react";
import {
    Has,
    getComponentValueStrict,
    HasValue,
    getComponentValue,
    runQuery,
} from "@latticexyz/recs";
import { useEntityQuery, useComponentValue } from "@latticexyz/react";
import { useDojo } from "../../hooks/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { checkAndSetPhaseClientSide, fetchAllOutRevData, fetchAllOwnOutRevData, fetchGameData, fetchPlayerInfo, fetchSpecificEvent, fetchSpecificOutRevData, loadInClientOutpostData, setClientOutpostComponent, setComponentsFromGraphQlEntitiesHM, truncateString } from "../../utils";
import { ClickWrapper } from "../clickWrapper";
import { GAME_CONFIG_ID, getRefreshOwnOutpostDataTimer } from "../../utils/settingsConstants";

//styles
import "./ComponentsStyles/TopBarStyles.css";


//Comps
import Tooltip from '@mui/material/Tooltip';



//Pages



// this is all to redo


interface TopBarPageProps {
    phaseNum: number;
    setGamePhase?: () => void;
}

export const TopBarComponent: React.FC<TopBarPageProps> = ({ setGamePhase, phaseNum }) => {

    const [Jackpot, setJackpot] = useState(0);
    const [playerContribScore, setPlayerContribScore] = useState(0);
    const [playerContribScorePerc, setPlayerContribScorePerc] = useState(0);

    const {
        account: { account },
        networkLayer: {
            network: { contractComponents, clientComponents, graphSdk },
        },
    } = useDojo();

    const outpostQuery = useEntityQuery([Has(contractComponents.Outpost)]);
    const outpostDeadQuery = useEntityQuery([HasValue(contractComponents.Outpost, { lifes: 0 })]);
    const ownOutposts = useEntityQuery([HasValue(clientComponents.ClientOutpostData, { owned: true })]);
    // const playerInfo = useEntityQuery([HasValue(contractComponents.PlayerInfo, { owner: account.address })]);


    const clientQuery = useEntityQuery([Has(clientComponents.ClientGameData)]);
    const entityQuery = useEntityQuery([Has(contractComponents.GameEntityCounter)]);

    const clientGameData = useComponentValue(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));
    const gameEntityCounter = getComponentValueStrict(contractComponents.GameEntityCounter, getEntityIdFromKeys([BigInt(clientGameData.current_game_id)]));
    const gameData = getComponentValueStrict(contractComponents.Game, getEntityIdFromKeys([BigInt(clientGameData.current_game_id)]));

    const playerInfo = useComponentValue(contractComponents.PlayerInfo, getEntityIdFromKeys([BigInt(clientGameData.current_game_id), BigInt(account.address)]));

    useTopBardataLoader();

    useEffect(() => {

        const loadInAllOutpostsPhaseChange = async () => {
            const allOutpostsModels = await fetchAllOutRevData(graphSdk, clientGameData.current_game_id, gameEntityCounter.outpost_count);
            setComponentsFromGraphQlEntitiesHM(allOutpostsModels, contractComponents, true);

            loadInClientOutpostData(clientGameData.current_game_id, contractComponents, clientComponents, account)
        }

        if (phaseNum === 1 && setGamePhase !== undefined) {   // this should only be getting called when the phase goes from prep to game
            if (clientGameData.current_game_state === 2) {
                setGamePhase();

                loadInAllOutpostsPhaseChange()
            }
        }

    }, [clientQuery, entityQuery]);

    useEffect(() => {

        if (playerInfo === null || playerInfo === undefined) { return; }

        setPlayerContribScore(playerInfo.score);
        setPlayerContribScorePerc(Number.isNaN((playerInfo.score / gameEntityCounter.score_count) * 100) ? 0 : (playerInfo.score / gameEntityCounter.score_count) * 100);

    }, [playerInfo]);

    useEffect(() => {

        const updateOwnData = async () => {
            if (clientGameData === 1) { return; }

            for (let index = 0; index < ownOutposts.length; index++) {
                const entity_id = ownOutposts[index];

                const outpostData = getComponentValueStrict(contractComponents.Outpost, entity_id);
                const outpostModelQuery = await fetchSpecificOutRevData(graphSdk, clientGameData.current_game_id, Number(outpostData.entity_id));
                setComponentsFromGraphQlEntitiesHM(outpostModelQuery, contractComponents, false);

                if (clientGameData.current_event_drawn !== 0) {
                    const clientOutpostData = getComponentValueStrict(clientComponents.ClientOutpostData, entity_id);

                    if (outpostData.last_affect_event_id === clientGameData.current_event_drawn) 
                    {
                        setClientOutpostComponent(clientOutpostData.id, clientOutpostData.owned, false, clientOutpostData.selected, clientOutpostData.visible, clientComponents, contractComponents, 1);
                    }
                    else 
                    {
                        const lastEvent = getComponentValue(contractComponents.WorldEvent, getEntityIdFromKeys([BigInt(clientGameData.current_game_id), BigInt(clientGameData.current_event_drawn)]));

                        const outpostX = outpostData.x;
                        const outpostY = outpostData.y;

                        const eventX = lastEvent.x;
                        const eventY = lastEvent.y;
                        const eventRadius = lastEvent.radius;

                        const inRadius = Math.sqrt(Math.pow(outpostX - eventX, 2) + Math.pow(outpostY - eventY, 2)) <= eventRadius;

                        setClientOutpostComponent(clientOutpostData.id, clientOutpostData.owned, inRadius, clientOutpostData.selected, clientOutpostData.visible, clientComponents, contractComponents, 1);
                    }
                }
            }
        }

        updateOwnData();
        const intervalId = setInterval(updateOwnData, getRefreshOwnOutpostDataTimer() * 1000);

        return () => clearInterval(intervalId);
    }, [clientGameData]);

    return (
        <ClickWrapper className="top-bar-grid-container ">
            <div className="top-bar-grid-game-logo center-via-flex">
                <img src="LOGO_WHITE.png" className="game-logo" style={{ height: "100%", aspectRatio: "1/1" }}></img>
            </div>
            <Tooltip title={`Tot score game ${gameEntityCounter.score_count} \n Your score count ${playerContribScore}`}>
                <div className="top-bar-grid-left-text-section center-via-flex">
                    <div style={{ width: "100%", flex: "1" }} className="center-via-flex">
                        <div style={{ fontSize: "1.2vw" }}>Jackpot: {Jackpot} $LORDS </div>
                    </div>
                    <div style={{ width: "100%", flex: "1" }} className="center-via-flex">

                        {clientGameData.current_game_state === 2 && (<>
                            {clientGameData.guest ? (
                                <div style={{ fontSize: "1.2vw", filter: "brightness(70%) grayscale(70%)" }}>Contribution: Log in</div>
                            ) : (
                                <div style={{ fontSize: "1.2vw" }}>Contribution: {playerContribScorePerc}%</div>
                            )}
                        </>
                        )}

                    </div>
                </div>
            </Tooltip>
            <div className="top-bar-grid-right-text-section center-via-flex">
                <div style={{ width: "100%", flex: "1" }} className="center-via-flex">
                    {clientGameData.current_game_id === 1 ?
                        <div style={{ fontSize: "1.2vw" }}>Revenants Summoned: {gameEntityCounter.revenant_count}/{gameData.max_amount_of_revenants}</div>
                        :
                        <div style={{ fontSize: "1.2vw" }}>Revenants Alive: {outpostDeadQuery.length}/{outpostQuery.length}</div>
                    }
                </div>
                <div style={{ width: "100%", flex: "1" }} className="center-via-flex">
                    <div style={{ fontSize: "1.2vw" }}>Reinforcements in game: {gameEntityCounter.remain_life_count + gameEntityCounter.reinforcement_count}</div>
                </div>
            </div>
            <div className="top-bar-grid-game-written-logo">
                <div className="center-via-flex" style={{ height: "100%", width: "100%", backgroundColor: "white", color: "black", borderRadius: "10px", padding: "2px 5px", boxSizing: "border-box" }}>
                    <h2 style={{ fontFamily: "Zelda", fontWeight: "100", fontSize: "2.8vw", whiteSpace: "nowrap" }}>Rising Revenant</h2>
                </div>
            </div>
            <div className="top-bar-grid-address center-via-flex">
                <div style={{ width: "100%", height: "75%" }} className="center-via-flex">
                    {!clientGameData.guest ?
                        <h2 >
                            <img src="argent_logo.png" className="chain-logo"></img>
                            {truncateString(account.address, 5)}
                        </h2> :
                        <div className="global-button-style" style={{ padding: "5px 10px", fontSize: "1.2vw", cursor: "pointer" }} onClick={() => window.location.reload()}>
                            LOG IN
                        </div>
                    }
                </div>
            </div>
        </ClickWrapper>
    );
};








const useTopBardataLoader = (updateInterval = 5000) => {

    const {
        account: { account },
        networkLayer: {
            network: { contractComponents, clientComponents, graphSdk },
            systemCalls: { view_block_count }
        },
    } = useDojo();

    useEffect(() => {

        const updateFunctions = () => {
            checkBlockCount();
            getGameData();
        }

        const getGameData = async () => {

            const clientGameData = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));

            const gameDataQuery = await fetchGameData(graphSdk, clientGameData.current_game_id);
            setComponentsFromGraphQlEntitiesHM(gameDataQuery, contractComponents, false);

            const playerInfoQuery = await fetchPlayerInfo(graphSdk, clientGameData.current_game_id, account.address);
            setComponentsFromGraphQlEntitiesHM(playerInfoQuery, contractComponents, false);

            const entityCount = getComponentValueStrict(contractComponents.GameEntityCounter, getEntityIdFromKeys([BigInt(clientGameData.current_game_id)]));

            const latest_loaded_event = clientGameData.current_event_drawn;
            const latest_onchain_event = entityCount.event_count;

            const initial_event_index_to_load = latest_onchain_event - latest_loaded_event;

            if (initial_event_index_to_load > 0) {
                for (let i = latest_loaded_event; i <= latest_onchain_event; i++) {
                    const eventQuery = await fetchSpecificEvent(graphSdk, clientGameData.current_game_id, i);

                    setComponentsFromGraphQlEntitiesHM(eventQuery, contractComponents, false);
                }
            }
        }

        const checkBlockCount = async () => {
            const blockCount = await view_block_count();
            const clientGameData = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));
            checkAndSetPhaseClientSide(clientGameData.current_game_id, blockCount!, contractComponents, clientComponents);
        };

        updateFunctions();
        const intervalId = setInterval(updateFunctions, updateInterval);

        return () => clearInterval(intervalId);
    }, []);

};


const useTopBarOwnDaraLoader = (updateIntervalSeconds = 15) => {

    const {
        account: { account },
        networkLayer: {
            network: { contractComponents, clientComponents, graphSdk }
        },
    } = useDojo();

    const clientGameData = useComponentValue(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)])).current_game_state


    useEffect(() => {

        console.error("this is a call fromt he client gameoutpotand th top bar thing ")


        const updateOwnData = async () => {

            if (clientGameData === 1) { return; }

            const visibleOutposts = Array.from(runQuery([HasValue(clientComponents.ClientOutpostData, { owned: true })]));

            for (let index = 0; index < visibleOutposts.length; index++) {
                const entity_id = visibleOutposts[index];

                const outpostData = getComponentValueStrict(clientComponents.ClientOutpostData, entity_id);
                const outpostDatadd = getComponentValueStrict(contractComponents.Outpost, entity_id);

                console.error(outpostData);

                console.error(outpostData.entity_id);
                console.error(outpostDatadd.id);

                const outpostModelQuery = await fetchSpecificOutRevData(graphSdk, clientGameData.current_game_id, outpostData.id);
                setComponentsFromGraphQlEntitiesHM(outpostModelQuery, contractComponents, false);

                console.error(`calling the new data ${visibleOutposts.length}`)
                console.error(outpostModelQuery);
            }
        }

        updateOwnData();
        const intervalId = setInterval(updateOwnData, updateIntervalSeconds * 1000);

        return () => clearInterval(intervalId);
    }, [clientGameData]);
};