declare var Phaser: any

import {
  defineSceneConfig,
  AssetType,
  defineScaleConfig,
  defineCameraConfig
} from "@latticexyz/phaserx";

import { Sprites, Assets, Scenes } from "./constants";

export const phaserConfig = {
    sceneConfig: {
        [Scenes.Main]: defineSceneConfig({

            assets: {
                [Assets.CastleHealthySelfAsset]: {
                    type: AssetType.Image,
                    key: Assets.CastleHealthySelfAsset,
                    path: "assets/Outpost_Icons/Blue_Outpost.png",
                },
                [Assets.CastleDamagedAsset]: {
                    type: AssetType.Image,
                    key: Assets.CastleDamagedAsset,
                    path: "assets/Outpost_Icons/Red_Outpost.png",
                },
                [Assets.CastleHealthyEnemyAsset]: {
                    type: AssetType.Image,
                    key: Assets.CastleHealthyEnemyAsset,
                    path: "assets/Outpost_Icons/Purple_Outpost.png",
                },
                [Assets.CastleDestroyedAsset]: {
                    type: AssetType.Image,
                    key: Assets.CastleDestroyedAsset,
                    path: "assets/Outpost_Icons/Grey_Outpost.png",
                },
                [Assets.CaslteSelectedAsset]: {
                    type: AssetType.Image,
                    key: Assets.CaslteSelectedAsset,
                    path: "assets/Outpost_Icons/White_Outpost.png",
                },
                [Assets.MapPicture]: {
                    type: AssetType.Image,
                    key: Assets.MapPicture,
                    path: "assets/rev_map_big.png",
                }
            },
            maps: {
            },
            sprites: {
                [Sprites.Castle]: {
                    assetKey: Assets.CastleHealthySelfAsset,
                },
                [Sprites.Map]: {
                    assetKey: Assets.MapPicture,
                },
            },
            animations: [
                
            ],
            tilesets: {
                
            },
        }),
    },
    scale: defineScaleConfig({
        parent: "phaser-game",
        zoom: 1,
        mode: Phaser.Scale.NONE,
    }),
    cameraConfig: defineCameraConfig({
        pinchSpeed: 0.01,
        wheelSpeed: 0,
        maxZoom: 2,
        minZoom: 0.4,
    }),

    cullingChunkSize: 10000 * 5024,
};
