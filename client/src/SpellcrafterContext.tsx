import { createContext, useContext, useState } from 'react';
import { EntityIndex } from "@latticexyz/recs";
import { useDojo } from './DojoContext';

type GameActions = {
    // create a new game and set it to be active
    newGame: () => Promise<void>,
    // call to play a card in the current active game
    interact: (cardId: number) => Promise<void>,
    // make a forage action in t
    forage: (region: number) => Promise<void>,
}

type GameStats = {
    chaos: number,
    power: number,
    hotCold: number,
    lightDark: number,
    barriers: number,
}

type SpellcrafterContext = {
    // All games that belong to the current account as set by the dojo context
    games: Array<EntityIndex>,
    // currently selected game
    activeGame: EntityIndex | null,
    // change which came is currently active
    setActiveGame: (gameId: EntityIndex) => void,
    // the game stats for this current game
    stats: GameStats,
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
            systemCalls: { newGame },
            components: { ValueInGame, Owner },
            network: { graphSdk }
        },
        account: { create, list, select, account, isDeploying }
    } = dojo;

    // state held in this context
    const [activeGame, setActiveGame] = useState<EntityIndex | null>(null);
    const [games, setGames] = useState<Array<EntityIndex>>([]);
    const [stats, setStats] = useState<GameStats>({ chaos: 0, power: 0, hotCold: 0, lightDark: 0, barriers: 0 });
    const [cards, setCards] = useState<Array<number>>([]);

    const actions = {
        newGame: async () => {
            await newGame(account);
            // set the new game as the active one..
        },
        interact: async (cardId: number) => {
            // todo
        },
        forage: async (region: number) => {
            // todo
        }
    }

    const contextValue: SpellcrafterContext = {
        games: [],
        activeGame,
        setActiveGame,
        stats,
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
