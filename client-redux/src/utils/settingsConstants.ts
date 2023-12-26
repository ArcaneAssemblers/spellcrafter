
import { EntityIndex } from "@latticexyz/recs";


export const GAME_CONFIG_ID: EntityIndex = 1 as EntityIndex;

export const MAP_WIDTH = 10240;
export const MAP_HEIGHT = 5164;

export const COLOUMNS_NUMBER = 50;
export const ROWS_NUMBER = 25;


let refreshOwnOutpostDataTimer: number = 90;
export function setRefreshOwnOutpostDataTimer(newFOV: number): void {
    refreshOwnOutpostDataTimer = newFOV;
}
export function getRefreshOwnOutpostDataTimer(): number {
  return refreshOwnOutpostDataTimer;
}