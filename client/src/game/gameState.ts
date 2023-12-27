
import { GetGameValuesQuery } from "../generated/graphql";
import { SpellStats, POLAR_STAT_MIDPOINT } from "./config";
import cardDefs from "../generated/cards.json";

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
    cards: Array<[number, number]>,
    // card index of familiar (if present)
    familiar: Familiar | null,
}

export function gameStateFromGameValuesQuery({ valueingameModels }: GetGameValuesQuery): SpellcrafterGame {

    let gameValues = new Map<number, number>();

    valueingameModels?.edges?.forEach((entity) => {
        entity?.node?.entity?.models?.forEach((model) => {
            switch (model?.__typename) {
                case "Valueingame":
                    gameValues.set(parseInt(model?.entity_id), model?.value);
                    break;
                default:
                    break;
            }
        })
    })

    console.log(gameValues);

    const cards = cardDefs.map((def): [number, number] => {
        return [parseInt(def.card_id), gameValues.get(parseInt(def.card_id)) || 0]
    }).filter(([_, count]) => count)

    // return a game object with all fields zero
    return {
        time: gameValues.get(SpellStats.Ticks) || 0,
        stats: {
            chaos: gameValues.get(SpellStats.Chaos) || 0,
            power: gameValues.get(SpellStats.Power) || 0,
            hotCold: (gameValues.get(SpellStats.HotCold) || POLAR_STAT_MIDPOINT) - POLAR_STAT_MIDPOINT,
            lightDark: (gameValues.get(SpellStats.LightDark) || POLAR_STAT_MIDPOINT) - POLAR_STAT_MIDPOINT,
            barriers: gameValues.get(SpellStats.Barriers) || 0,
        },
        cards,
        familiar: null,
    }
}
