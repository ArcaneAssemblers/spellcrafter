import { create } from "zustand";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { PhaserLayer } from "../phaser";

export type Store = {
    networkLayer: NetworkLayer | null;
};

export const store = create<Store>(() => ({
    networkLayer: null,
}));

