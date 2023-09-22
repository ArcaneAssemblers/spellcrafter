import { SetupNetworkResult } from "./setupNetwork";
import { Account } from "starknet";
import { EntityIndex, getComponentValue } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { getEvents, setComponentsFromEvents } from "@dojoengine/utils";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
    { ValueInGame, Owner }: ClientComponents
) {

    const newGame = async (signer: Account) => {
        const tx = await execute(signer, "NewGame", []);
        console.log(tx)
        const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })
        setComponentsFromEvents(contractComponents, getEvents(receipt));
    }

    const interact = async (signer: Account, gameId, EntityIndex, cardId: EntityIndex) => {
        const tx = await execute(signer, "Interact", [gameId, cardId]);
        console.log(tx)
        const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })
        setComponentsFromEvents(contractComponents, getEvents(receipt));
    }

    return {
        newGame,
        interact
    };
}
