import { PhaserLayer } from "..";

import {
  EntityIndex,
  getComponentValueStrict,
  defineSystem,
  Has,
  getComponentEntities,
  getComponentValue,
  runQuery,
  HasValue,
} from "@latticexyz/recs";

import { setTooltipArray } from "./eventSystems/eventEmitter";
import { OUTPOST_HEIGHT, OUTPOST_WIDTH } from "../constants";
import { setClientClickPositionComponent } from "../../utils";

// this can be threaded

export const clickManager = (layer: PhaserLayer) => {
  const {
    world,
    scenes: {
      Main: { camera, input },
    },

    networkLayer: {
      network: { clientComponents },
      components: { Outpost, ClientClickPosition },
    },
  } = layer;

  input.pointerdown$.subscribe(({ pointer }) => {
    if (!pointer) {
      return;
    }

    const clickRelativeToMiddlePointX = pointer.x - camera.phaserCamera.width / 2;
    const clickRelativeToMiddlePointY = pointer.y - camera.phaserCamera.height / 2;

    setClientClickPositionComponent(pointer.x, pointer.y, clickRelativeToMiddlePointX, clickRelativeToMiddlePointY, clientComponents);

  });

  // Click checks for the ui tooltip
  defineSystem(world, [Has(ClientClickPosition)], ({ entity }) => {

    const positionClick = getComponentValue(ClientClickPosition, entity);
    const camPos = getComponentValue(clientComponents.ClientCameraPosition, entity);

    if (camPos === undefined || positionClick === undefined)
    {
      return;
    }

    const outpostArray = Array.from(runQuery([HasValue(clientComponents.ClientOutpostData, { visible: true })]));
    

    let zoomVal: number = 0;

    camera.zoom$.subscribe((zoom) => { zoomVal = zoom; });

    let positionX = (positionClick.xFromMiddle / zoomVal) + camPos.x;
    let positionY = (positionClick.yFromMiddle / zoomVal) + camPos.y;

    let foundEntity: EntityIndex[] = []; 


    for (const outpostEntityValue of outpostArray) {

      const outpostData = getComponentValueStrict(Outpost, outpostEntityValue);

      const minX = outpostData.x - (OUTPOST_WIDTH / 2);
      const minY = outpostData.y - (OUTPOST_HEIGHT / 2);

      const maxX = minX + OUTPOST_WIDTH;
      const maxY = minY + OUTPOST_HEIGHT;

      if (
        positionX >= minX &&
        positionX <= maxX &&
        positionY >= minY &&
        positionY <= maxY
      ) {
        foundEntity.push(outpostEntityValue);
      }
    }

    if (foundEntity.length > 0) {
      setTooltipArray.emit("setToolTipArray", foundEntity);
    }

  });

};
