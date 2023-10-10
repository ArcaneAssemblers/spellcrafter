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
    console.log("interact with card: ", cardId);
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


///// helpers //////

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
