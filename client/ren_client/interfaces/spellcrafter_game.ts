
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

export interface ISpellcrafterGame {
    // number of ticks since the start of the game
    time: number
    // the game stats for this current game
    stats: GameStats,
    // The card indices that the player is holding
    cards: Array<[number, number]>,
    // card index of familiar (if present)
    familiar: Familiar | null,

    // Game actions
    interact: (cardId: number) => Promise<void>;
    forage: (region: string) => Promise<void>;
    summonFamiliar: (region: string) => Promise<void>;
    sendFamiliar: () => Promise<void>;
    sacrificeFamiliar: () => Promise<void>;
    claimFamiliarItem: () => Promise<void>;
    wait: () => Promise<void>;
}
