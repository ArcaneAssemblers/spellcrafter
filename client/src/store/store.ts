import { create } from "zustand";
import { NetworkLayer } from "../dojo/createNetworkLayer";

export type Store = {
    networkLayer: NetworkLayer | null;
    currentGameId: string | null;
    setCurrentGameId: (currentGameId: string | null) => void;
};

export const useStore = create<Store>((set) => ({
    networkLayer: null,
    currentGameId: null,
    setCurrentGameId: (currentGameId: string | null) => set(() => ({ currentGameId })),
}));

