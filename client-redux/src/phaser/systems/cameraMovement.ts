
import {SCALE, getAdjacentIndices } from "../constants";

import { PhaserLayer } from "..";

import {
  defineSystem,
  Has,
  Not,
  getComponentValue,
  getComponentValueStrict,
  EntityIndex,
  runQuery,
  HasValue
} from "@latticexyz/recs";
import { setClientOutpostComponent } from "../../utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GAME_CONFIG_ID } from "../../utils/settingsConstants";

//too many for loops in this place this all needs to be rewritten
// HERE

export const cameraManager = (layer: PhaserLayer) => {
  const {
    world,
    scenes: {
      Main: { camera, objectPool },
    },
    networkLayer: {
      network: { clientComponents, contractComponents },
      components: { ClientOutpostData, ClientGameData, EntityTileIndex, ClientCameraPosition, ClientClickPosition },
    },
  } = layer;

  // this can be threaded

  defineSystem(world, [Has(ClientCameraPosition)], ({ entity }) => {

    const clientGameData = getComponentValue(ClientGameData, entity);
    const camPos = getComponentValue(ClientCameraPosition, entity);

    if (!camPos || !clientGameData) {   //check if its true
      console.log("there is a failure on the cam system movement function")
      return;
    }

    camera.centerOn(camPos.x, camPos.y);

    const entitiesAtTileIndex = Array.from(runQuery([HasValue(ClientOutpostData, { visible: true })]));

    for (let index = 0; index < entitiesAtTileIndex.length; index++) {
      const entityId = entitiesAtTileIndex[index];

      spriteTransform(entityId, camPos);
    }
  });

  function spriteTransform(outpostEntityValue: EntityIndex, camPos: any) {
    const playerObj = objectPool.get(outpostEntityValue, "Sprite");

    playerObj.setComponent({
      id: "texture",
      once: (sprite: any) => {

        //get the disatnce from the center cam to the sprite
        let distanceX = Math.abs(sprite.x - camPos.x);  
        let distanceY = Math.abs(sprite.y - camPos.y);

        //get the hypothenuse
        let totDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const clientData = getComponentValueStrict(ClientOutpostData, outpostEntityValue);

        let min = 150;
        let max = 600;

        sprite.setScale(SCALE);

        if (totDistance < min || clientData.selected) {
          sprite.alpha = 1;
          sprite.setScale(SCALE);
        } else if (totDistance > min && totDistance < max) {
          sprite.alpha = 1 - ((totDistance - min) / (max - min));
          sprite.setScale(SCALE * (1 - ((totDistance - min) / (max - min))));
        } else {
          sprite.alpha = 0;
          sprite.setScale(0);
          sprite.setVisible(false);
        }

      }
    });
  }


  // we need an array of outpost types so that would mean making another array which tbf we already do then loop this array on return

  // function sortByDistance(arr: { x: number; y: number }[], targetX: number, targetY: number): { x: number; y: number }[] {
  //   // Calculate distances and sort the array based on distance
  //   const sortedArray = arr.sort((a, b) => {
  //     const distanceA = Math.sqrt(Math.pow(a.x - targetX, 2) + Math.pow(a.y - targetY, 2));
  //     const distanceB = Math.sqrt(Math.pow(b.x - targetX, 2) + Math.pow(b.y - targetY, 2));
  //     return distanceA - distanceB;
  //   });

  //   return sortedArray;
  // }


  //this can be threaded
  defineSystem(world, [Has(EntityTileIndex)], ({ entity }) => {
    const camIndex = getComponentValue(EntityTileIndex, entity);
    const clientGameData = getComponentValue(ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));

    if (entity !== "0x1") {
      return;
    }

    if (!camIndex || !clientGameData || entity !== "0x1") {   //check if its true
      console.error("there is a failure in the cam system for index")
      return;
    }

    const camTileIndex = camIndex.tile_index;

    const adjecentData = getAdjacentIndices(camTileIndex);

    const visibleOutposts = Array.from(runQuery([HasValue(ClientOutpostData, { visible: true })]));
    const selectedOutpost = Array.from(runQuery([HasValue(ClientOutpostData, { selected: true })]));

    let arrOfEntitiesInIndexes: any = [];

    for (let index = 0; index < adjecentData.length; index++) {
      const tileIndex = adjecentData[index];

      const entitiesAtTileIndex = Array.from(runQuery([HasValue(EntityTileIndex, { tile_index: tileIndex }), Not(ClientCameraPosition)]));

      arrOfEntitiesInIndexes = arrOfEntitiesInIndexes.concat(entitiesAtTileIndex);
    }

    const mergedEntities = [...new Set([...arrOfEntitiesInIndexes, ...visibleOutposts, ...selectedOutpost])];

    for (let index = 0; index < mergedEntities.length; index++) {
      const entityId = mergedEntities[index];

      const indexOfEntity = getComponentValueStrict(EntityTileIndex, entityId);

      const clientOutpostData = getComponentValueStrict(ClientOutpostData, entityId);

      // i dont really like this if statment like this
      if (selectedOutpost.length > 0) {
        if (selectedOutpost[0] === entityId) {
          continue;
        }
      }

      if (adjecentData.includes(indexOfEntity.tile_index)) {
        setClientOutpostComponent(clientOutpostData.id, clientOutpostData.owned, clientOutpostData.event_effected, clientOutpostData.selected, true, clientComponents, contractComponents, 1);
      }
      else {
        setClientOutpostComponent(clientOutpostData.id, clientOutpostData.owned, clientOutpostData.event_effected, clientOutpostData.selected, false, clientComponents, contractComponents, 1);
      }
    }
  });
}