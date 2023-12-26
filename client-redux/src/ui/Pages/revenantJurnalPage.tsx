//libs
import React, { useEffect, useState } from "react";
import { MenuState } from "./gamePhaseManager";
import { Has, getComponentValueStrict, EntityIndex } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";

//styles
import "./PagesStyles/RevenantJurnalPageStyles.css";
import PageTitleElement from "../Elements/pageTitleElement";
import { ClickWrapper } from "../clickWrapper";
import { useDojo } from "../../hooks/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GAME_CONFIG_ID } from "../../utils/settingsConstants";

//elements/components

//pages

/*notes
    this will be divided in two sections, left section will be a text talking about the event and bla bla bla

    right side will have two section one counter like section that will allow the user to navigate through the events happend
    this means we need a query to save all the events that have happened

    and below the data of all the outposts that have been hit with the ones that are dead have --- on them and maybe, show lifes pos owner 
    this will be done with a query to get all the outposts first and then a query to the desired event
*/

interface RevenantjurnalPageProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

interface EventDataState {
    x: number;
    y: number;
    radius:number;
}

export const RevenantJurnalPage: React.FC<RevenantjurnalPageProps> = ({ setMenuState }) => {

    const [outpostHitList, setOutpostHitList] = useState<EntityIndex[]>([]);
    const [selectedEventIndex, setSelectedEventIndex] = useState<number>(1);
    const [currentlySelectedEventData, setCurrentlySelectedEventData] = useState<EventDataState>({x:0,y:0,radius:0});

    const {
        networkLayer: {
            network: { contractComponents, clientComponents },
        },
    } = useDojo();

    const clientGameData = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));  //get the client game data
    const gameData = getComponentValueStrict(contractComponents.GameEntityCounter, getEntityIdFromKeys([BigInt(clientGameData.current_game_id)]))  //fetch the entity counter

    const allOutposts = useEntityQuery([Has(contractComponents.Outpost)]); //get all the outpost saved
    const allEvents = useEntityQuery([Has(contractComponents.WorldEvent)]); //get all the events saved

    // this should happen at the start
    useEffect(() => {
        const eventId = gameData.event_count;
        setSelectedEventIndex(eventId);

        if (eventId === 0) return;

        const outpostHitList: EntityIndex[] = [];
        const selectedEventData = getComponentValueStrict(contractComponents.WorldEvent, getEntityIdFromKeys([ BigInt(clientGameData.current_game_id), BigInt(eventId)]));

        const eventRadius = selectedEventData.radius;
        const eventX = selectedEventData.x;
        const eventY = selectedEventData.y;

        const data:EventDataState ={
            x: eventX,
            y: eventY,
            radius: eventRadius,
        }

        setCurrentlySelectedEventData(data);

        for (let index = 0; index < allOutposts.length; index++) {
            const element = allOutposts[index];
            
            const outpost = getComponentValueStrict(contractComponents.Outpost, element);

            const outpostX = outpost.x;
            const outpostY = outpost.y;

            const distance = Math.sqrt(Math.pow(outpostX - eventX, 2) + Math.pow(outpostY - eventY, 2));
            if (distance <= eventRadius) {
                outpostHitList.push(element);
            }
        }

        setOutpostHitList(outpostHitList);
    }, []);

    //called on change of the index
    useEffect(() => {

        if (selectedEventIndex < 1)
        {
            setSelectedEventIndex(allEvents.length);
            return;
        }
        else if  (selectedEventIndex > allEvents.length)
        {
            setSelectedEventIndex(1);
            return;
        }   

        const newIndex = selectedEventIndex;
        if (newIndex === 0) return;

        const outpostHitList: EntityIndex[] = [];
        const selectedEventData = getComponentValueStrict(contractComponents.WorldEvent, getEntityIdFromKeys([ BigInt(clientGameData.current_game_id), BigInt(newIndex)]));

        const eventRadius = selectedEventData.radius;
        const eventX = selectedEventData.x;
        const eventY = selectedEventData.y;

        const data:EventDataState = {
            x: eventX,
            y: eventY,
            radius: eventRadius,
        }

        setCurrentlySelectedEventData(data);

        for (let index = 0; index < allOutposts.length; index++) {
            const element = allOutposts[index];
            
            const outpost = getComponentValueStrict(contractComponents.Outpost, element);

            const outpostX = outpost.x;
            const outpostY = outpost.y;

            const distance = Math.sqrt(Math.pow(outpostX - eventX, 2) + Math.pow(outpostY - eventY, 2));
            if (distance <= eventRadius) {
                outpostHitList.push(element);
            }
        }

        setOutpostHitList(outpostHitList);

    }, [selectedEventIndex]);

    const closePage = () => {
        setMenuState(MenuState.NONE);
    };

    return (
        <div className="game-page-container">
            <img className="page-img" src="./assets/Page_Bg/JOURNAL_PAGE_BG.png" alt="testPic" />
            <PageTitleElement name="REVENANT JURNAL" closeFunction={closePage} rightPicture="close_icon.svg" />
            <div style={{ width: "100%", height: "10%", backgroundColor: "red" }}>
            </div>
            <div style={{ width: "100%", height: "80%", position: "relative", display: "flex", flexDirection: "row", color: "white", fontFamily: "OL" }}>
                <div style={{ width: "4%", height: "100%" }}></div>

                {true === true ?
                    (
                        <ClickWrapper className="rev-jurn-page-grid-container">
                            <div className="rev-jurn-page-grid-event-data-count center-via-flex">
                                <div style={{ fontFamily: "OL", fontWeight: "100", fontSize: "1.3vw", textAlign: "center" }}>Event {selectedEventIndex}/{allEvents.length}</div>
                            </div>
                            <div className="rev-jurn-page-grid-left-arrow ">
                                <img src="Icons/Symbols/left_arrow.svg" onMouseDown={() => setSelectedEventIndex(selectedEventIndex - 1)} className="pointer" alt="" style={{ width: "100%", height: "100%" }} />
                            </div>
                            <div className="rev-jurn-page-grid-right-arrow">
                                <img src="Icons/Symbols/right_arrow.svg" onMouseDown={() => setSelectedEventIndex(selectedEventIndex + 1)} className="pointer" alt="" style={{ width: "100%", height: "100%" }} />
                            </div>
                            <div className="rev-jurn-page-grid-position-data center-via-flex">
                                <div style={{ fontFamily: "OL", fontWeight: "100", fontSize: "1vw", textAlign: "center" }}>Position <br /> X:{currentlySelectedEventData.x || 0} || Y:{currentlySelectedEventData.y || 0}</div>
                            </div>
                            <div className="rev-jurn-page-grid-radius-data center-via-flex">
                                <div style={{ fontFamily: "OL", fontWeight: "100", fontSize: "1vw", textAlign: "center" }}>Radius: <br /> {currentlySelectedEventData.radius || 0}</div>
                            </div>
                            <div className="rev-jurn-page-grid-type-data center-via-flex">
                                <div style={{ fontFamily: "OL", fontWeight: "100", fontSize: "1vw", textAlign: "center" }}>Type: <br /> {"Null"} </div>
                            </div>
                            <div className="rev-jurn-page-grid-outpost-hit-table">
                                <div style={{ width: "100%", height: "100%", marginTop:"20px" }}>
                                    <div style={{ width: "100%", height: "10%", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", fontSize:"1.7vw"}}>
                                        OUTPOST HIT LIST
                                    </div>
                                        <ClickWrapper  style={{ width: "100%", height: "80%", overflowY: "auto", scrollbarGutter: "stable both-edges" }}>
                                        {outpostHitList.map((outpostHit, index) => (
                                            <ListElement key={index} entityId={outpostHit} clientComponents={clientComponents} contractComponents={contractComponents} />
                                        ))}

                                    </ClickWrapper>
                                </div>
                            </div>

                        </ClickWrapper>
                    ) : (
                        <div className="center-via-flex" style={{ width: "52%", height: "100%" }}>
                            No events have happened yet
                        </div>
                    )}

                <div style={{ width: "4%", height: "100%" }}></div>
                <div style={{ width: "40%", height: "100%", paddingRight: "10px" }}>
                    <h1 style={{ margin: "0px" }}>LOREM IPSUM TITLE</h1>
                    <h3> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged</h3>
                    <h3> It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</h3>
                </div>
            </div>
        </div>
    );
};

const ListElement: React.FC<{ entityId: EntityIndex, clientComponents: any, contractComponents: any }> = ({ entityId, clientComponents, contractComponents }) => {
  
    const [outpostId, setOutpostId] = useState<string>("404");
    const [outpostOwner, setOutpostOwner] = useState<string>("0x2347...23");

    const [outpostCoordinates, setOutpostCoordinates] = useState<{ x: number, y: number }>({ x: 404, y: 404 });

    useEffect(() => {

        const getOutpostClientData = getComponentValueStrict(clientComponents.ClientOutpostData, entityId);
        const getOutpostContractData = getComponentValueStrict(contractComponents.Outpost, entityId);

        setOutpostId(getOutpostClientData.id);

        if (getOutpostClientData.owned) {
            setOutpostOwner("You");
        }
        else {
            setOutpostOwner(getOutpostContractData.owner.toString());
        }

        setOutpostCoordinates({ x: getOutpostContractData.x, y: getOutpostContractData.y });

    }, [entityId]);

    return (
        <div className="rev-jurn-outpost-element-grid-container">
            <div style={{gridColumn:"1/3"}}>Outpost Id: {outpostId}</div>
            <div>||</div>
            <div>X: {outpostCoordinates.x}, Y: {outpostCoordinates.y}</div>
            <div>||</div>
            <div style={{gridColumn:"6/8"}}>Owner: {outpostOwner}</div>
        </div>
    );
};