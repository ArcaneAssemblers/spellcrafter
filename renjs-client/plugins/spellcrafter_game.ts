import cards from "../generated/cards.json";

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
    let cardId = randomInteger(0, cards.length - 1);
    game.cards.push(cardId);
    game.stats.chaos += 3;
}


///// helpers //////

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
