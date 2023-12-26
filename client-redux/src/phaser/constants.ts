import { COLOUMNS_NUMBER, MAP_HEIGHT, MAP_WIDTH, ROWS_NUMBER } from "../utils/settingsConstants";

export enum Scenes {
    Main = "Main",
}

export enum Maps {
    Main = "Main",
}

export enum Sprites {
    Map,
    Castle
}

export enum Assets {
    MapPicture = "MapPicture",
    CastleHealthySelfAsset = "CastleHealthySelfAsset",
    CastleDamagedAsset = "CastleDamagedAsset",
    CastleHealthyEnemyAsset = "CastleHealthyEnemyAsset",
    CastleDestroyedAsset = "CastleDestroyedAsset",
    CaslteSelectedAsset = "CaslteSelectedAsset",
}

export const SCALE = 0.15;

export let OUTPOST_WIDTH = 0;
export let OUTPOST_HEIGHT = 0;
export function setWidthAndHeight(widht:number, height: number): void {
    OUTPOST_WIDTH = widht;
    OUTPOST_HEIGHT = height;
}

export const TILE_WIDTH = MAP_WIDTH / COLOUMNS_NUMBER;
export const TILE_HEIGHT = MAP_HEIGHT / ROWS_NUMBER;

export function getTileIndex(x: number, y: number): number {
    return Math.floor(x / TILE_WIDTH) + Math.floor(y / TILE_HEIGHT) * COLOUMNS_NUMBER;
}

export function coordinateToIndex(x: number, y: number): number {
    return y * COLOUMNS_NUMBER + x;
}

export function indexToCoordinate(index: number): { x: number, y: number } {
    const y = Math.floor(index / COLOUMNS_NUMBER);
    const x = index % COLOUMNS_NUMBER;
    return { x, y };
}

export function getAdjacentIndices(index: number): number[] {
    const { x, y } = indexToCoordinate(index);
    const adjacentCoordinates: { x: number, y: number }[] = [
        { x: x - 1, y: y },
        { x: x + 1, y: y },
        { x: x, y: y - 1 },
        { x: x, y: y + 1 },
        { x: x, y: y },
        { x: x - 1, y: y - 1 },
        { x: x - 1, y: y + 1 },
        { x: x + 1, y: y - 1 },
        { x: x + 1, y: y + 1 },
    ];

    return adjacentCoordinates
        .filter(coord => coord.x >= 0 && coord.x < COLOUMNS_NUMBER && coord.y >= 0 && coord.y < ROWS_NUMBER)
        .map(coord => coordinateToIndex(coord.x, coord.y));
}

export function isAdjacent(index1: number, index2: number): boolean {
    const { x: x1, y: y1 } = indexToCoordinate(index1);
    const { x: x2, y: y2 } = indexToCoordinate(index2);

    const distanceX = Math.abs(x1 - x2);
    const distanceY = Math.abs(y1 - y2);

    return distanceX <= 1 && distanceY <= 1;
}
 
