import { Familiar, GameStats, ISpellcrafterGame } from "../interfaces/spellcrafter_game";
import { call, subscribe } from "esdeka";

export class DojoSpellcrafterGame implements ISpellcrafterGame {
    _time: number;
    _stats: GameStats;
    _cards: Array<[number, number]>;
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

    get cards(): Array<[number, number]> {
        return this._cards;
    }

    get familiar(): Familiar | null {
        return this._familiar;
    }

    _sendActionAndAwaitState(action: string, data: any): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => {
            let unsubscribe = subscribe("spellcrafter", event => {
                console.log("received state:", event.data.action.payload);
                this.setFromData(event.data.action.payload);
                unsubscribe();
                resolve();
            });
        });
        call(this.host, "command", { action, data });
        return promise;
    }

    interact(cardId: number): Promise<void> {
        return this._sendActionAndAwaitState("interact", cardId)
    }

    forage(region: string): Promise<void> {
        const forageIndex = {"forest": 0, "meadow": 1, "volcano": 2, "cave": 3}[region];
        return this._sendActionAndAwaitState("forage", forageIndex);
    }

    summonFamiliar(region: string): Promise<void> {
        const familiarIndex = {"forest": 0, "meadow": 1, "volcano": 2, "cave": 3}[region];
        return this._sendActionAndAwaitState("summon", familiarIndex);
    }

    sendFamiliar(): Promise<void> {
        return this._sendActionAndAwaitState("send", this.familiar?.id);
    }

    sacrificeFamiliar(): Promise<void> {
        return this._sendActionAndAwaitState("sacrifice", this.familiar?.id);
    }

    claimFamiliarItem(): Promise<void> {
        // use the local state to check if a transaction should be made to claim the item
        if (!this._familiar) {
            throw new Error("No familiar owned");
        }
        if (this._familiar.busyUntil > this._time) {
            throw new Error("familiar has not returned");
        }
        if(!this._familiar.hasItem) {
            throw new Error("familiar has no item");
        }

        return this._sendActionAndAwaitState("reap", this.familiar?.id);
    }

    wait(): Promise<void> {
        return this._sendActionAndAwaitState("wait", null);
    }

    setFromData(data: any) {
        this._time = data.time;
        this._stats = data.stats;
        this._cards = data.cards;
        this._familiar = data.familiar;
    }

}
