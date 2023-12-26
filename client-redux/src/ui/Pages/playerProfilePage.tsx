//libs
import React, { useEffect, useRef, useState } from "react";
import { HasValue, getComponentValueStrict, getComponentValue, EntityIndex, Has } from "@latticexyz/recs";
import { useEntityQuery, useComponentValue } from "@latticexyz/react";
import { useDojo } from "../../hooks/useDojo";
import { ConfirmEventOutpost, ReinforceOutpostProps } from "../../dojo/types";
import { GAME_CONFIG_ID } from "../../utils/settingsConstants";
import { getEntityIdFromKeys } from "@dojoengine/utils";

//styles
import "./PagesStyles/ProfilePageStyles.css";

//elements/components
import { ClickWrapper } from "../clickWrapper";
import PageTitleElement from "../Elements/pageTitleElement";
import { fetchPlayerInfo, namesArray, setClientCameraComponent, setComponentsFromGraphQlEntitiesHM, surnamesArray } from "../../utils";

//pages


/*notes
this component should first query all the outposts that are owned from the player and then send each to the outpostElement type (that has yet to be made) like from the 
examples

needs functionality to move the camera to a certain location and ability to call reinforce dojo function and go to the trade page
*/


// HERE this needs to be put into a grid system not flex

interface ProfilePageProps {
    setUIState: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ setUIState }) => {

    const [reinforcementCount, setReinforcementCount] = useState(0);

    const {
        account: { account },
        networkLayer: {
            network: { contractComponents, clientComponents, graphSdk },
            systemCalls: { reinforce_outpost, confirm_event_outpost }
        },
    } = useDojo();

    const ownedOutpost = useEntityQuery([HasValue(contractComponents.Outpost, { owner: account.address })]);
    const ownedAndInEvent = useEntityQuery([HasValue(clientComponents.ClientOutpostData, { owned: true, event_effected: true })]);

    const clientGameData = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));


    const playerInfo = useComponentValue(contractComponents.PlayerInfo, getEntityIdFromKeys([BigInt(clientGameData.current_game_id), BigInt(account.address)]));

    useEffect(() => {
        const fetchData = async () => {
            
            if (playerInfo === null || playerInfo === undefined) {
                const playerSpecificData = await fetchPlayerInfo(graphSdk, clientGameData.current_game_id, account.address);
                setComponentsFromGraphQlEntitiesHM(playerSpecificData, contractComponents, false);
                return;
            }
    
            setReinforcementCount(playerInfo.reinforcement_count);
        };
    
        fetchData();
    
    }, [playerInfo]);
    
    //test embed needs to be standardized 
    const reinforcementsBalanceDiv = (
        <div className="title-cart-section">
            <h1>
                <img src="reinforcements_logo.png" className="test-embed" alt="" />
                {reinforcementCount}
            </h1>
            <h3>Reinforcement available</h3>
        </div>
    );

    const dividingLine: JSX.Element = (
        <div className="divider"></div>
    )

    const reinforceOutpost = (outpost_id: any, count: number) => {

        const reinforceOutpostProps: ReinforceOutpostProps = {
            account: account,
            game_id: clientGameData.current_game_id,
            count: count,
            outpost_id: outpost_id,
        };

        reinforce_outpost(reinforceOutpostProps);
    }

    const setCameraPos = (x: number, y: number) => {
        setClientCameraComponent(x, y, clientComponents);
    }

    const confirmAllAttackedOutposts = async () => {
        for (let index = 0; index < ownedAndInEvent.length; index++) {
            const element = ownedAndInEvent[index];

            await callSingularEventConfirm(element);
        }
    }

    const callSingularEventConfirm = async (entity_id: EntityIndex) => {
        const confirmEventOutpost: ConfirmEventOutpost = {
            account: account,
            game_id: clientGameData.current_game_id,
            outpost_id: getComponentValueStrict(clientComponents.ClientOutpostData, entity_id).id,
            event_id: clientGameData.current_event_drawn,
        }

        await confirm_event_outpost(confirmEventOutpost);
    }

    return (
        <ClickWrapper className="game-page-container">

            <img className="page-img" src="./assets/Page_Bg/PROFILE_PAGE_BG.png" alt="testPic" />

            <PageTitleElement name={"PROFILE"} rightPicture={"close_icon.svg"} closeFunction={setUIState} right_html_element={reinforcementsBalanceDiv} />

            <div style={{ width: "100%", height: "90%", position: "relative", display: "flex", flexDirection: "row" }}>
                <div style={{ width: "8%", height: "100%" }}></div>

                <div style={{ width: "84%", height: "100%" }}>
                    <div style={{ width: "100%", height: "90%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div className="test-query">
                            {ownedOutpost.map((ownedOutID, index) => (
                                <React.Fragment key={index}>
                                    <ListElement entityId={ownedOutID} contractComponents={contractComponents} clientComponents={clientComponents} reinforce_outpost={reinforceOutpost} currentBalance={reinforcementCount} goHereFunc={setCameraPos} phase={clientGameData.current_game_state} confirmEvent={callSingularEventConfirm} />
                                    {index < ownedOutpost.length - 1 && dividingLine}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div style={{ width: "100%", height: "10%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {clientGameData.current_game_state === 1 ? (<></>) :
                            (
                                <>
                                    <div className="global-button-style" style={{ padding: "5px 5px" }} onClick={() => { setUIState }}>Go To Trade Section</div>
                                    {ownedAndInEvent.length > 0 ? (
                                        <div className="global-button-style" style={{ padding: "5px 5px" }} onClick={() => { confirmAllAttackedOutposts() }}>Confirm All</div>) : (<></>)}
                                </>
                            )}
                    </div>
                </div>

                <div style={{ width: "8%", height: "100%" }}></div>
            </div>
        </ClickWrapper>
    );
};


//this needs to be slimmed down

interface ListElementProps {
    entityId: EntityIndex
    contractComponents: any
    clientComponents: any
    reinforce_outpost: any
    currentBalance: number
    goHereFunc: any
    phase: number
    confirmEvent: any
}

export const ListElement: React.FC<ListElementProps> = ({ entityId, contractComponents, clientComponents, reinforce_outpost, currentBalance, goHereFunc, phase, confirmEvent }) => {
    const [buttonIndex, setButtonIndex] = useState<number>(0)
    const [amountToReinforce, setAmountToReinforce] = useState<number>(1)
    const [heightValue, setHeight] = useState<number>(0)

    const [name, setName] = useState<string>("Name")
    const [surname, setSurname] = useState<string>("Surname")

    const [id, setId] = useState<string>("5")
    const [xCoord, setXCoord] = useState<number>(5)
    const [yCoord, setYCoord] = useState<number>(5)

    const [shieldNum, setShieldNum] = useState<number>(5)
    const [reinforcements, setReinforcements] = useState<number>(20)

    const clickWrapperRef = useRef<HTMLDivElement>(null);

    const outpostData = getComponentValueStrict(contractComponents.Outpost, entityId);
    const revenantData = getComponentValueStrict(contractComponents.Revenant, entityId);
    const clientOutpostData = getComponentValueStrict(clientComponents.ClientOutpostData, entityId);

    useEffect(() => {

        setShieldNum(outpostData.shield);
        setXCoord(outpostData.x);
        setYCoord(outpostData.y);
        setReinforcements(outpostData.lifes);
        setId(outpostData.entity_id.toString());

        setName(namesArray[revenantData.first_name_idx]);
        setSurname(surnamesArray[revenantData.last_name_idx]);
    }, [outpostData]);

    useEffect(() => {
        if (currentBalance === 0) {
            setAmountToReinforce(0);
            return;
        }

        if (amountToReinforce > currentBalance) {
            setAmountToReinforce(currentBalance);
        }
        else if (amountToReinforce < 1) {
            setAmountToReinforce(1);
        }

    }, [amountToReinforce]);

    useEffect(() => {
        const updateHeight = () => {
            if (clickWrapperRef.current) {
                setHeight((clickWrapperRef.current.offsetWidth / 24) * 4);

            }
        };

        window.addEventListener('resize', updateHeight);

        updateHeight();

        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    const clickWrapperStyle: React.CSSProperties = {
        height: `${heightValue}px`,
        width: '99%',
    };

    return (
        <div ref={clickWrapperRef} className={`grid-container ${clientOutpostData.event_effected && outpostData.lifes > 0 ? ' profile-page-attacked-style' : ''}`}    style={clickWrapperStyle}    onMouseEnter={() => setButtonIndex(1)} onMouseLeave={() => setButtonIndex(0)}>
            <div className="pfp">
                <img src="Rev_PFP_11.png" className="child-img" />
            </div>
            <div className="name" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}> <h3 style={{ textAlign: "center", fontFamily: "OL", fontWeight: "100", color: "white", fontSize: "0.9cqw", whiteSpace: "nowrap" }}>{name} {surname}</h3></div>
            <div className="otp">
                <img src="test_out_pp.png" className="child-img" />
            </div>
            <div className="sh shields-grid-container" style={{ boxSizing: "border-box" }}>
                {Array.from({ length: shieldNum }).map((_, index) => (
                    <img key={index} src="SHIELD.png" className="img-full-style" />
                ))}
            </div>
            <div className="info" style={{ display: "flex", gridColumn: clientOutpostData.event_effected ? "12/22" : "12/25" }}>
                <div style={{ flex: "1", height: "100%", boxSizing: "border-box" }}>
                    <div style={{ width: "100%", height: "50%", }}> <h3 style={{ textAlign: "center", fontFamily: "OL", fontWeight: "100", color: "white", fontSize: "0.9cqw" }}>Outpost ID: <br /><br />{id}</h3>   </div>
                    <div style={{ width: "100%", height: "50%", }}></div>
                </div>
                <div onMouseEnter={() => { setButtonIndex(3) }} onMouseLeave={() => { setButtonIndex(1) }} style={{ flex: "1", height: "100%", boxSizing: "border-box" }}>
                    <div style={{ width: "100%", height: "50%", }}> <h3 style={{ textAlign: "center", fontFamily: "OL", fontWeight: "100", color: "white", fontSize: "0.9cqw" }}>Coordinates: <br /><br />X: {xCoord}, Y: {yCoord}</h3>    </div>
                    <div style={{ width: "100%", height: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {buttonIndex === 3 && phase === 2  && <div className="global-button-style" style={{ height: "50%", padding: "5px 10px", boxSizing: "border-box", fontSize: "0.6cqw", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => goHereFunc(xCoord, yCoord)}> <h2>Go here</h2></div>}
                    </div>
                </div>
                <div onMouseEnter={() => { setButtonIndex(4) }} onMouseLeave={() => { setButtonIndex(1) }} style={{ flex: "1", height: "100%", boxSizing: "border-box" }}>
                    <div style={{ width: "100%", height: "50%", }}><h3 style={{ textAlign: "center", fontFamily: "OL", fontWeight: "100", color: "white", fontSize: "0.9cqw" }}>Reinforcements: <br /><br />{reinforcements}</h3> </div>
                    <div style={{ width: "100%", height: "50%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                        {buttonIndex === 4 && (<>
                            <div style={{ height: "50%", width: "100%", padding: "5%", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                <div className="global-button-style" style={{ height: "100%", textAlign: "center", boxSizing: "border-box" }}>
                                    <img src="/minus.png" alt="minus" style={{ width: "100%", height: "100%" }} onClick={() => setAmountToReinforce(amountToReinforce - 1)} />
                                </div>
                                <h2 style={{ color: "white", fontSize: "2cqw" }}>{amountToReinforce}</h2>
                                <div className="global-button-style" style={{ height: "100%", textAlign: "center", boxSizing: "border-box" }}>
                                    <img src="/plus.png" alt="plus" style={{ width: "100%", height: "100%" }} onClick={() => setAmountToReinforce(amountToReinforce + 1)} />
                                </div>
                            </div>
                            <div className="global-button-style" style={{ height: "50%", textAlign: "center", padding: "5px 10px", boxSizing: "border-box", fontSize: "0.6cqw", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => reinforce_outpost(clientOutpostData.id, amountToReinforce)}>  <h2>Reinforce</h2></div>
                        </>)}
                    </div>
                </div>
            </div>

            {clientOutpostData.event_effected && outpostData.lifes > 0 &&
                <div className="sell" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {buttonIndex !== 0 && phase === 2 && <div className="global-button-style" style={{ padding: "5px 10px", fontSize: "0.9cqw" }} onClick={() => { confirmEvent(entityId) }}>Confirm Event</div>}
                </div>
            }
        </div>
    );
};






