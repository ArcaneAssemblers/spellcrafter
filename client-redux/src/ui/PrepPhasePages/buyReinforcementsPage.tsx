//libs
import React, { useEffect, useState } from "react";
import { PrepPhaseStages } from "./prepPhaseManager";
import { toast } from 'react-toastify';
import { PurchaseReinforcementProps } from "../../dojo/types";
import {getComponentValueStrict} from "@latticexyz/recs";

//styles
import "./PagesStyles/BuyingPageStyle.css"

//elements/components
import { ClickWrapper } from "../clickWrapper";
import CounterElement from "../Elements/counterElement";
import { useDojo } from "../../hooks/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { hexToNumber } from "../../utils";
import { GAME_CONFIG_ID } from "../../utils/settingsConstants";

//pages

/*notes
    mostly finished just need to bring in the VRGDA so there is that to query
    maybe the space between the counter and the button should be a little smaller

    THERE IS ALSO THE FACT THAT IT DOESNT SCALE WELL AT ALL
*/


interface BuyReinforcementsPageProps {
    setMenuState: React.Dispatch<PrepPhaseStages>;
}

const notify = (message: string) => toast(message, {
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
});

export const BuyReinforcementPage: React.FC<BuyReinforcementsPageProps> = ({ setMenuState }) => {
    const [reinforcementNumber, setReinforcementNumber] = useState(2);
    const [priceOfReinforcements, setPriceOfReinforcements] = useState<number>(5);

    const [freeRevs, setFreeRevs] = useState<number>(10);

    const {
        account: { account },
        networkLayer: {
            network: { clientComponents,contractComponents },
            systemCalls : { purchase_reinforcement, get_current_reinforcement_price },
        },
        
    } = useDojo();

    // need here a useffect for the price of the reinforcements
    const clientGameData = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));

    const gameComponent = getComponentValueStrict(contractComponents.Game, getEntityIdFromKeys([BigInt(clientGameData.current_game_id)]));
    const gameEntityCounter = getComponentValueStrict(contractComponents.GameEntityCounter, getEntityIdFromKeys([BigInt(clientGameData.current_game_id)]));


    const buyReinforcements = async (num: number) => {
        
        notify(`Purchasing ${num} Reinforcements...`);

        const props: PurchaseReinforcementProps = {
            account: account,
            game_id: clientGameData.current_game_id,
            count: BigInt(num),
        };

        await purchase_reinforcement(props);
    }

    useEffect(() => {
        const intervalId = setInterval(call_price_update, 5000);
        
        return () => clearInterval(intervalId);
      }, []);
    
    const call_price_update = async () => {
        const current_price = await get_current_reinforcement_price(clientGameData.current_game_id, 1);
        setPriceOfReinforcements(hexToNumber(current_price));
    };

    useEffect(() => {
        setFreeRevs(Number(gameComponent.max_amount_of_revenants) - Number(gameEntityCounter.revenant_count));
    }, [gameEntityCounter, gameComponent]);

    return (
        <div className="game-page-container" style={{ display: "flex", flexDirection: "row", color: "white" }}>
        <img className="page-img brightness-down" src="./assets/Page_Bg/REINFORCEMENTS_PAGE_BG.png" alt="testPic" />
        
        <div style={{ height: "100%",margin:"0px 5%", width: "90%", position: "relative", display: "flex", flexDirection: "column" }}>
            <div style={{ height: "20%", width: "100%", position: "relative",display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                {freeRevs > 0 && <ClickWrapper onMouseDown={() => { setMenuState(PrepPhaseStages.BUY_REVS); }} className="global-button-style"
                        style={{ padding: "5px 10px", fontSize: "1.3cqw" }}>
                    <img className="embedded-text-icon" src="Icons/Symbols/left_arrow.svg" alt="Sort Data" />
                    Summon more Revenants
                </ClickWrapper>}
            </div>
            <ClickWrapper style={{ height: "50%", width: "100%", position: "relative",  display:"flex", justifyContent:"center", flexDirection:"column"}}>
                <h2 className="main-content-header">BUY REINFORCEMENTS</h2>
                <CounterElement value={reinforcementNumber} setValue={setReinforcementNumber} containerStyleAddition={{maxWidth:"30%"}}  additionalButtonStyleAdd={{padding:"2px", boxSizing:"border-box"}} textAddtionalStyle={{fontSize:"2cqw"}}/>
                <div className="global-button-style" style={{ width: "fit-content", fontSize: "1.3cqw", padding: "5px 10px", fontWeight: "100" }} onMouseDown={() => { buyReinforcements(reinforcementNumber) }}>Summon (Tot: ≈{reinforcementNumber * priceOfReinforcements} $Lords)</div>
            </ClickWrapper>
            <div style={{ height: "20%", width: "100%", position: "relative" }}> </div>

            <div style={{ height: "10%", width: "100%", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: "100", fontFamily: "OL", color: "white", fontSize:"1.4rem" }}> 1 Reinforcement ≈ {priceOfReinforcements} $LORDS</div>
                <ClickWrapper onMouseDown={() => { setMenuState(PrepPhaseStages.WAIT_PHASE_OVER); }} className="global-button-style"
                        style={{ padding: "5px 10px", fontSize: "1.3cqw" }}
                    > Continue

                        <img className="embedded-text-icon" src="Icons/Symbols/right_arrow.svg" alt="Right Arrow" onMouseDown={() => { }} />
                </ClickWrapper>
            </div>
        </div>

    </div>
    )
}
