import cards from "../generated/cards.json";

const ITEM_LIMIT = 7;
const CHAOS_PER_FORAGE = 3;

export type GameStats = {
    chaos: number,
    power: number,
    hotCold: number,
    lightDark: number,
    barriers: number,
}

export type SpellcrafterGame = {
    // the game stats for this current game
    stats: GameStats,
    // The card indices that the player is holding
    cards: Array<number>,
}

export function newGame(): SpellcrafterGame {
    return {
        stats: {
            chaos: 0,
            power: 0,
            hotCold: 0,
            lightDark: 0,
            barriers: 3,
        },
        cards: [],
    }
}

export async function interact(game: SpellcrafterGame, cardId: number): Promise<void> {
    enactCard(game, cardId);
    if (cards[cardId].consumable) {
        game.cards.splice(game.cards.indexOf(cardId), 1);
    }
}

export async function forage(game: SpellcrafterGame, region: number): Promise<void> {
    if (game.cards.length >= ITEM_LIMIT) {
        console.error("too many cards");
    }

    // return a random card from within the region
    const regionString = ["forest", "meadow", "volcano", "cave"][region];
    let regionCards = cards.filter((card) => card.card_type === regionString);
    let card = regionCards[randomInteger(0, regionCards.length - 1)];

    game.cards.push(parseInt(card.card_id));
    game.stats.chaos += CHAOS_PER_FORAGE;
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
        game.stats.barriers += parseOrZero(card.barriers_delta);
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