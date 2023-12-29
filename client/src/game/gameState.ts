
import { GetGameDataQuery } from "../generated/graphql";
import { SpellStats, POLAR_STAT_MIDPOINT } from "./config";
import cardDefs from "../generated/cards.json";
import { padHex } from "../utils";

export type GameStats = {
    chaos: number,
    power: number,
    hotCold: number,
    lightDark: number,
    barriers: number,
}

export type Familiar = {
    id: number,
    familiarType: string,
    busyUntil: number,
    hasItem: boolean,
}

type FamiliarOccupation = {
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

export async function gameStateFromGameValuesQuery({ valueingameModels, familiarModels, ownerModels }: GetGameDataQuery): SpellcrafterGame {

    const gameValues = new Map<number, number>();
    let gameOwner = null;

    ownerModels?.edges?.forEach((entity) => {
        entity?.node?.entity?.models?.forEach((model) => {
            switch (model?.__typename) {
                case "Owner":
                    gameOwner = model?.address;
                    break;
                default:
                    break;
            }
        })
    })

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

    const time = gameValues.get(SpellStats.Ticks) || 0;

    const cards = cardDefs.map((def): [number, number] => {
        return [parseInt(def.card_id), gameValues.get(parseInt(def.card_id)) || 0]
    }).filter(([_, count]) => count)

    const familiar = familiarModels?.edges?.map((entity) => {
        let familiar: Familiar | null  = {};
        entity?.node?.entity?.models?.forEach((model) => {
            switch (model?.__typename) {
                case "Familiar":
                    familiar.id = parseInt(model?.entity_id);
                    familiar.familiarType = model?.familiar_type;
                    break;
                case "Occupied":
                    familiar.busyUntil = model?.until || 0;
                    familiar.hasItem = model?.reaped == false && model?.doing !== "None" && model?.until <= time;
                    break;
                case "Owner":
                    console.log(model?.address, gameOwner)
                    if (model?.address != gameOwner) {
                        // the familiar has been sacrificed!
                        familiar = null;
                        return;
                    }
                    break;
                default:
                    break;
            }
        })
        return familiar;
    }
    )[0] || null;

    // return a game object with all fields zero
    return {
        time,
        stats: {
            chaos: gameValues.get(SpellStats.Chaos) || 0,
            power: gameValues.get(SpellStats.Power) || 0,
            hotCold: (gameValues.get(SpellStats.HotCold) || POLAR_STAT_MIDPOINT) - POLAR_STAT_MIDPOINT,
            lightDark: (gameValues.get(SpellStats.LightDark) || POLAR_STAT_MIDPOINT) - POLAR_STAT_MIDPOINT,
            barriers: gameValues.get(SpellStats.Barriers) || 0,
        },
        cards,
        familiar,
    }
}
