import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EntityIndex } from "@latticexyz/recs";
import { useDojo } from './DojoContext';
import { useEntityQuery, useComponentValue } from '@latticexyz/react';
import { getEntityIdFromKeys } from '@dojoengine/utils';
import { setComponent, HasValue } from '@latticexyz/recs';
import { SpellStats, Region, POLAR_STAT_MIDPOINT } from './dojo/gameConfig';
import cardDefs from './generated/cards.json';

type GameActions = {
    // create a new game and set it to be active
    newGame: () => Promise<void>,
    // call to play a card in the current active game
    interact: (cardId: number) => Promise<void>,
    // make a forage action in t
    forage: (region: number) => Promise<void>,
}

type GameStats = {
    chaos: number | undefined,
    power: number | undefined,
    hotCold: number | undefined,
    lightDark: number | undefined,
    barriers: number | undefined,
}

type SpellcrafterContext = {
    // All games that belong to the current account as set by the dojo context
    games: Array<EntityIndex>,
    // currently selected game
    activeGame: EntityIndex | undefined,
    // change which came is currently active
    setActiveGame: (gameId: EntityIndex) => void,
    // the game stats for this current game
    stats: GameStats | null,
    // The cards that the player is holding in this game [card_id, number_owned]
    cards: Array<[number, number]>,
    // call these functions to perform actions in the current game
    actions: GameActions,
}

const SpellcrafterContext = createContext<SpellcrafterContext | null>(null);

export const SpellcrafterProvider = ({ children }: { children: React.ReactNode }) => {
    const currentValue = useContext(SpellcrafterContext);
    if (currentValue) throw new Error("SpellcrafterProvider can only be used once");

    // use value to produce a new SpellcrafterContext
    const dojo = useDojo();
    if (!dojo) throw new Error("SpellcrafterProvider must be used inside a DojoProvider");

    const {
        setup: {
            systemCalls: { newGame, interact, forage },
            components: { ValueInGame, Owner },
            network: { graphSdk }
        },
        account: { account }
    } = dojo;

    // state held in this context
    const [activeGame, setActiveGame] = useState<EntityIndex | undefined>(undefined);
    const games = useEntityQuery([HasValue(Owner, { address: account.address })])

    const fetchGames = useCallback(async (address: string) => {
        const { data: { ownerComponents } } = await graphSdk.getPlayersGames({ address: address });
        ownerComponents?.edges?.forEach((entity) => {
            const keys = entity?.node?.entity?.keys
            const entityIndex = getEntityIdFromKeys(keys as any);
            entity?.node?.entity?.components?.forEach((component) => {
                switch (component?.__typename) {
                    case "Owner":
                        setComponent(Owner, entityIndex, { address: component?.address })
                        break;
                    default:
                        break;
                }
            })
        })
    }, [Owner, graphSdk]);

    // repopulate the games list when the account changes
    useEffect(() => {
        if (!account.address) {
            setActiveGame(undefined);
            return;
        }
        fetchGames(account.address);
    }, [account.address, fetchGames]);

    // update when the games list changes
    useEffect(() => {
        setActiveGame(games[games.length - 1]);
    }, [games])

    // use a graphql query to bootstrap the game data store when the active game changes
    useEffect(() => {
        if (!activeGame) return;
        const fetchStats = async () => {
            const { data: { valueingameComponents } } = await graphSdk.getGameValues({ game_id: "0x" + Number(activeGame).toString(16) });
            valueingameComponents?.edges?.forEach((entity) => {
                const keys = entity?.node?.entity?.keys?.map((key) => BigInt(key!))
                const entityIndex = getEntityIdFromKeys(keys as any);
                entity?.node?.entity?.components?.forEach((component) => {
                    switch (component?.__typename) {
                        case "ValueInGame":
                            setComponent(ValueInGame, entityIndex, { value: component?.value })
                            break;
                        default:
                            break;
                    }
                })
            })
        }
        fetchStats();
    }, [activeGame, ValueInGame, graphSdk]);

    const actions = {
        newGame: async () => {
            if (!account.address) throw new Error("No active account");
            await newGame(account);
            // TODO: This is a huge hack and depends on waiting for the indexer
            // For some reason the entities produces from the chain events are not triggering
            // the useEntityQuery hook to update. Need to figure that out so things work properly
            setTimeout(() => {
                fetchGames(account.address)
            }, 2000)
        },
        interact: async (cardId: number) => {
            if (!activeGame) throw new Error("No active game");
            await interact(account, activeGame, cardId as EntityIndex)
        },
        forage: async (region: Region) => {
            if (!activeGame) throw new Error("No active game");
            await forage(account, activeGame, region as EntityIndex)
        }
    }

    // hook to bind to a ValueInGame for the current game
    const useGameValue = (valueId: number): number | undefined => {
        return useComponentValue(ValueInGame, getEntityIdFromKeys([BigInt(valueId), BigInt(parseInt((activeGame || -1).toString()!))]))?.value
    }

    // cannot use map here as we need to keep the useGameValue hook in scope
    // using the hook here is ok as cardDefs is static so there will be
    // the same number of calls each time
    const cards: Array<[number, number]> = [];
    for(const cardDef of cardDefs) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const count = useGameValue(parseInt(cardDef.card_id));
        if(count) {
            cards.push([parseInt(cardDef.card_id), count]);
        }
    }

    const contextValue: SpellcrafterContext = {
        games,
        activeGame,
        setActiveGame,
        stats: {
            chaos: useGameValue(SpellStats.Chaos),
            power: useGameValue(SpellStats.Power),
            barriers: useGameValue(SpellStats.Barriers),
            hotCold: (useGameValue(SpellStats.HotCold) || POLAR_STAT_MIDPOINT) - POLAR_STAT_MIDPOINT,
            lightDark: (useGameValue(SpellStats.LightDark) || POLAR_STAT_MIDPOINT) - POLAR_STAT_MIDPOINT,
        },
        cards,
        actions
    }

    return (
        <SpellcrafterContext.Provider value={contextValue}>
            {children}
        </SpellcrafterContext.Provider>
    )
}

export const useSpellcrafter = () => {
    const value = useContext(SpellcrafterContext);
    if (!value) throw new Error("Must be used within a SpellCraftProvider");
    return value;
};
