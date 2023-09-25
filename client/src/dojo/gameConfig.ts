
export enum SpellStats {
    Chaos = 10000,
    Power = 10001,
    Barriers = 10002,
    HotCold = 10003,
    LightDark = 10004,
};

export const SpellStatsDisplay: { [key in SpellStats]: string } = {
    [SpellStats.Chaos]: "Chaos",
    [SpellStats.Power]: "Power",
    [SpellStats.Barriers]: "Barriers",
    [SpellStats.HotCold]: "Hot/Cold",
    [SpellStats.LightDark]: "Light/Dark",
};


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

