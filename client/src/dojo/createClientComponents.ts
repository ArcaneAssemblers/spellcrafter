import { overridableComponent } from "@latticexyz/recs";
import { SetupNetworkResult } from "./setupNetwork";


export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ contractComponents, clientComponents }: SetupNetworkResult) {
    return {
        ...contractComponents,

        Valueingame: overridableComponent(contractComponents.Valueingame),
        Owner: overridableComponent(contractComponents.Owner),
        Familiar: overridableComponent(contractComponents.Familiar),
        Occupied: overridableComponent(contractComponents.Occupied),

    };
}
