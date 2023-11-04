import cards from "../generated/cards.json";

const ITEM_LIMIT = 7;
const BARRIERS_LIMIT = 3;

const CHAOS_PER_FORAGE = 1;
const POWER_PER_FORAGE = 1;
const CHAOS_PER_SUMMON = 5;

const TICKS_PER_FORAGE = 2;
const TICKS_PER_SUMMON = 5;
const TICKS_FOR_FAMILIAR_FORAGE = 2;

export type GameStats = {
    chaos: number,
    power: number,
    hotCold: number,
    lightDark: number,
    barriers: number,
}

export type Familiar = {
    id: number,
    region: string,
    busyUntil: number,
    hasItem: boolean,
}

export type SpellcrafterGame = {
    // number of ticks since the start of the game
    time: number
    // the game stats for this current game
    stats: GameStats,
    // The card indices that the player is holding
    cards: Array<number>,
    // card index of familiar (if present)
    familiar: Familiar | null,
}


export function newGame(): SpellcrafterGame {
    return {
        time: 0,
        stats: {
            chaos: 0,
            power: 0,
            hotCold: 0,
            lightDark: 0,
            barriers: 3,
        },
        cards: [],
        familiar: null,
    }
}

export async function interact(game: SpellcrafterGame, cardId: number): Promise<void> {
    enactCard(game, cardId);
    if (cards[cardId].consumable == "TRUE") {
        game.cards.splice(game.cards.indexOf(cardId), 1);
    }
}

export async function forage(game: SpellcrafterGame, region: string): Promise<void> {
    if (game.cards.length >= ITEM_LIMIT) {
        throw new Error("too many cards");
    }

    // return a random card from within the region
    let regionCards = cards.filter((card) => card.card_type === region);
    let card = regionCards[randomInteger(0, regionCards.length - 1)];

    game.cards.push(parseInt(card.card_id));
    game.stats.chaos += CHAOS_PER_FORAGE;
    game.stats.power += POWER_PER_FORAGE;
    game.time += TICKS_PER_FORAGE;
}

export async function summonFamiliar(game: SpellcrafterGame, region: string): Promise<void> {
    if (game.familiar) {
        throw new Error("already have a familiar");
    }
    console.log("summoning familiar", region+"_familiar");
    let card = cards.find((card) => card.card_type == region+"_familiar");
    if (card) {
        game.familiar = { id: parseInt(card.card_id), busyUntil: 0, hasItem: false, region };
        game.stats.chaos += CHAOS_PER_SUMMON;
        game.time += TICKS_PER_SUMMON;

    } else {
        throw new Error("failed to find familiar for region")
    }
}

export async function sendFamiliar(game: SpellcrafterGame): Promise<void> {
    if (!game.familiar) {
        throw new Error("no familiar to send");
    }
    if (game.familiar.busyUntil > game.time) {
        throw new Error("familiar is busy");
    }
    game.familiar.busyUntil = game.time + TICKS_FOR_FAMILIAR_FORAGE;
    game.familiar.hasItem = true;
}

export async function sacrificeFamiliar(game: SpellcrafterGame): Promise<void> {
    if (!game.familiar) {
        throw new Error("no familiar to sacrifice");
    }
    if (game.familiar.busyUntil > game.time) {
        throw new Error("familiar is busy");
    }
    enactCard(game, game.familiar.id)
    game.familiar = null;
}

export async function claimFamiliarItem(game: SpellcrafterGame): Promise<void> {
    if (!game.familiar) {
        throw new Error("No familiar owned");
    }
    if (game.familiar.busyUntil > game.time) {
        throw new Error("familiar has not returned");
    }
    if(!game.familiar.hasItem) {
        throw new Error("familiar has no item");
    }
    if (game.cards.length >= ITEM_LIMIT) {
        throw new Error("too many cards");
    }

    // return a random card from within the region of this familiar
    let regionCards = cards.filter((card) => card.card_type === game.familiar?.region);
    let card = regionCards[randomInteger(0, regionCards.length - 1)];
    game.cards.push(parseInt(card.card_id));

    game.familiar.hasItem = false;
}

export async function approachSpell(game: SpellcrafterGame): Promise<void> {
    let roll = 2 * randomInteger(1, 20);
    if (roll < game.stats.chaos) {
        game.stats.barriers -= 1;
    }
}

function enactCard(game: SpellcrafterGame, cardId: number): void {
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