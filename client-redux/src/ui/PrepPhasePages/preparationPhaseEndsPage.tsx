//libs
import React, { useEffect, useState } from "react";
import { PrepPhaseStages } from "./prepPhaseManager";
import { getComponentValueStrict } from "@latticexyz/recs";

import { ClickWrapper } from "../clickWrapper";
import { useDojo } from "../../hooks/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";

//styles
import "./PagesStyles/PrepPhaseEndsPageStyles.css";
import "./PagesStyles/BuyingPageStyle.css";
import { GAME_CONFIG_ID } from "../../utils/settingsConstants";

//components

//pages

/*notes
    this page is fine 
*/

interface PrepPhaseEndsPageProps {
    setMenuState: React.Dispatch<PrepPhaseStages>;
}

export const PrepPhaseEndsPage: React.FC<PrepPhaseEndsPageProps> = ({ setMenuState }) => {
    const [showBlocks, setShowBlocks] = useState(true);
    const [blocksLeft, setBlocksLeft] = useState(0);

    const [freeRevs, setFreeRevs] = useState<number>(10);

    const toggleShowBlocks = () => {
        setShowBlocks((prevShowBlocks) => !prevShowBlocks);
    };

    const {
        networkLayer: {
          network: { contractComponents, clientComponents }
        },
      } = useDojo();


    const clientGame = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));
    
    const gameData = getComponentValueStrict(contractComponents.Game, getEntityIdFromKeys([BigInt(clientGame.current_game_id)]));
    const gameEntityCounter = getComponentValueStrict(contractComponents.GameEntityCounter, getEntityIdFromKeys([BigInt(clientGame.current_game_id)]));


    useEffect(() => {
        const blocksLeft = (gameData.start_block_number + gameData.preparation_phase_interval) - clientGame.current_block_number!;
        setBlocksLeft(blocksLeft);
    }, [clientGame]);


    useEffect(() => {
        setFreeRevs(Number(gameData.max_amount_of_revenants) - Number(gameEntityCounter.revenant_count));
    }, [gameEntityCounter, gameData]);

 
    return (
        <div className="ppe-page-container">
            <img src="./assets/Page_Bg/PREP_PHASE_WAIT_BG.png"  alt="testPic" />
            <ClickWrapper className="content-space">
                <h1 style={{textAlign:"center", fontFamily:"Zelda", fontSize:"3cqw", fontWeight:"100"}}>PREPARATION PHASE ENDS IN<br/>
                    <span onMouseDown={()=> {setShowBlocks(!showBlocks)}}>{showBlocks ? `BLOCKS LEFT: ${blocksLeft}` : `DD:5 HH5 MM:3 SS:50`}</span>
                </h1>
                <div className="global-button-style" style={{fontSize:"1.8cqw", marginBottom:"2%" ,padding:"5px 10px"}} onMouseDown={() => {setMenuState(PrepPhaseStages.PROFILE)}}>Place your Reinforcements</div>
                <div style={{fontSize:"1.2cqw",height:"fit-content", display:"flex",gap:"20px" ,flexDirection:"row", justifyContent:"center", alignItems:"center"}}>

                {freeRevs > 0 ? (
                        <div onMouseDown={() => {setMenuState(PrepPhaseStages.BUY_REVS)}} className="global-button-style" style={{padding:"5px 10px"}}>Summon more Revenants</div>
                    ) : (

                        <div  className="global-button-style" style={{padding:"5px 10px", opacity:"0.5"}}>Summon more Revenants</div>
                    )}
                    
                        
                    <div onMouseDown={() => {setMenuState(PrepPhaseStages.BUY_REIN)}} className="global-button-style" style={{padding:"5px 10px"}}>Buy more Reinforcements</div>
                </div>
            </ClickWrapper>
        </div>
    );
};
