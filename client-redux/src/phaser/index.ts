declare var scenes: any


import { createPhaserEngine } from "@latticexyz/phaserx";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { registerSystems } from "./systems/registerSystems";
import { namespaceWorld } from "@latticexyz/recs";

export type PhaserLayer = Awaited<ReturnType<typeof createPhaserLayer>>;
type PhaserEngineConfig = Parameters<typeof createPhaserEngine>[0];

export const createPhaserLayer = async (
  networkLayer: NetworkLayer,
  phaserConfig: PhaserEngineConfig
) => {
  const world = namespaceWorld(networkLayer.world, "phaser");
  const {
    game,
    scenes,
    dispose: disposePhaser,
  } = await createPhaserEngine(phaserConfig);
  world.registerDisposer(disposePhaser);

  const { camera } = scenes.Main;

  // camera.phaserCamera.setBounds(-1000, -1000, 2000, 2000);    // need to set the bounds for the camera
  camera.phaserCamera.centerOn(0, 0);

  const components = {};

  const layer = {
    networkLayer,
    world,
    game,
    scenes,
    components,
  };

  registerSystems(layer);

  return layer;
};
