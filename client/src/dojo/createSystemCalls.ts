import { SetupNetworkResult } from "./setupNetwork";
import { ClientComponents } from "./createClientComponents";

import { toast } from 'react-toastify';

import { Account, num } from "starknet";

//HERE

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents, clientComponents, call }: SetupNetworkResult,
    { Owner }: ClientComponents
) {

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

    const create_game = async (account: Account) => {

        try {
            const tx = await execute(account, "spellcrafter_system", "new_game", []);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )

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