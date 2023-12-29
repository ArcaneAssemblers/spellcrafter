import { Familiar, GameStats, ISpellcrafterGame } from "../interfaces/spellcrafter_game";
import { call, subscribe } from "esdeka";

export class DojoSpellcrafterGame implements ISpellcrafterGame {
    _time: number;
    _stats: GameStats;
    _cards: number[];
    _familiar: Familiar | null;
    host: Window;

    constructor(data: any, host: Window) {
        this.setFromData(data);
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
        let result = new Promise<void>((resolve, reject) => {
            let unsubscribe = subscribe("spellcrafter", event => {
                console.log("forage handeler received state:", event.data.action.payload);
                this.setFromData(event.data.action.payload);
                unsubscribe();
                resolve();
            });
        });
        call(this.host, "forage", forageIndex);
        return result;
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

    setFromData(data: any) {
        this._time = data.time;
        this._stats = data.stats;
        this._cards = data.cards;
        this._familiar = data.familiar;
    }

}
