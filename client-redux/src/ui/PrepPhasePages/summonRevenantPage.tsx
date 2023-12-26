//libs
import React, { useEffect, useState } from "react";
import { useDojo } from "../../hooks/useDojo";
import { CreateRevenantProps } from "../../dojo/types";
import { PrepPhaseStages } from "./prepPhaseManager";

// comps/elements
import { HasValue, getComponentValueStrict, Has } from "@latticexyz/recs";
import { useEntityQuery, useComponentValue } from "@latticexyz/react";

import "./PagesStyles/BuyingPageStyle.css"

import { ClickWrapper } from "../clickWrapper";
import { getEntityIdFromKeys } from "@dojoengine/utils";

import CounterElement from "../Elements/counterElement";
import { setClientGameComponent } from "../../utils";
import { GAME_CONFIG_ID } from "../../utils/settingsConstants";

interface BuyRevenantPageProps {
    setMenuState: React.Dispatch<PrepPhaseStages>;
}

const IMAGES = ["./revenants/1.png", "./revenants/2.png", "./revenants/3.png", "./revenants/4.png", "./revenants/5.png"]

export const BuyRevenantPage: React.FC<BuyRevenantPageProps> = ({ setMenuState }) => {
    const [revenantNumber, setRevenantNumber] = useState(5);
    const [revenantCost, setRevenantCost] = useState(10);

    const [freeRevs, setFreeRevs] = useState<number>(10);

    const [backgroundImage, setBackgroundImage] = useState("");

    const {
        account: { account },
        networkLayer: {
            network: { contractComponents, clientComponents },
            systemCalls: { create_revenant },
        },
    } = useDojo();

    const ownReveants = useEntityQuery([HasValue(contractComponents.Outpost, { owner: account.address })]);

    const clientGameComp = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));

    const gameComponent = getComponentValueStrict(contractComponents.Game, getEntityIdFromKeys([BigInt(clientGameComp.current_game_id)]));
    const gameEntityCounter = useComponentValue(contractComponents.GameEntityCounter, getEntityIdFromKeys([BigInt(clientGameComp.current_game_id)]))

    // at the start choose from the random images to load in 
    useEffect(() => {
        setRevenantCost(Number(gameComponent.revenant_init_price));

        const randomImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
        setBackgroundImage(`${randomImage}`);
    }, []);

    useEffect(() => {

        console.error("IS THIS REALLY GETTING CALLED OMGOMFOFMOFMFOMFMO")

        setFreeRevs(Number(gameComponent.max_amount_of_revenants) - Number(gameEntityCounter.revenant_count));
    
    }, [gameEntityCounter]);


    // utility functions
    const summonRev = async (num: number) => {

        const game_id: number = clientGameComp.current_game_id;

        for (let index = 0; index < num; index++) {
            const createRevProps: CreateRevenantProps = {
                account: account,
                game_id: game_id
            };

            await create_revenant(createRevProps);
        }
    };
    const switchToGuest = async () => {
        setClientGameComponent(clientGameComp.current_game_state, clientGameComp.current_game_id, clientGameComp.current_block_number, true, clientGameComp.current_event_drawn, clientComponents);
    };

    return (
        <div className="game-page-container" style={{aspectRatio:"31/16", display: "flex", flexDirection: "row", color: "white" }}>
            <img className="page-img" src={`${backgroundImage}`} alt="testPic" />
            
            <div style={{ height: "100%", margin:"0px 5%", width: "90%", position: "relative", display: "flex", flexDirection: "column" }}>
                <div style={{ height: "20%", width: "100%", position: "relative" }}></div>
                <ClickWrapper style={{ height: "50%", width: "100%", position: "relative", display:"flex", justifyContent:"center", flexDirection:"column" }}>

                <h2 className="main-content-header">SUMMON A REVENANT</h2>
                    {freeRevs > 0 ? (
                    <>
                        <CounterElement value={revenantNumber} setValue={setRevenantNumber} containerStyleAddition={{maxWidth:"30%"}} additionalButtonStyleAdd={{padding:"2px", boxSizing:"border-box"}} textAddtionalStyle={{fontSize:"2cqw"}}/>
                        <div className="global-button-style" style={{ width: "fit-content", fontSize: "1.3cqw", padding: "5px 10px", fontWeight: "100" }} onMouseDown={() => { summonRev(revenantNumber) }}>Summon (Tot: {revenantNumber * revenantCost} $Lords)</div>
                    </>)
                    :
                        (<>
                            {ownReveants.length === 0 ? 
                            (<>
                                <div className="global-button-style" style={{ width: "fit-content", fontSize: "1.3cqw", padding: "5px 10px", fontWeight: "100" }} onMouseDown={() => { switchToGuest()}}>No Revenants left to summon and you own none, Join as a guest</div>
                            </>) 
                            : 
                            (<>
                                <div className="global-button-style" style={{ width: "fit-content", fontSize: "1.3cqw", padding: "5px 10px", fontWeight: "100" }} onMouseDown={() => { setMenuState(PrepPhaseStages.BUY_REIN);}}>No Revenants left to summon, continue to reinforcement page</div>
                            </>)}
                        </>)
                    }

                </ClickWrapper>
                <div style={{ height: "20%", width: "100%", position: "relative" }}></div>

                <div style={{ height: "10%", width: "100%", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: "100", fontFamily: "OL", color: "white", fontSize:"1.4rem" }}> 1 Revenant = {revenantCost} $LORDS</div>
                    {ownReveants.length > 0 && 
                        <ClickWrapper onMouseDown={() => { setMenuState(PrepPhaseStages.BUY_REIN); }} className="global-button-style"
                            style={{ padding: "5px 10px", fontSize: "1.3cqw" }}
                        > Buy Reinforcements

                            <img className="embedded-text-icon" src="Icons/Symbols/right_arrow.svg" alt="Sort Data" onMouseDown={() => { }} />
                        </ClickWrapper> 
                        }
                </div>
            </div>
        </div>
    )
}
