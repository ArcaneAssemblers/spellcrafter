import { PhaserLayer } from "..";

import { cameraManager } from "./cameraMovement";
import { mapSpawn } from "./mapSpawn";
import { spawnOutposts } from "./outpostSystems";
import { clickManager } from "./clickManager";
import {eventManager} from "./eventSystem";

export const registerSystems = (layer: PhaserLayer) => {
    cameraManager(layer);
    mapSpawn(layer);
    spawnOutposts(layer);
    clickManager(layer);
    eventManager(layer);
};