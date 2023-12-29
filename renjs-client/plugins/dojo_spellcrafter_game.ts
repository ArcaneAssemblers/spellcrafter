import cards from "../generated/cards.json";
import { Familiar, GameStats, ISpellcrafterGame } from "../interfaces/spellcrafter_game";

import { RPCProvider, Query } from "@dojoengine/core";
import { Account } from "starknet";
import manifest from "../../contracts/target/dev/manifest.json";

const WORLD_ADDRESS = "0x2ba64186dfea9dc387674f356c97dd9f5755e3105246d42061532940ec641bc";
const NODE_URL = "http://0.0.0.0:5050";

export class DojoSpellcrafterGame implements ISpellcrafterGame {
    _time: number;
    _stats: GameStats;
    _cards: number[];
    _familiar: Familiar | null;

    constructor(data: any) {
        this._time = data.time;
        this._stats = data.stats;
        this._cards = data.cards;
        this._familiar = data.familiar;
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
        enactCard(this, cardId);
        if (cards[cardId].consumable == "TRUE") {
            this._cards.splice(this._cards.indexOf(cardId), 1);
        }
        return Promise.resolve();
    }

    forage(region: string): Promise<void> {
        if (this._cards.length >= ITEM_LIMIT) {
            throw new Error("too many cards");
        }
    
        // return a random card from within the region
        let regionCards = cards.filter((card) => card.card_type === region);
        let card = regionCards[randomInteger(0, regionCards.length - 1)];
    
        this._cards.push(parseInt(card.card_id));
        this._stats.chaos += CHAOS_PER_FORAGE;
        this._stats.power += POWER_PER_FORAGE;
        this._time += TICKS_PER_FORAGE;
        
        this.approachSpell();
        return Promise.resolve();
    }

    summonFamiliar(region: string): Promise<void> {
        if (this._familiar) {
            throw new Error("already have a familiar");
        }
        console.log("summoning familiar", region+"_familiar");
        let card = cards.find((card) => card.card_type == region+"_familiar");
        if (card) {
            this._familiar = { id: parseInt(card.card_id), busyUntil: 0, hasItem: false, region };
            this._stats.chaos += CHAOS_PER_SUMMON;
            this._time += TICKS_PER_SUMMON;
    
        } else {
            throw new Error("failed to find familiar for region")
        }
        this.approachSpell();
        return Promise.resolve();
    }

    sendFamiliar(): Promise<void> {
        if (!this._familiar) {
            throw new Error("no familiar to send");
        }
        if (this._familiar.busyUntil > this._time) {
            throw new Error("familiar is busy");
        }
        this._familiar.busyUntil = this._time + TICKS_FOR_FAMILIAR_FORAGE;
        this._familiar.hasItem = true;
        return Promise.resolve();
    }

    sacrificeFamiliar(): Promise<void> {
        if (!this._familiar) {
            throw new Error("no familiar to sacrifice");
        }
        if (this._familiar.busyUntil > this._time) {
            throw new Error("familiar is busy");
        }
        enactCard(this, this._familiar.id)
        this._familiar = null;
        return Promise.resolve();
    }

    claimFamiliarItem(): Promise<void> {
        if (!this._familiar) {
            throw new Error("No familiar owned");
        }
        if (this._familiar.busyUntil > this._time) {
            throw new Error("familiar has not returned");
        }
        if(!this._familiar.hasItem) {
            throw new Error("familiar has no item");
        }
        if (this._cards.length >= ITEM_LIMIT) {
            throw new Error("too many cards");
        }
    
        // return a random card from within the region of this familiar
        let regionCards = cards.filter((card) => card.card_type === this._familiar?.region);
        let card = regionCards[randomInteger(0, regionCards.length - 1)];
        this._cards.push(parseInt(card.card_id));
    
        this._familiar.hasItem = false;
        return Promise.resolve();
    }

    private approachSpell() {
        let roll = 2 * randomInteger(1, 20);
        if (roll < this._stats.chaos) {
            this._stats.barriers -= 1;
        }
    }
}


function enactCard(game: ISpellcrafterGame, cardId: number): void {
    const card = cards[cardId];
    if(
        lessThanOrNaN(game.stats.hotCold, -1 * parseInt(card.requires_cold_gt)) && 
        greaterThanOrNaN(game.stats.hotCold, parseInt(card.requires_hot_gt)) &&
        lessThanOrNaN(game.stats.lightDark, -1 * parseInt(card.requires_dark_gt)) &&
        greaterThanOrNaN(game.stats.lightDark, parseInt(card.requires_light_gt))
    ) {
        game.stats.chaos += parseOrZero(card.chaos_delta);
        game.stats.power += parseOrZero(card.power_delta);
        game.stats.hotCold += parseOrZero(card.hotcold_delta);
        game.stats.lightDark += parseOrZero(card.lightdark_delta);
        game.stats.barriers = Math.min(BARRIERS_LIMIT, game.stats.barriers + parseOrZero(card.barriers_delta));
    } else {
        game.stats.chaos += parseOrZero(card.chaos_delta_fallback);
        game.stats.power += parseOrZero(card.power_delta_fallback);
        game.stats.hotCold += parseOrZero(card.hotcold_delta_fallback);
        game.stats.lightDark += parseOrZero(card.lightdark_delta_fallback);
    }
}


///// helpers //////

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseOrZero(str: string): number {
    return parseInt(str) || 0;
}

function greaterThanOrNaN(a: number, b: number): boolean {
    return a > b || isNaN(b);
}

function lessThanOrNaN(a: number, b: number): boolean {
    return a < b || isNaN(b);
}