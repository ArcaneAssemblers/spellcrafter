import { SetupNetworkResult } from "./setupNetwork";
import { Account } from "starknet";
import { EntityIndex } from "@latticexyz/recs";
import { getEvents, setComponentsFromEvents } from "@dojoengine/utils";
import { Region } from "../dojo/gameConfig";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

const { VITE_PUBLIC_SPELLCRAFTER_SYSTEMS_ADDRESS } = import.meta.env;


export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
) {

    const newGame = async (signer: Account) => {
        const tx = await execute(signer, VITE_PUBLIC_SPELLCRAFTER_SYSTEMS_ADDRESS, "new_game", []);
        console.log(tx)
        const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })
        setComponentsFromEvents(contractComponents, getEvents(receipt));
    }

    const interact = async (signer: Account, gameId: EntityIndex, cardId: EntityIndex) => {
        const tx = await execute(signer, VITE_PUBLIC_SPELLCRAFTER_SYSTEMS_ADDRESS, "interact", [gameId, cardId]);
        console.log(tx)
        const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })
        setComponentsFromEvents(contractComponents, getEvents(receipt));
    }

    const forage = async (signer: Account, gameId: EntityIndex, region: Region) => {
        const tx = await execute(signer, VITE_PUBLIC_SPELLCRAFTER_SYSTEMS_ADDRESS, "forage", [gameId, region]);
        console.log(tx)
        const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })
        setComponentsFromEvents(contractComponents, getEvents(receipt));
    }

    return {
        newGame,
        interact,
        forage,
    };
}
