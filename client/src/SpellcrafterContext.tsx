import { createContext, useContext, useState, useEffect } from 'react';
import { EntityIndex } from "@latticexyz/recs";
import { useDojo } from './DojoContext';
import { useEntityQuery, useComponentValue } from '@dojoengine/react';
import { getEntityIdFromKeys } from '@dojoengine/utils';
import { setComponent, HasValue, getComponentValue } from '@latticexyz/recs';
import { SpellStats } from './dojo/gameConfig';

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
    activeGame: EntityIndex | null,
    // change which came is currently active
    setActiveGame: (gameId: EntityIndex) => void,
    // the game stats for this current game
    stats: GameStats | null,
    // The cards that the player is holding in this game
    cards: Array<number>,
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
        account: { create, list, select, account, isDeploying }
    } = dojo;

    // state held in this context
    const [activeGame, setActiveGame] = useState<EntityIndex | null>(null);
    const [cards, setCards] = useState<Array<number>>([]);

    // repopulate the games list when the account changes
    // this makes a graphql query and processes the response into the local entity store
    useEffect(() => {
        if (!account.address) return;
        const fetchGames = async () => {
            const { data: { ownerComponents } } = await graphSdk.getPlayersGames({ address: account.address });
            ownerComponents?.edges?.forEach((entity) => {
                let keys = entity?.node?.entity?.keys
                const entityIndex = getEntityIdFromKeys(keys);
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

        }
        fetchGames();
    }, [account]);

    // use a graphql query to boostrap the game data store when the active game changes
    useEffect(() => {
        if (!activeGame) return;
        const fetchStats = async () => {
            const { data: { valueingameComponents } } = await graphSdk.getGameValues({ game_id: "0x" + Number(activeGame).toString(16) });
            valueingameComponents?.edges?.forEach((entity) => {
                let keys = entity?.node?.entity?.keys?.map((key) => BigInt(key!))
                const entityIndex = getEntityIdFromKeys(keys);
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
    }, [activeGame]);

    const actions = {
        newGame: async () => {
            await newGame(account);
            // set the new game as the active one..
        },
        interact: async (cardId: number) => {
            await interact(account, cardId)
        },
        forage: async (region: number) => {
            // todo
        }
    }

    const contextValue: SpellcrafterContext = {
        games: useEntityQuery([HasValue(Owner, { address: account.address })]),
        activeGame,
        setActiveGame,
        stats: {
            chaos: useComponentValue(ValueInGame, getEntityIdFromKeys([BigInt(SpellStats.Chaos), BigInt(parseInt((activeGame || 999).toString()!))]))?.value,
            power: useComponentValue(ValueInGame, getEntityIdFromKeys([BigInt(SpellStats.Power), BigInt(parseInt((activeGame || 999).toString()!))]))?.value,
            hotCold: useComponentValue(ValueInGame, getEntityIdFromKeys([BigInt(SpellStats.HotCold), BigInt(parseInt((activeGame || 999).toString()!))]))?.value,
            lightDark: useComponentValue(ValueInGame, getEntityIdFromKeys([BigInt(SpellStats.LightDark), BigInt(parseInt((activeGame || 999).toString()!))]))?.value,
            barriers: useComponentValue(ValueInGame, getEntityIdFromKeys([BigInt(SpellStats.Barriers), BigInt(parseInt((activeGame || 999).toString()!))]))?.value,
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
