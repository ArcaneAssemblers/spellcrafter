import { useEntityQuery } from "@latticexyz/react";

import "./PagesStyles/DebugPageStyles.css";
import { ClickWrapper } from "../clickWrapper";
import { useDojo } from "../../hooks/useDojo";

import { CreateEventProps } from "../../dojo/types";

import {
  Has,
  getComponentValueStrict,
  getComponentValue
} from "@latticexyz/recs";

import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useState } from "react";
import { GAME_CONFIG_ID } from "../../utils/settingsConstants";


enum TestResults
{
  NONE,
  PASSED,
  WARNING,
  ERROR
}

export const DebugPage = () => {

  const [revenantCheckOutcome, setRevenantCheckOutcome] = useState<TestResults>(TestResults.NONE);
  const [eventCheckOutcome, setEventCheckOutcome] = useState<TestResults>(TestResults.NONE);

  const {
    account: { account },
    networkLayer: {
      network: { contractComponents, clientComponents },
      systemCalls: { create_event }
    },
  } = useDojo();


  //test queries

  const clientCameraEntityQuery = useEntityQuery([Has(clientComponents.ClientCameraPosition)]);
  const clientGameEntityQuery = useEntityQuery([Has(clientComponents.ClientGameData)]);
  const clientClickPosEntityQuery = useEntityQuery([Has(clientComponents.ClientClickPosition)]);
  const clientOutpostEntityQuery = useEntityQuery([Has(clientComponents.ClientOutpostData)]);
  const clientEntityIndexQuery = useEntityQuery([Has(clientComponents.EntityTileIndex)]);

  const outpostEntityQuery = useEntityQuery([Has(contractComponents.Outpost)]);
  const revenantEntityQuery = useEntityQuery([Has(contractComponents.Revenant)]);
  const worldEventEntityQuery = useEntityQuery([Has(contractComponents.WorldEvent)]);
  const gameEntityQuery = useEntityQuery([Has(contractComponents.GameEntityCounter)]);
  const gameTrackerEntityQuery = useEntityQuery([Has(contractComponents.GameTracker)]);
  const gameEntityCounterEntityQuery = useEntityQuery([Has(contractComponents.GameEntityCounter)]);


  const clientGameData = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));
  const game_id = clientGameData.current_game_id;

  const gameEntityCounter = getComponentValueStrict(contractComponents.GameEntityCounter, getEntityIdFromKeys([BigInt(game_id)]));

  const revenantSanityCheck = () => {
    let passed = TestResults.PASSED;
    console.log("STARTING REVENANTS DATA SANITY CHECK")

    if (outpostEntityQuery.length !== clientOutpostEntityQuery.length) {
      passed = TestResults.ERROR;
      console.error("There is a descrepency in outpost and revenant data");
      console.error(`outpost array is ${outpostEntityQuery.length} vs ${revenantEntityQuery.length} revenants`);
    } else {
      console.log("%cLength check for outpost and revenant arrays has passed successfully", "color: green");
    }

    if (outpostEntityQuery.length !== clientEntityIndexQuery.length - 1) {
      passed = TestResults.ERROR;
      console.error("There is a descrepency in outpost and entity index comp");
      console.error(`outpost array is ${outpostEntityQuery.length} vs ${clientEntityIndexQuery.length-1} revenants`);
    } else {
      console.log("%cLength check for outpost and revenant arrays has passed successfully", "color: green");
    }

    if (outpostEntityQuery.length !== clientOutpostEntityQuery.length || clientOutpostEntityQuery.length !== revenantEntityQuery.length) {
      console.error("There is a descrepency in outpost and revenant data");
      console.error(`outpost array is ${outpostEntityQuery.length} vs ${revenantEntityQuery.length} revenants vs ${clientOutpostEntityQuery.length} outpost data client`);
      passed = TestResults.ERROR;
    } else {
      console.log("%cLength check for client outpost data arrays has passed successfully", "color: green");
    }

    const biggestArray = (outpostEntityQuery.length >= clientOutpostEntityQuery.length && outpostEntityQuery.length >= revenantEntityQuery.length) ? outpostEntityQuery :
      (clientOutpostEntityQuery.length >= outpostEntityQuery.length && clientOutpostEntityQuery.length >= revenantEntityQuery.length) ? clientOutpostEntityQuery :
        revenantEntityQuery;

    if (biggestArray.length !== gameEntityCounter.outpost_count) {
      passed = TestResults.ERROR;
      console.error("The biggest possible array is not equal to the right outpost count, IGNORE IF IN PREP PHASE");
    }
    else {
      console.log("%cLength matches the entity counter", "color: green");
    }

    for (let index = 0; index < biggestArray.length; index++) {
      const entityId = biggestArray[index];

      console.log("------------------")
      const outpostData = getComponentValue(contractComponents.Outpost, entityId);
      const revenantData = getComponentValue(contractComponents.Revenant, entityId);
      const clientOutpostData = getComponentValue(clientComponents.ClientOutpostData, entityId);

      console.log(`Data for entity ${entityId}`)
      if (outpostData !== null || outpostData !== undefined) {
        console.log(outpostData);
      }
      else {
        console.error("outpostData is non existant for this entity");
        passed = TestResults.ERROR;
      }

      if (revenantData !== null || revenantData !== undefined) {
        console.log(revenantData);
      }
      else {
        console.error("revenantData is non existant for this entity");
        passed = TestResults.ERROR;
      }

      if (clientOutpostData !== null || clientOutpostData !== undefined) {
        console.log(clientOutpostData);
      }
      else {
        console.error("ClientOutpostData is non existant for this entity");
        passed = TestResults.ERROR;
      }
    }

    setRevenantCheckOutcome(passed);
  }


  const worldEventSanityCheck = () => {
    let passed = TestResults.PASSED;

    console.log("STARTING WORLD EVENT SANITY CHECK")

    if (worldEventEntityQuery.length !== gameEntityCounter.event_count) {
      console.log("%cThe world event array is not equal to the right event count, (shouldnt be a massive issue)", "color: orange");
      passed = TestResults.WARNING;
    }
    else {
      console.log("%cLength matches the entity counter", "color: green");
    }

    for (let index = 0; index < worldEventEntityQuery.length; index++) {
      const entityId = worldEventEntityQuery[index];

      console.log("------------------")
      const worldEventData = getComponentValue(contractComponents.WorldEvent, entityId);

      console.log(`Data for entity ${entityId}`)
      if (worldEventData !== null || worldEventData !== undefined) {
        console.log(worldEventData);
      }
      else {
        passed = TestResults.ERROR;
        console.error("worldEventData is non existant for this entity")
      }
    }

    setEventCheckOutcome(passed);
  }

  const createEvent = () => 
  {
    const createEventProps: CreateEventProps = {
      account: account,
      game_id: game_id
    }

    create_event(createEventProps);
  }

  const gameId = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)])).current_game_id;

  return (
    <ClickWrapper className="game-page-container">

    <img className="page-img" src="./assets/Page_Bg/PROFILE_PAGE_BG.png" alt="testPic" />

      <h1 style={{ color: "white" , position:"relative"}}>Debug Menu (number inside brackets indicate the correct numbers for each comp type)</h1>
      <div className="buttons-holder" style={{position:"relative"}}>

        <div className="data-container">
          <div className="button-style-debug">This is a button</div>
          <div className="content-holder">
            <h3>The current address is {account.address}</h3>
            <h3>The current balance is {getComponentValue(contractComponents.PlayerInfo, getEntityIdFromKeys([BigInt(game_id), BigInt(account.address)]))?.reinforcement_count || -1 }</h3>
          </div>
        </div>

        <div className="data-container">
          <div className="button-style-debug" onMouseDown={() => { revenantSanityCheck() }}>Revenant Section, Click to check for missing data</div>
          <div className="content-holder">
            <h3>There are currently {outpostEntityQuery.length} outposts and {revenantEntityQuery.length} revenants (~{gameEntityCounter.outpost_count})</h3>
            {revenantCheckOutcome === TestResults.NONE && <h3>Run a sanity check...</h3>}
            {revenantCheckOutcome === TestResults.PASSED && <h3 style={{ color: 'green' }}>Sanity check Passed</h3>}
            {revenantCheckOutcome === TestResults.ERROR && <h3 style={{ color: 'red' }}>Sanity check Failed</h3>}
          </div>
        </div>

        <div className="data-container">
          <div className="button-style-debug" onMouseDown={() => { }}>Query Check everthing</div>
          <div className="content-holder">
            <h3>There are currently {gameEntityQuery.length} games (1)</h3>
            <h3>There are currently {gameTrackerEntityQuery.length} game tracker (1)</h3>
            <h3>There are currently {gameEntityCounterEntityQuery.length} game entity counter (1)</h3>
            <h3>There are currently {clientEntityIndexQuery.length} client outpost data ({getComponentValue(contractComponents.GameEntityCounter, getEntityIdFromKeys([BigInt(gameId)])).revenant_count|| -1})</h3>
            <h3>Current Game id is {gameId} and should be {getComponentValue(contractComponents.GameTracker, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)])).count  || -1}</h3>
          </div>
        </div>

        <div className="data-container">
          <div className="button-style-debug" onMouseDown={() => { }}>Client Side</div>
          <div className="content-holder">
            <h3>There are currently {clientCameraEntityQuery.length} camera entity (1) </h3>
            <h3>There are currently {clientClickPosEntityQuery.length} click entity (1) </h3>
            <h3>There are currently {clientGameEntityQuery.length} client game (1) </h3>
            <h3>There are currently {clientOutpostEntityQuery.length} client outpost data  (~{gameEntityCounter.outpost_count})</h3>
          </div>
        </div>

        <div className="data-container">
          <div className="button-style-debug" onMouseDown={() => { worldEventSanityCheck() }}>Event Section, Click to check for missing data</div>
          <div className="content-holder">
            <h3>There are currently {worldEventEntityQuery.length} events ({gameEntityCounter.event_count}) </h3>
            <button onMouseDown={() => { createEvent() }}>Manually create Event</button>
            {eventCheckOutcome === TestResults.NONE && <h3>Run a sanity check...</h3>}
            {eventCheckOutcome === TestResults.PASSED && <h3 style={{ color: 'green' }}>Sanity check Passed</h3>}
            {eventCheckOutcome === TestResults.ERROR && <h3 style={{ color: 'red' }}>Sanity check Failed</h3>}
            {eventCheckOutcome === TestResults.WARNING && <h3 style={{ color: 'orange' }}>Minor possible issue detected</h3>}
          </div>
        </div>

      </div>
    </ClickWrapper>
  );
};
