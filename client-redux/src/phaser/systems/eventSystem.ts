declare var Phaser: any

import {
    Has,
    defineSystem,
    getComponentValueStrict, getComponentValue,
    getComponentEntities,
  } from "@latticexyz/recs";
  import { PhaserLayer } from "..";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { setClientGameComponent, setClientOutpostComponent } from "../../utils";
import { GAME_CONFIG_ID } from "../../utils/settingsConstants";

  export const eventManager = (layer: PhaserLayer) => {
    const {
      world,
      networkLayer: {
        network: { clientComponents , contractComponents},
        components: { Outpost, WorldEvent, ClientOutpostData , GameEntityCounter, ClientGameData},
      },
    } = layer;
  
    defineSystem(world, [Has(GameEntityCounter)], ({ entity }) => {

      const clientGameData = getComponentValueStrict(ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));
      const game_id = clientGameData.current_game_id;

      const gameEntityCounter = getComponentValueStrict(GameEntityCounter, getEntityIdFromKeys([BigInt(game_id)]));

      if (gameEntityCounter.event_count === clientGameData.current_event_drawn) {return;}

      if (gameEntityCounter.event_count <= 0 ) {return;}

      // this should be the last event that is always fetched
      const dataEvent = getComponentValue(WorldEvent, getEntityIdFromKeys([BigInt(game_id), BigInt(gameEntityCounter.event_count)]))

      if (dataEvent === null || dataEvent === undefined) {return;}

      setClientGameComponent(clientGameData.current_game_state, clientGameData.current_game_id, clientGameData.current_block_number, clientGameData.guest , Number(dataEvent.entity_id),clientComponents);

      const phaserScene = layer.scenes.Main.phaserScene;
      // Destroy all graphics objects in the scene
      phaserScene.sys.displayList.each((child) => {
        if (child instanceof Phaser.GameObjects.Graphics) {
            child.destroy();
        }
      });

      const graphics = phaserScene.add.graphics();
      graphics.lineStyle(3, 0xff0000); // Set line style for the outline
      graphics.strokeCircle(dataEvent.x, dataEvent.y, dataEvent.radius); // Draw the outline of a circle with a radius of 50

      let radius = dataEvent.radius;
      let positionX = dataEvent.x;
      let positionY = dataEvent.y;
  
      const outpostEntities = getComponentEntities(Outpost);
      const outpostArray = Array.from(outpostEntities);
  
      for (const outpostEntityValue of outpostArray) {

        const outpostClientData = getComponentValueStrict(ClientOutpostData, outpostEntityValue);
        const outpostEntityData = getComponentValueStrict(Outpost, outpostEntityValue);

        if (outpostEntityData.last_affect_event_id >= gameEntityCounter.event_count)
        {
          setClientOutpostComponent(outpostClientData.id, outpostClientData.owned, false, outpostClientData.selected, outpostClientData.visible, clientComponents, contractComponents, game_id)
          continue;
        }

        const distance = Math.sqrt(
          (Number(outpostEntityData.x) - positionX) ** 2 + (Number(outpostEntityData.y)- positionY) ** 2
        );

        if (distance <= radius) {
          setClientOutpostComponent(outpostClientData.id, outpostClientData.owned, true, outpostClientData.selected, outpostClientData.visible, clientComponents ,  contractComponents,game_id)
        }
        else 
        {
          setClientOutpostComponent(outpostClientData.id, outpostClientData.owned, false, outpostClientData.selected, outpostClientData.visible, clientComponents,  contractComponents,game_id)
        }
      }
    });
  };
  