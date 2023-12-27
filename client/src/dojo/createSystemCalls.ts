import { SetupNetworkResult } from "./setupNetwork";
import { toast } from 'react-toastify';
import { Account } from "starknet";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute }: SetupNetworkResult,
) {

    const notify = (message: string, succeeded: boolean) => {
        if (!succeeded) {
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
        else {
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

    const createGame = async (account: Account) => {
        try {
            const tx = await execute(account, "spellcrafter_system", "new_game", []);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            console.log(receipt)
            notify('Game Created!', true)
        } catch (e) {
            console.log(e)
            notify(`Error creating game ${e}`, false)
        }
    };

    const forage = async (account: Account, gameId: number, region: number) => {
        try {
            const tx = await execute(account, "spellcrafter_system", "forage", [gameId, region]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            console.log(receipt)
            notify('Successfully foraged!', true)
        } catch (e) {
            console.log(e)
            notify(`Error foraging ${e}`, false)
        }
    };

    const interact = async (account: Account, gameId: number, itemId: number) => {
        try {
            const tx = await execute(account, "spellcrafter_system", "interact", [gameId, itemId]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            console.log(receipt)
            notify('Successfully foraged!', true)
        } catch (e) {
            console.log(e)
            notify(`Error foraging ${e}`, false)
        }
    };

    const summon = async (account: Account, gameId: number, familiarType: number) => {
        try {
            const tx = await execute(account, "spellcrafter_system", "summon", [gameId, familiarType]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            console.log(receipt)
            notify('Successfully summoned!', true)
        } catch (e) {
            console.log(e)
            notify(`Error summoning ${e}`, false)
        }
    };

    const send = async (account: Account, gameId: number, familiarId: number) => {
        try {
            const tx = await execute(account, "spellcrafter_system", "send", [gameId, familiarId]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            console.log(receipt)
            notify('Successfully sent familiar!', true)
        } catch (e) {
            console.log(e)
            notify(`Error sending familiar ${e}`, false)
        }
    };

    const sacrifice = async (account: Account, gameId: number, familiarId: number) => {
        try {
            const tx = await execute(account, "spellcrafter_system", "sacrifice", [gameId, familiarId]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            console.log(receipt)
            notify('Successfully sacrificed!', true)
        } catch (e) {
            console.log(e)
            notify(`Error sacrificing ${e}`, false)
        }
    };

    const reapAction = async (account: Account, gameId: number, entityId: number) => {
        try {
            const tx = await execute(account, "spellcrafter_system", "reap_action", [gameId, entityId]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            console.log(receipt)
            notify('Successfully reaped action!', true)
        } catch (e) {
            console.log(e)
            notify(`Error reaping action ${e}`, false)
        }
    };


    const wait = async (account: Account, gameId: number) => {
        try {
            const tx = await execute(account, "spellcrafter_system", "wait", [gameId]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            console.log(receipt)
            notify('Successfully waited!', true)
        } catch (e) {
            console.log(e)
            notify(`Error waiting ${e}`, false)
        }
    };

    return {
        createGame,
        forage,
        interact,
        summon,
        send,
        reapAction,
        wait,
        sacrifice,
    };
}
