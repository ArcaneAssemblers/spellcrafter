import { SetupNetworkResult } from "./setupNetwork";
import { toast } from 'react-toastify';
import { Account, GetTransactionReceiptResponse } from "starknet";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute }: SetupNetworkResult,
) {

    const notify = (message: string, succeeded: boolean) => {
        if (!succeeded) {
            toast("❌ " + message, {
                position: "top-left",
                autoClose: 3000,
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
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    const notifyTxRecept = (receipt: GetTransactionReceiptResponse) => {
        console.log(receipt)
        switch(receipt.execution_status) {
            case "SUCCEEDED":
                notify(`Transaction ${receipt.transaction_hash} succeeded!`, true);
                break;
            case "REVERTED":
                const match = receipt.revert_reason.match(/Failure reason: "(.*?)"/);
                const failureReason = match ? match[1] : null;
                notify(`Transaction failed: ${failureReason}`, false);
                break;
        }
    }

    const createGame = async (account: Account) => {
        try {
            const tx = await execute(account, "spellcrafter_system", "new_game", []);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            notifyTxRecept(receipt)
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
            notifyTxRecept(receipt)
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
            notifyTxRecept(receipt)
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
            notifyTxRecept(receipt)
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
            notifyTxRecept(receipt)
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
            notifyTxRecept(receipt)
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
            notifyTxRecept(receipt)
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
            notifyTxRecept(receipt)
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
