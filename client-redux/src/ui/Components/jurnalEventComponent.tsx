import React, { useEffect, useState } from "react";
import {
    EntityIndex,
    Has,
    HasValue,
    getComponentValueStrict,
    getComponentValue
} from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";

import "./ComponentsStyles/JurnalEventStyles.css";

import { MenuState } from "../Pages/gamePhaseManager";

import { ClickWrapper } from "../clickWrapper";
import { useDojo } from "../../hooks/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GAME_CONFIG_ID } from "../../utils/settingsConstants";


interface JuornalEventProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}


export const JurnalEventComponent: React.FC<JuornalEventProps> = ({ setMenuState }) => {

    const {
        networkLayer: {
            network: { contractComponents, clientComponents },
        },
    } = useDojo();

    const openJurnal = () => {
        setMenuState(MenuState.REV_JURNAL);
    };

    //do we want the ones that have their event already confirmed to go?
    const ownOutpost = useEntityQuery([HasValue(clientComponents.ClientOutpostData, { owned: true, event_effected: true })]);

    const clientGameData = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));
    const lastEvent = getComponentValue(contractComponents.WorldEvent, getEntityIdFromKeys([BigInt(clientGameData.current_game_id), BigInt(clientGameData.current_event_drawn)]))

    return (
        <div className="jurnal-event-container">
            <div className="jurnal-event-component-grid">
                <div className="jurnal-event-component-grid-title">
                    <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                        <h2 style={{ fontFamily: "Zelda", fontWeight: "100", fontSize: "1.8vw" }}>REVENANT JOURNAL</h2>
                    </div>
                </div>
                <ClickWrapper className="jurnal-event-component-grid-enlarge center-via-flex">
                    <img className="pointer" onClick={() => openJurnal()} src="LOGO_WHITE.png" alt="Enlarge" style={{ height: "80%", width: "80%" }} />
                </ClickWrapper>
                <div className="jurnal-event-component-grid-event-data">
                    {lastEvent !== undefined ?
                        (<>
                            <h2 style={{ fontSize: "1.7vw", marginBottom: "3%" }}>Outpost Event #{clientGameData.current_event_drawn}</h2>
                            <h4 style={{ margin: "0px", fontSize: "1.1vw" }}>Radius: {lastEvent.radius}</h4>
                            <h4 style={{ margin: "0px", fontSize: "1.1vw" }}>Type: {"null"}</h4>
                            <h4 style={{ margin: "0px", fontSize: "1.1vw" }}>Position: X: {lastEvent.x}  || Y: {lastEvent.y}</h4>
                        </>)
                        :
                        (<>
                            <h2 style={{ fontSize: "1.7vw", marginBottom: "3%" }}>No event yet</h2>
                            <h4 style={{ margin: "0px", fontSize: "1.1vw" }}></h4>
                            <h4 style={{ margin: "0px", fontSize: "1.1vw" }}></h4>
                            <h4 style={{ margin: "0px", fontSize: "1.1vw" }}></h4>
                        </>)}
                </div>
                <div className="jurnal-event-component-grid-outpost-data">
                    <h2 style={{ margin: "0px", marginBottom: "2%", fontSize: "1.7vw" }}>Your Outposts Hit</h2>
                    {clientGameData.guest ? <h2>Log in to see your outpost that have been hit</h2> :

                        <ClickWrapper className="outpost-hit-list-container" >
                            {ownOutpost.map((outpostId: EntityIndex) => (
                                <ListElement
                                    key={outpostId}
                                    entityIndex={outpostId}
                                    contractComponents={contractComponents}
                                />
                            ))}
                        </ClickWrapper>
                    }
                </div>
            </div>
        </div>
    );
};

const ListElement: React.FC<{ entityIndex: EntityIndex, contractComponents: any }> = ({ entityIndex, contractComponents }) => {
    const [outpostData, setOutpostData] = useState({
        id: 0,
        x: 0,
        y: 0,
    });
    const [lifes, setLifes] = useState(0);

    const contractOutpostData = getComponentValueStrict(contractComponents.Outpost, entityIndex);

    useEffect(() => {

        setOutpostData({
            id: Number(contractOutpostData.entity_id),
            x: contractOutpostData.x,
            y: contractOutpostData.y,
        });

        setLifes(contractOutpostData.lifes);
    }, []);

    return (
        <>
            <h3 style={{ textDecoration: lifes === 0 ? 'line-through' : 'none', margin: "0px", fontSize: "1.2vw" }}>
                Outpost ID: {outpostData.id} || X: {outpostData.x}, Y: {outpostData.y}
            </h3>
        </>
    );
};
