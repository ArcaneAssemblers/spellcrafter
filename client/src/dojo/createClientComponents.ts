import { overridableComponent } from "@latticexyz/recs";
import { SetupNetworkResult } from "./setupNetwork";


export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ contractComponents, clientComponents }: SetupNetworkResult) {
    return {
        ...contractComponents,

        // Game: overridableComponent(contractComponents.Game),
        // GameEntityCounter: overridableComponent(contractComponents.GameEntityCounter),
        // GameTracker: overridableComponent(contractComponents.GameTracker),
        // Outpost: overridableComponent(contractComponents.Outpost),

        ...clientComponents,

    };
}

//pretty sure this is unnecessary