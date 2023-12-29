
export const POLAR_STAT_MIDPOINT = 2_147_483_647;

export enum SpellStats {
    Chaos = 10000,
    Power = 10001,
    Barriers = 10002,
    ItemsHeld = 10003,
    FamiliarsHeld = 10004,
    Ticks = 10005,

    HotCold = 20004,
    LightDark = 20005,
}

export const SpellStatsDisplay: { [key in SpellStats]: string } = {
    [SpellStats.Chaos]: "Chaos",
    [SpellStats.Power]: "Power",
    [SpellStats.Barriers]: "Barriers",
    [SpellStats.HotCold]: "Hot/Cold",
    [SpellStats.LightDark]: "Light/Dark",
    [SpellStats.ItemsHeld]: "Items Held",
    [SpellStats.FamiliarsHeld]: "Number of Familiars",
    [SpellStats.Ticks]: "Ticks",
}


export enum Region {
    Forest = 0,
    Meadow = 1,
    Volcano = 2,
    Cave = 3,
}

export const RegionDisplay: { [key in Region]: string } =  {
    [Region.Forest]: "Forest",
    [Region.Meadow]: "Meadow",
    [Region.Volcano]: "Volcano",
    [Region.Cave]: "Cave",
}

export const FamiliarDisplay: { [key in Region]: string } =  {
    [Region.Forest]: "Raven",
    [Region.Meadow]: "Cat",
    [Region.Volcano]: "Salamander",
    [Region.Cave]: "Wolf Spider",
}