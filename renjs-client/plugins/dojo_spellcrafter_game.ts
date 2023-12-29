import { Familiar, GameStats, ISpellcrafterGame } from "../interfaces/spellcrafter_game";
import { call } from "esdeka";

export class DojoSpellcrafterGame implements ISpellcrafterGame {
    _time: number;
    _stats: GameStats;
    _cards: number[];
    _familiar: Familiar | null;
    host: Window;

    constructor(data: any, host: Window) {
        this._time = data.time;
        this._stats = data.stats;
        this._cards = data.cards;
        this._familiar = data.familiar;
        this.host = host;
    }

    get time(): number {
        return this._time;
    }

    get stats(): GameStats {
        return this._stats;
    }

    get cards(): number[] {
        return this._cards;
    }

    get familiar(): Familiar | null {
        return this._familiar;
    }

    interact(cardId: number): Promise<void> {
        return Promise.resolve();
    }

    forage(region: string): Promise<void> {
        const forageIndex = {"forest": 0, "meadow": 1, "volcano": 2, "cave": 3}[region];
        call(this.host, "forage", forageIndex);
        return Promise.resolve();
    }

    summonFamiliar(region: string): Promise<void> {
        return Promise.resolve();
    }

    sendFamiliar(): Promise<void> {
        return Promise.resolve();
    }

    sacrificeFamiliar(): Promise<void> {
        return Promise.resolve();
    }

    claimFamiliarItem(): Promise<void> {
        return Promise.resolve();
    }

}
