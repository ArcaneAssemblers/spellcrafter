import { SetupNetworkResult } from "./setupNetwork";
import { ClientComponents } from "./createClientComponents";
import { getEntityIdFromKeys, getEvents,  setComponentsFromEvents} from "@dojoengine/utils";
import {  getComponentValueStrict } from "@latticexyz/recs";

import { CreateGameProps, CreateRevenantProps, ConfirmEventOutpost, CreateEventProps, PurchaseReinforcementProps, ReinforceOutpostProps, CreateTradeFor1Reinf, RevokeTradeReinf, PurchaseTradeReinf, ClaimScoreRewards } from "./types/index"

import { toast } from 'react-toastify';
import { setClientOutpostComponent } from "../utils";
import { GAME_CONFIG_ID } from "../utils/settingsConstants";

//HERE

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents, clientComponents, call }: SetupNetworkResult,
    {
        GameEntityCounter,
        
        Outpost,
        ClientGameData
    }: ClientComponents
) {

    //HERE SHOULD BE DONE need to fix the notify to actually change if it fails or not
    // THIS SHOULD ALSO HAVE A LINK

    const notify = (message: string, succeeded: boolean) => 
    {
        if (!succeeded){
            toast("❌ " + message, {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else{
            toast("✅ " + message, {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }


    //TO DELETE
    const create_game = async ({ account, preparation_phase_interval, event_interval, erc_addr, reward_pool_addr,revenant_init_price , max_amount_of_revenants}: CreateGameProps) => {

        try {
            const tx = await execute(account, "game_actions", "create", [preparation_phase_interval, event_interval, erc_addr, reward_pool_addr,revenant_init_price, max_amount_of_revenants]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )

            // setComponentsFromEvents(contractComponents,
            //     getEvents(receipt)
            // );

            console.log(receipt)

            notify('Game Created!',true)
        } catch (e) {
            console.log(e)
            notify(`Error creating game ${e}`, false)
        }
    };

    return {
        create_game,
    };
}

function hexToDecimal(hexString: string): number {
    const decimalResult: number = parseInt(hexString, 16);
    return decimalResult;
}