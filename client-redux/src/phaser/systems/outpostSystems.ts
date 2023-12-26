import {
  Has,
  defineSystem,
  getComponentValueStrict,
  getComponentValue
} from "@latticexyz/recs";
import { PhaserLayer } from "..";
import { Assets, SCALE, getAdjacentIndices, setWidthAndHeight } from "../constants";
import { getEntityIdFromKeys } from "@dojoengine/utils";

export const spawnOutposts = (layer: PhaserLayer) => {

  const {
    world,
    scenes: {
      Main: { objectPool },
    },
    
    networkLayer: {
      components: { Outpost, ClientOutpostData, EntityTileIndex },
    },
  } = layer;

  defineSystem(world, [Has(ClientOutpostData)], ({ entity }) => {
    
    const outpostDojoData = getComponentValueStrict(Outpost, entity);
    const outpostClientData = getComponentValue(ClientOutpostData, entity);

    if (outpostClientData === undefined) {return}

    const outpostObj = objectPool.get(entity, "Sprite");

    outpostObj.setComponent({
      id: "position",
      once: (sprite:any) => {
        sprite.setPosition(outpostDojoData.x - (sprite.width * SCALE) / 2, outpostDojoData.y - (sprite.height * SCALE) / 2);
      },
    });

    outpostObj.setComponent({
      id: "texture",
      once: (sprite:any) => {

        if (outpostClientData.selected) {
          sprite.setTexture(Assets.CaslteSelectedAsset);
          
          sprite.depth = 1;
        }
        else {

            sprite.depth = 0;
            sprite.setVisible(true);

            if (outpostDojoData.lifes <= 0) {
              sprite.setTexture(Assets.CastleDestroyedAsset);
            }
            else {
              if (!outpostClientData.event_effected) {
                if (outpostClientData.owned) {
                  sprite.setTexture(Assets.CastleHealthySelfAsset);
                } else {
                  sprite.setTexture(Assets.CastleHealthyEnemyAsset);
                }
              }
              else {
                sprite.setTexture(Assets.CastleDamagedAsset);
              }
          }
        }

        if (outpostClientData.visible === false) 
        {
              sprite.setVisible(false);
        }

        setWidthAndHeight(sprite.width * SCALE, sprite.height * SCALE);
      },
    });

  });

  defineSystem(world, [Has(ClientOutpostData)], ({ entity }) => {
    const outpostClientData = getComponentValue(ClientOutpostData, entity);
    const entityTileIndex = getComponentValue(EntityTileIndex, entity);

    if (outpostClientData === undefined || entityTileIndex === undefined) {return}

    const cameraTileIndex = getComponentValueStrict(EntityTileIndex, getEntityIdFromKeys([BigInt(1)]));

    const outpostObj = objectPool.get(entity, "Sprite");

    outpostObj.setComponent({
      id: "texture",
      once: (sprite: any) => {

        const adj = getAdjacentIndices(cameraTileIndex.tile_index)

        if (!outpostClientData.selected && !adj.includes(entityTileIndex.tile_index))
        {
          sprite.setVisible(false);
        }
      },
    });
  });  
};
