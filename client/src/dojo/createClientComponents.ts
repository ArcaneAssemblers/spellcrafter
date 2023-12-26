import { overridableComponent } from "@latticexyz/recs";
import { SetupNetworkResult } from "./setupNetwork";


export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ contractComponents, clientComponents }: SetupNetworkResult) {
    return {
        ...contractComponents,

        Game: overridableComponent(contractComponents.Game),
        GameEntityCounter: overridableComponent(contractComponents.GameEntityCounter),
        GameTracker: overridableComponent(contractComponents.GameTracker),
        Outpost: overridableComponent(contractComponents.Outpost),
        OutpostPosition: overridableComponent(contractComponents.OutpostPosition),
        Revenant: overridableComponent(contractComponents.Revenant),
        PlayerInfo: overridableComponent(contractComponents.PlayerInfo),
        WorldEvent: overridableComponent(contractComponents.WorldEvent),
        WorldEventTracker: overridableComponent(contractComponents.WorldEventTracker),

        ...clientComponents,

        ClientCameraPosition: overridableComponent(clientComponents.ClientCameraPosition),
        ClientClickPosition: overridableComponent(clientComponents.ClientClickPosition),
        ClientOutpostData: overridableComponent(clientComponents.ClientOutpostData),
        ClientGameData: overridableComponent(clientComponents.ClientGameData),
        EntityTileIndex: overridableComponent(clientComponents.EntityTileIndex),
    };
}

//pretty sure this is unnecessary